/**
 * Server-side fetch for nodebytestat.us's public status API — fully public,
 * no auth required. Normalises it into the flat, typed shape the website
 * needs.
 */

export type MonitorStatus = "up" | "down" | "degraded" | "maintenance" | "paused" | "unknown"

export interface StatusMonitor {
  id: string
  name: string
  /** Name of the monitor's immediate parent group, e.g. "Game Nodes", "Data Centres > Europe". */
  group_name: string | null
  status: MonitorStatus
  last_checked_at: number | null
  last_latency_ms: number | null
  uptime_30d_pct: number | null
}

export interface StatusSnapshot {
  generated_at: number
  overall_status: MonitorStatus
  monitors: StatusMonitor[]
}

type ComponentStatus = "OPERATIONAL" | "DEGRADED_PERFORMANCE" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE" | "UNDER_MAINTENANCE"
type Indicator = "NONE" | "MINOR" | "MAJOR" | "CRITICAL"

interface RawComponent {
  id: string
  name: string
  status: ComponentStatus
  groupId: string | null
  uptimePct: number | null
  monitor: { lastStatus: string | null; lastResponseMs: number | null; lastCheckedAt: string | null } | null
}

interface RawGroup {
  id: string
  name: string
  parentId: string | null
  components: RawComponent[]
  children: RawGroup[]
}

interface RawStatusResponse {
  status: { indicator: Indicator; description: string }
  groups: RawGroup[]
  components: RawComponent[]
}

const COMPONENT_STATUS_MAP: Record<ComponentStatus, MonitorStatus> = {
  OPERATIONAL: "up",
  DEGRADED_PERFORMANCE: "degraded",
  PARTIAL_OUTAGE: "down",
  MAJOR_OUTAGE: "down",
  UNDER_MAINTENANCE: "maintenance",
}

const INDICATOR_MAP: Record<Indicator, MonitorStatus> = {
  NONE: "up",
  MINOR: "degraded",
  MAJOR: "down",
  CRITICAL: "down",
}

function getConfig(): { host: string } {
  const host = process.env.STATUS_API_URL
  if (!host) {
    throw new Error("Status API misconfigured: STATUS_API_URL must be set.")
  }
  return { host }
}

/** Walk the group tree (including nested children) into a flat id → display-path map, e.g. "Europe" under "Data Centres" becomes "Data Centres > Europe". */
function buildGroupNameMap(groups: RawGroup[], parentPath = ""): Map<string, string> {
  const map = new Map<string, string>()
  for (const group of groups) {
    const path = parentPath ? `${parentPath} > ${group.name}` : group.name
    map.set(group.id, path)
    for (const [id, name] of buildGroupNameMap(group.children, path)) {
      map.set(id, name)
    }
  }
  return map
}

/** Fetch the current status snapshot. Returns null on any failure so callers can fall back to static data. */
export async function fetchStatusSnapshot(): Promise<StatusSnapshot | null> {
  try {
    const { host } = getConfig()
    const res = await fetch(`${host}/api/status`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    })

    if (!res.ok) {
      throw new Error(`Status API returned ${res.status}`)
    }

    const data: RawStatusResponse = await res.json()
    const groupNames = buildGroupNameMap(data.groups)

    const monitors: StatusMonitor[] = data.components.map((c) => ({
      id: c.id,
      name: c.name,
      group_name: c.groupId ? (groupNames.get(c.groupId) ?? null) : null,
      status: COMPONENT_STATUS_MAP[c.status] ?? "unknown",
      last_checked_at: c.monitor?.lastCheckedAt ? Math.floor(Date.parse(c.monitor.lastCheckedAt) / 1000) : null,
      last_latency_ms: c.monitor?.lastResponseMs ?? null,
      uptime_30d_pct: c.uptimePct,
    }))

    return {
      generated_at: Math.floor(Date.now() / 1000),
      overall_status: INDICATOR_MAP[data.status.indicator] ?? "unknown",
      monitors,
    }
  } catch (error) {
    console.error("Failed to fetch status snapshot:", error)
    return null
  }
}

/** Find a monitor by exact name (case-insensitive). */
export function findMonitor(snapshot: StatusSnapshot | null, name: string): StatusMonitor | null {
  if (!snapshot) return null
  const target = name.trim().toLowerCase()
  return snapshot.monitors.find((m) => m.name.trim().toLowerCase() === target) ?? null
}

/**
 * Names of individual node monitors — any monitor whose immediate group name
 * ends in "Nodes" (e.g. "Game Nodes", "VPS Nodes"). This is the live source
 * of truth for which nodes exist on /nodes. Add a node under a "*Nodes"
 * group on nodebytestat.us and it appears here automatically — no website
 * code change needed.
 */
export function getNodeMonitorNames(snapshot: StatusSnapshot | null): string[] {
  if (!snapshot) return []
  return snapshot.monitors
    .filter((m) => {
      const leafGroup = m.group_name?.split(" > ").pop()?.trim()
      return leafGroup?.toLowerCase().endsWith("nodes") ?? false
    })
    .map((m) => m.name)
}

/** Single-sample "latency" — the new status API only exposes the most recent check, not a rolling history. */
export function computeLatencyStats(monitor: StatusMonitor): { fast: number; avg: number; slow: number } | null {
  if (monitor.last_latency_ms == null) return null
  return { fast: monitor.last_latency_ms, avg: monitor.last_latency_ms, slow: monitor.last_latency_ms }
}
