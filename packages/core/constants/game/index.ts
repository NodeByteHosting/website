export * from "./minecraft"
export * from "./rust"
export * from "./hytale"
export * from "./terraria"
export * from "./gmod"
export * from "./palworld"

import { MINECRAFT_PLANS } from "./minecraft"
import { RUST_PLANS } from "./rust"
import { HYTALE_PLANS } from "./hytale"
import { TERRARIA_PLANS } from "./terraria"
import { GMOD_PLANS } from "./gmod"
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
    slug:             "terraria"  as const,
    name:             "Terraria",
    startingPriceGBP: TERRARIA_PLANS.length ? Math.min(...TERRARIA_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !TERRARIA_PLANS.length,
    banner:           "/games/terraria.png",
    iconName:         "Pickaxe"   as const,
    tagColor:         "bg-lime-500/15 text-lime-400 border border-lime-500/20",
    headerGradient:   "from-lime-500/20 via-lime-500/10 to-primary/5",
    headerIconBg:     "bg-lime-500/10 text-lime-400",
  },
  {
    slug:             "gmod"      as const,
    name:             "Garry's Mod",
    startingPriceGBP: GMOD_PLANS.length ? Math.min(...GMOD_PLANS.map((p) => p.priceGBP)) : 0,
    comingSoon:       !GMOD_PLANS.length,
    banner:           "/games/gmod.png",
    iconName:         "Wrench"    as const,
    tagColor:         "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    headerGradient:   "from-orange-500/20 via-orange-500/10 to-primary/5",
    headerIconBg:     "bg-orange-500/10 text-orange-400",
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
