/**
 * Bridges the two independent naming schemes between status.nodebyte.host
 * (monitor names) and this site's node/location identifiers. Update these
 * maps whenever a node is renamed or a new Region ping monitor is added
 * upstream — unmapped entries simply render without live data.
 */

/** Website node `name` (STATIC_NODES) → status.nodebyte.host monitor `name`. */
export const NODE_MONITOR_MAP: Record<string, string> = {
  "NEWC-GAME1": "NEWC-GAME1",
  "HEL-VPS1": "HEL-VPS1",
}

/**
 * Website location `id` (LOCATIONS) → status.nodebyte.host "Regions" monitor
 * `name`. Only locations with a confirmed matching ping monitor are listed;
 * the Regions group also includes PoPs (e.g. Ashburn VA, Atlanta GA) that
 * don't correspond to an actual NodeByte data centre location.
 */
export const LOCATION_MONITOR_MAP: Record<string, string> = {
  lon: "London, UK",
  fal: "Falkenstein, DE",
  fra: "Frankfurt, DE",
  hel: "Helsinki, FI",
  tor: "Toronto, ON",
  vhv: "Ashburn, VA", // Vint Hill, VA is in the same Northern Virginia / DC-metro area
  sgp: "Singapore, Singapore",
  syd: "Sydney, Australia",
  mum: "Mumbai, India",
}
