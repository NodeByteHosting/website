/**
 * Games listed on /games as supported at checkout via Paymenter's product
 * config option — there's no API to read this list live (the admin API's
 * `include` allowlist has no config-options relationship), so it's
 * maintained by hand here. Keep in sync with the checkout dropdown.
 */
export const SUPPORTED_GAMES = [
  "Minecraft",
  "Hytale",
  "Palworld",
  "Rust",
] as const
