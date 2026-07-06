/**
 * The only things that cannot be parsed from billing panel descriptions:
 *
 *  - POPULAR_SLUGS  — which plans get the "popular" highlight badge
 *  - SERIES_LOCATION — maps the series code in a SKU to a datacenter city
 *
 * Add new series here when a new datacenter location goes live.
 * Keys are the second segment of the product name, e.g. "BASE-RG1-2GB" → "RG1".
 */

/** "{categorySlug}/{productSlug}" pairs that should show the popular badge. */
export const POPULAR_SLUGS = new Set([
  // Minecraft
  "minecraft/inferno",
  "minecraft/firestorm",
  "minecraft/supernova",

  // Rust
  "rust/standard",

  // Hytale
  "hytale/hytale-performance",

  // VPS
  "shared-cpu/comp-rg1-8gb",
])

/** Applied to every VPS plan — override here if individual plans ever differ. */
export const DEFAULT_DDOS = { layers: [3, 4, 7] as number[], autoOn: true }
