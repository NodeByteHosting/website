import type { GamePlanSpec } from "@/packages/core/types/servers/game";

export const RUST_PLANS: GamePlanSpec[] = [
  {
    id: "starter",
    priceGBP: 5.75,
    ramGB: 8,
    storageGB: 150,
  },
  {
    id: "standard",
    priceGBP: 8.95,
    ramGB: 12,
    storageGB: 200,
    popular: true,
  },
  {
    id: "performance",
    priceGBP: 12.75,
    ramGB: 16,
    storageGB: 250,
  },
]

/**
 * Plan feature keys — maps to `games.rust.planFeatures.<key>` in translations.
 * "ram" and "storage" are parametric (use plan.ramGB / plan.storageGB).
 */
export const RUST_PLAN_FEATURE_KEYS = [
  "cpu",
  "ram",
  "storage",
  "ddos",
  "location",
  "databases",
  "panel",
  "oxide",
  "rustplus",
  "uptime",
] as const

export type RustPlanFeatureKey = (typeof RUST_PLAN_FEATURE_KEYS)[number]

/** Feature section keys — maps to `games.rust.pageFeatures.<key>.*` in translations. */
export const RUST_FEATURE_KEYS = [
  { key: "oxide",       icon: "Settings" as const },
  { key: "maps",        icon: "Map"      as const },
  { key: "performance", icon: "Cpu"      as const },
  { key: "ddos",        icon: "Shield"   as const },
  { key: "wipe",        icon: "Zap"      as const },
  { key: "rcon",        icon: "Server"   as const },
] as const

/** FAQ keys — maps to `games.rust.faqs.<key>.{question,answer}` in translations. */
export const RUST_FAQ_KEYS = [
  "oxide",
  "maps",
  "wipe",
  "tickRate",
  "rcon",
  "modded",
  "location",
] as const

/** Static hero feature pills. */
export const RUST_HERO_FEATURES = [
  "Oxide/uMod",
  "Custom Maps",
  "Wipe Scheduler",
  "RCON Access",
] as const

/** Visual + display config for the Rust hosting pages */
export const RUST_CONFIG = {
  name: "Rust",
  description:
    "High-performance Rust server hosting with Oxide/uMod support, custom maps, wipe scheduling, and enterprise-grade DDoS protection.",
  banner: "/games/rust.png",
  /** String name matching a lucide-react icon — instantiate in the page component */
  iconName: "Gamepad2",
  tagColor: "bg-accent/10 border border-accent/20 text-accent",
  headerGradient: "from-accent/20 via-accent/10 to-primary/5",
  headerIconBg: "bg-accent/10 text-accent",
} as const
