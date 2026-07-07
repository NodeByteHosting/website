/**
 * The site has exactly 3 fundamentally different page templates (games,
 * VPS, dedicated) — which parent category in Paymenter maps to which
 * template is the one thing that stays a fixed, hand-maintained mapping.
 * Everything under a hub (which games/lines/tiers exist) is discovered live.
 *
 * Name the parent category in Paymenter as either alias to be picked up.
 */
export const GAME_HUB_SLUGS = ["game-servers", "games"]
export const VPS_HUB_SLUGS = ["vps-hosting", "vps", "vps-servers"]
export const DEDICATED_HUB_SLUGS = ["dedicated-servers", "dedicated", "dedi"]
