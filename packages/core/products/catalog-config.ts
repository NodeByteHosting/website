/**
 * Resolves the display config + plan-card content for a game category page.
 *
 * Every game category discovered from Paymenter gets a working page for
 * free (name/description from the category, specs parsed from the product
 * description, generic marketing copy). The handful of games we've actually
 * curated (banner art, hand-picked feature lists) override that generic
 * output — see GAME_OVERRIDES below. Plan-level content (name/description)
 * always prefers live billing data first; curated per-plan copy is only a
 * fallback for the originally-curated plan ids.
 */

import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { CategoryInfo } from "@/packages/core/lib/bytepay"
import { LINKS } from "@/packages/core/constants/links"
import {
  MINECRAFT_CONFIG,
  MINECRAFT_PLAN_DISPLAY,
  MINECRAFT_PLAN_STATIC_FEATURES,
  MINECRAFT_FEATURES,
  MINECRAFT_FAQS,
  MINECRAFT_HERO_FEATURES,
} from "@/packages/core/constants/game/minecraft"
import {
  RUST_CONFIG,
  RUST_PLAN_DISPLAY,
  RUST_PLAN_STATIC_FEATURES,
  RUST_FEATURES,
  RUST_FAQS,
  RUST_HERO_FEATURES,
} from "@/packages/core/constants/game/rust"
import {
  HYTALE_CONFIG,
  HYTALE_PLAN_DISPLAY,
  HYTALE_PLAN_STATIC_FEATURES,
  HYTALE_FEATURES,
  HYTALE_FAQS,
  HYTALE_HERO_FEATURES,
} from "@/packages/core/constants/game/hytale"
import {
  TERRARIA_CONFIG,
  TERRARIA_FEATURES,
  TERRARIA_FAQS,
  TERRARIA_HERO_FEATURES,
} from "@/packages/core/constants/game/terraria"
import {
  GMOD_CONFIG,
  GMOD_FEATURES,
  GMOD_FAQS,
  GMOD_HERO_FEATURES,
} from "@/packages/core/constants/game/gmod"
import {
  PALWORLD_CONFIG,
  PALWORLD_FEATURES,
  PALWORLD_FAQS,
  PALWORLD_HERO_FEATURES,
} from "@/packages/core/constants/game/palworld"

export type GameIconName = "Blocks" | "Gamepad2" | "Sparkles" | "Leaf" | "Pickaxe" | "Wrench"
export type FeatureIconName =
  | "Settings" | "Cpu" | "Shield" | "Zap" | "HardDrive" | "Users" | "Server" | "Map" | "Globe" | "Sparkles" | "Gamepad2"

export interface GamePageFeature {
  title: string
  description: string
  icon: FeatureIconName
  highlights: string[]
}

export interface GameFaq {
  question: string
  answer: string
}

export interface GamePlanDisplay {
  name: string
  description: string
  features: string[]
}

export interface GameDisplayConfig {
  name: string
  description: string
  banner: string
  iconName: GameIconName
  tag: string
  tagColor: string
  headerGradient: string
  headerIconBg: string
  billingUrl: string
  heroFeatures: string[]
  pageFeatures: GamePageFeature[]
  faqs: GameFaq[]
  resolvePlanDisplay: (plan: GamePlanSpec) => GamePlanDisplay
}

// ─── Generic fallback (any category with no curated override) ──────────────

const GENERIC_ICON_ROTATION: GameIconName[] = ["Gamepad2", "Sparkles", "Blocks", "Pickaxe", "Wrench", "Leaf"]
const GENERIC_PALETTES = [
  { tagColor: "bg-primary/10 border border-primary/20 text-primary", headerGradient: "from-primary/20 via-primary/10 to-accent/5", headerIconBg: "bg-primary/10 text-primary" },
  { tagColor: "bg-blue-500/15 text-blue-400 border border-blue-500/20", headerGradient: "from-blue-500/20 via-blue-500/10 to-primary/5", headerIconBg: "bg-blue-500/10 text-blue-400" },
  { tagColor: "bg-violet-500/15 text-violet-400 border border-violet-500/20", headerGradient: "from-violet-500/20 via-violet-500/10 to-primary/5", headerIconBg: "bg-violet-500/10 text-violet-400" },
  { tagColor: "bg-rose-500/15 text-rose-400 border border-rose-500/20", headerGradient: "from-rose-500/20 via-rose-500/10 to-primary/5", headerIconBg: "bg-rose-500/10 text-rose-400" },
]

/** Deterministic small hash so the same category always gets the same generic palette/icon. */
function hashSlug(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return hash
}

