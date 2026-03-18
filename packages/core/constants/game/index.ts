export * from "./minecraft"
export * from "./rust"
export * from "./hytale"
export * from "./fivem"
export * from "./redm"
export * from "./palworld"

import { MINECRAFT_PLANS } from "./minecraft"
import { RUST_PLANS } from "./rust"
import { HYTALE_PLANS } from "./hytale"
import { FIVEM_PLANS } from "./fivem"
import { REDM_PLANS } from "./redm"
import { PALWORLD_PLANS } from "./palworld"

/**
 * Metadata for each game offering — used by the /games index page.
 * Mirrors VPS_OPTIONS in packages/core/constants/vps/index.ts.
 */
export const GAME_OPTIONS = [
  {
    slug:             "minecraft" as const,
    name:             "Minecraft",
    startingPriceGBP: Math.min(...MINECRAFT_PLANS.map((p) => p.priceGBP)),
    banner:           "/games/minecraft.png",
    iconName:         "Blocks"    as const,
    tagColor:         "bg-primary text-primary-foreground",
    headerGradient:   "from-primary/20 via-primary/10 to-accent/5",
    headerIconBg:     "bg-primary/10 text-primary",
  },
  {
    slug:             "rust"      as const,
    name:             "Rust",
    startingPriceGBP: Math.min(...RUST_PLANS.map((p) => p.priceGBP)),
    banner:           "/games/rust.png",
    iconName:         "Gamepad2"  as const,
    tagColor:         "bg-accent text-accent-foreground",
    headerGradient:   "from-accent/20 via-accent/10 to-primary/5",
    headerIconBg:     "bg-accent/10 text-accent",
  },
  {
    slug:             "hytale"    as const,
    name:             "Hytale",
    startingPriceGBP: HYTALE_PLANS.length ? Math.min(...HYTALE_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !HYTALE_PLANS.length,
    banner:           "/games/hytale.png",
    iconName:         "Sparkles"  as const,
    tagColor:         "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    headerGradient:   "from-amber-500/20 via-amber-500/10 to-primary/5",
    headerIconBg:     "bg-amber-500/10 text-amber-400",
  },
  {
    slug:             "fivem"     as const,
    name:             "FiveM",
    startingPriceGBP: FIVEM_PLANS.length ? Math.min(...FIVEM_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !FIVEM_PLANS.length,
    banner:           "/games/fivem.png",
    iconName:         "Radio"     as const,
    tagColor:         "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    headerGradient:   "from-blue-500/20 via-blue-500/10 to-primary/5",
    headerIconBg:     "bg-blue-500/10 text-blue-400",
  },
  {
    slug:             "redm"      as const,
    name:             "RedM",
    startingPriceGBP: REDM_PLANS.length ? Math.min(...REDM_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !REDM_PLANS.length,
    banner:           "/games/redm.png",
    iconName:         "Mountain"  as const,
    tagColor:         "bg-red-500/15 text-red-400 border border-red-500/20",
    headerGradient:   "from-red-500/20 via-red-500/10 to-primary/5",
    headerIconBg:     "bg-red-500/10 text-red-400",
  },
  {
    slug:             "palworld"  as const,
    name:             "Palworld",
    startingPriceGBP: PALWORLD_PLANS.length ? Math.min(...PALWORLD_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !PALWORLD_PLANS.length,
    banner:           "/games/palworld.png",
    iconName:         "Leaf"      as const,
    tagColor:         "bg-green-500/15 text-green-400 border border-green-500/20",
    headerGradient:   "from-green-500/20 via-green-500/10 to-primary/5",
    headerIconBg:     "bg-green-500/10 text-green-400",
  },
]
