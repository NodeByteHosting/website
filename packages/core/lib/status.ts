/**
 * Server-side only — STATUS_TOKEN is never sent to the browser.
 *
 * Fetches monitor data from the status.nodebyte.host public status API
 * and normalises it into the flat, typed shape the website needs.
 */

export type MonitorStatus = "up" | "down" | "degraded" | "maintenance" | "paused" | "unknown"
export type MonitorType = "http" | "tcp" | "smtp" | "ping" | "group"

export interface StatusHeartbeat {
  checked_at: number
  status: "up" | "down" | "maintenance" | "unknown"
  latency_ms: number | null
}

export interface StatusMonitor {
  id: number
  name: string
  type: MonitorType
  group_name: string | null
  subgroup_name: string | null
  status: MonitorStatus
  last_checked_at: number | null
  last_latency_ms: number | null
  heartbeats: StatusHeartbeat[]
  uptime_30d_pct: number | null
}

export interface StatusSnapshot {
  generated_at: number
  overall_status: MonitorStatus
  monitors: StatusMonitor[]
}

function getConfig(): { host: string; token: string | undefined } {
  const host = process.env.STATUS_API_URL
  if (!host) {
    throw new Error("Status API misconfigured: STATUS_API_URL must be set.")
  }
  return { host, token: process.env.STATUS_TOKEN }
}

async function fetchStatusJson(host: string, token: string | undefined): Promise<Record<string, unknown>> {
  const res = await fetch(`${host}/api/v1/public/status`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 30 },
  })

  if (res.status === 503 && token) {
    // The status app's edge proxy refuses to forward the Authorization header
    // upstream until its own UPTIMER_API_SENSITIVE_ORIGIN is configured. Fall
    // back to the unauthenticated public payload rather than failing outright.
    const body = await res.clone().json().catch(() => null)
    if (body?.error?.code === "API_ORIGIN_UNTRUSTED_FOR_SENSITIVE_HEADERS") {
      return fetchStatusJson(host, undefined)
    }
  }

  if (!res.ok) {
    throw new Error(`Status API returned ${res.status}`)
  }

  return res.json()
}

/** Fetch the current status snapshot. Returns null on any failure so callers can fall back to static data. */
export async function fetchStatusSnapshot(): Promise<StatusSnapshot | null> {
  try {
    const { host, token } = getConfig()
    const data = await fetchStatusJson(host, token)
    const rawMonitors = Array.isArray(data.monitors) ? (data.monitors as Record<string, unknown>[]) : []

    const monitors: StatusMonitor[] = rawMonitors.map((m) => ({
      id: m.id as number,
      name: m.name as string,
      type: m.type as MonitorType,
      group_name: (m.group_name as string | null) ?? null,
      subgroup_name: (m.subgroup_name as string | null) ?? null,
      status: m.status as MonitorStatus,
      last_checked_at: (m.last_checked_at as number | null) ?? null,
      last_latency_ms: (m.last_latency_ms as number | null) ?? null,
      heartbeats: Array.isArray(m.heartbeats) ? (m.heartbeats as StatusHeartbeat[]) : [],
      uptime_30d_pct:
        m.uptime_30d && typeof (m.uptime_30d as Record<string, unknown>).uptime_pct === "number"
          ? ((m.uptime_30d as Record<string, unknown>).uptime_pct as number)
          : null,
    }))

    return {
      generated_at: data.generated_at as number,
      overall_status: data.overall_status as MonitorStatus,
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

/** Compute fast/avg/slow latency (ms) from a monitor's recent heartbeats. */
export function computeLatencyStats(monitor: StatusMonitor): { fast: number; avg: number; slow: number } | null {
  const samples = monitor.heartbeats
    .map((h) => h.latency_ms)
    .filter((ms): ms is number => typeof ms === "number")

  if (samples.length === 0) return null

  const fast = Math.min(...samples)
  const slow = Math.max(...samples)
  const avg = Math.round(samples.reduce((sum, ms) => sum + ms, 0) / samples.length)
  return { fast, avg, slow }
}