function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`
}

/** Plan display built straight from live billing data — used as the generic fallback, and for any plan added to a curated category that has no curated entry. */
function buildGenericPlanDisplay(plan: GamePlanSpec): GamePlanDisplay {
  const storageLabel = plan.storageLabel ?? "Storage Array"
  const ramLabel = `${plan.ramGB} GB ${plan.ramType ? plan.ramType + " " : ""}RAM`
  return {
    name: plan.name || plan.id,
    description: plan.description || `${formatStorage(plan.storageGB)} ${storageLabel}, ${ramLabel}.`,
    features: [
      ramLabel,
      `${formatStorage(plan.storageGB)} ${storageLabel}`,
      "Enterprise DDoS Protection",
      "BytePanel Control Panel",
    ],
  }
}

function buildGenericDisplayConfig(category: CategoryInfo): GameDisplayConfig {
  const hash = hashSlug(category.slug)
  const icon = GENERIC_ICON_ROTATION[hash % GENERIC_ICON_ROTATION.length]
  const palette = GENERIC_PALETTES[hash % GENERIC_PALETTES.length]

  return {
    name: category.name,
    description:
      category.description ||
      `High-performance ${category.name} server hosting with instant setup, enterprise DDoS protection, and 24/7 support.`,
    banner: "/games/generic.png",
    iconName: icon,
    tag: "Game Server",
    ...palette,
    billingUrl: `${LINKS.billing.root}/products/${category.slug}`,
    heroFeatures: ["Instant Setup", "DDoS Protection", "24/7 Support", "Upgrade Anytime"],
    pageFeatures: [
      { title: "Instant Setup", description: `Your ${category.name} server deploys automatically the moment your order completes — no waiting on manual provisioning.`, icon: "Zap", highlights: ["Automated deployment", "No setup fees", "Ready in minutes", "Zero manual steps"] },
      { title: "Enterprise Hardware", description: "Servers run on enterprise-grade CPUs with NVMe SSD storage for consistently fast, low-latency performance.", icon: "Cpu", highlights: ["NVMe SSD storage", "High clock speed CPUs", "Low latency networking", "DDR4 ECC memory"] },
      { title: "DDoS Protection", description: "Enterprise-grade DDoS mitigation is included on every plan, keeping your server online during attacks.", icon: "Shield", highlights: ["Always-on protection", "Layer 3/4/7 filtering", "Zero downtime", "Global POPs"] },
      { title: "24/7 Support", description: "Our support team is available around the clock to help with setup, configuration, or troubleshooting.", icon: "Server", highlights: ["24/7 availability", "Knowledgeable staff", "Fast response times", "Discord & ticket support"] },
    ],
    faqs: [
      { question: "How quickly will my server be online?", answer: "Your server is provisioned automatically as soon as your order completes — usually within a couple of minutes." },
      { question: "Can I upgrade my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time from the billing panel." },
      { question: "Is DDoS protection included?", answer: "Yes, enterprise-grade DDoS protection is included on every plan at no extra cost." },
    ],
    resolvePlanDisplay: buildGenericPlanDisplay,
  }
}

// ─── Curated overrides ───────────────────────────────────────────────────────

/** Build a resolvePlanDisplay for a curated game — curated copy for known plan ids, live data for anything else. */
function curatedPlanDisplay(
  display: Record<string, { name: string; description: string }>,
  staticFeatures: readonly string[],
): (plan: GamePlanSpec) => GamePlanDisplay {
  return (plan) => {
    const entry = display[plan.id]
    if (!entry) return buildGenericPlanDisplay(plan)
    return {
      name: entry.name,
      description: entry.description,
      features: [
        ...staticFeatures,
        `${plan.ramGB}GB ${plan.ramType ? plan.ramType + " " : ""}RAM`,
        `${plan.storageGB}GB ${plan.storageLabel ?? "Storage Array"}`,
      ],
    }
  }
}

/**
 * Curated display config, keyed by the Paymenter category slug. A category
 * without an entry here falls back to buildGenericDisplayConfig() — nothing
 * needs to be added here for a new game/category to work.
 */
const GAME_OVERRIDES: Record<string, () => GameDisplayConfig> = {
  minecraft: () => ({
    ...MINECRAFT_CONFIG,
    billingUrl: LINKS.billing.minecraftHosting,
    heroFeatures: [...MINECRAFT_HERO_FEATURES],
    pageFeatures: MINECRAFT_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...MINECRAFT_FAQS],
    resolvePlanDisplay: curatedPlanDisplay(MINECRAFT_PLAN_DISPLAY, MINECRAFT_PLAN_STATIC_FEATURES),
  }),
  rust: () => ({
    ...RUST_CONFIG,
    billingUrl: LINKS.billing.rustHosting,
    heroFeatures: [...RUST_HERO_FEATURES],
    pageFeatures: RUST_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...RUST_FAQS],
    resolvePlanDisplay: curatedPlanDisplay(RUST_PLAN_DISPLAY, RUST_PLAN_STATIC_FEATURES),
  }),
  hytale: () => ({
    ...HYTALE_CONFIG,
    billingUrl: LINKS.billing.hytaleHosting,
    heroFeatures: [...HYTALE_HERO_FEATURES],
    pageFeatures: HYTALE_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...HYTALE_FAQS],
    resolvePlanDisplay: curatedPlanDisplay(HYTALE_PLAN_DISPLAY, HYTALE_PLAN_STATIC_FEATURES),
  }),
  terraria: () => ({
    ...TERRARIA_CONFIG,
    billingUrl: LINKS.billing.terrariaHosting,
    heroFeatures: [...TERRARIA_HERO_FEATURES],
    pageFeatures: TERRARIA_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...TERRARIA_FAQS],
    resolvePlanDisplay: buildGenericPlanDisplay,
  }),
  gmod: () => ({
    ...GMOD_CONFIG,
    billingUrl: LINKS.billing.gmodHosting,
    heroFeatures: [...GMOD_HERO_FEATURES],
    pageFeatures: GMOD_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...GMOD_FAQS],
    resolvePlanDisplay: buildGenericPlanDisplay,
  }),
  palworld: () => ({
    ...PALWORLD_CONFIG,
    billingUrl: LINKS.billing.palworldHosting,
    heroFeatures: [...PALWORLD_HERO_FEATURES],
    pageFeatures: PALWORLD_FEATURES.map((f) => ({ ...f, highlights: [...f.highlights] })),
    faqs: [...PALWORLD_FAQS],
    resolvePlanDisplay: buildGenericPlanDisplay,
  }),
}

/** Resolve the display config for a game category — curated override if one exists, else auto-generated. */
export function resolveGameDisplayConfig(category: CategoryInfo): GameDisplayConfig {
  const override = GAME_OVERRIDES[category.slug]
  return override ? override() : buildGenericDisplayConfig(category)
}
