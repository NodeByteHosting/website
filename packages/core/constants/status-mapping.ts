/**
 * The node list on /nodes is discovered live from nodebytestat.us — any
 * monitor whose group name ends in "Nodes" (e.g. "Game Nodes", "VPS Nodes",
 * see getNodeMonitorNames in lib/status.ts) — adding a node there is all
 * that's needed for it to appear on the site.
 *
 * nodebytestat.us doesn't carry location/hardware details, so those are
 * filled in here as optional per-node overrides, keyed by the exact monitor
 * name. A node with no entry here still shows up, just without these extras.
 */
export const NODE_DISPLAY_OVERRIDES: Record<string, { locationCode?: string; cpu?: string; ramType?: string }> = {
  "NEWC-GAME1": { locationCode: "Newcastle, UK" },
  "NEWY-GAME1": { locationCode: "New York, US" },
  "HEL-VPS1": { locationCode: "Helsinki, FI" },
  // Inferred from the "FSN" prefix (Falkenstein, a confirmed Data Centres entry) — confirm/correct if wrong.
  "FSN-VPS1": { locationCode: "Falkenstein, DE" },
}

/**
 * Website location `id` (LOCATIONS) → nodebytestat.us "Data Centres" component
 * `name`. Only locations with a confirmed matching monitor are listed —
 * unmapped locations simply render without live data. Update whenever a new
 * Data Centres component is added upstream.
 */
export const LOCATION_MONITOR_MAP: Record<string, string> = {
  ncl: "Newcastle, UK",
  fal: "Falkenstein, DE",
  hel: "Helsinki, FI",
  tor: "Toronto, CA",
  newy: "New York, NY",
}
