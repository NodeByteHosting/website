/**
 * The node list on /nodes is discovered live from status.nodebyte.host's
 * "Nodes" group (see getNodeMonitorNames in lib/status.ts) — adding a node
 * there is all that's needed for it to appear on the site.
 *
 * status.nodebyte.host doesn't carry location/hardware details, so those are
 * filled in here as optional per-node overrides, keyed by the exact monitor
 * name. A node with no entry here still shows up, just without these extras.
 */
export const NODE_DISPLAY_OVERRIDES: Record<string, { locationCode?: string; cpu?: string; ramType?: string }> = {
  "NEWC-GAME1": { locationCode: "Newcastle, UK" },
  "NEWY-GAME1": { locationCode: "New York, USA" },
  "HEL-VPS1": { locationCode: "Helsinki, FI" },
  // Inferred from the "FSN" prefix (Falkenstein) — confirm/correct if wrong.
  "FSN-VPS1": { locationCode: "Falkenstein, DE" },
}

/**
 * Website location `id` (LOCATIONS) → status.nodebyte.host "Regions" monitor
 * `name`. Only locations with a confirmed matching ping monitor are listed;
 * the Regions group also includes PoPs (e.g. Ashburn VA, Atlanta GA) that
 * don't correspond to an actual NodeByte data centre location. Update
 * whenever a new Region ping monitor is added upstream — unmapped locations
 * simply render without live data.
 */
export const LOCATION_MONITOR_MAP: Record<string, string> = {
  lon: "London, UK",
  fal: "Falkenstein, DE",
  fra: "Frankfurt, DE",
  hel: "Helsinki, FI",
  tor: "Toronto, ON",
  vhv: "Ashburn, VA",
  newy: "New York, USA",
  sgp: "Singapore, Singapore",
  syd: "Sydney, Australia",
  mum: "Mumbai, India",
}
