import { GamePlanSpec } from "@/packages/core/types/servers/game";

/**
 * MINECRAFT PLAN LIST
 * @type {GamePlanSpec} The Gameplan Typing Spec
 */
export const MINECRAFT_PLANS: GamePlanSpec[] = [
  {
    id: "ember",
    priceGBP: 4,
    ramGB: 4,
    storageGB: 40,
    url: "https://billing.nodebyte.host/store/minecraft-server-hosting/ember",
  },
  {
    id: "blaze",
    priceGBP: 6,
    ramGB: 6,
    storageGB: 60,
    url: "https://billing.nodebyte.host/store/minecraft-server-hosting/blaze",
  },
  {
    id: "inferno",
    priceGBP: 7.5,
    ramGB: 8,
    storageGB: 80,
    popular: true,
    url: "https://billing.nodebyte.host/store/minecraft-server-hosting/inferno",
  },
]

/**
 * Plan feature keys — maps to `games.minecraft.planFeatures.<key>` in translations.
 * "ram" and "storage" are parametric (use plan.ramGB / plan.storageGB).
 */
export const MINECRAFT_PLAN_FEATURE_KEYS = [
  "cpu",
  "ram",
  "storage",
  "databases",
  "ddos",
  "panel",
  "jars",
  "uptime",
] as const

export type MinecraftPlanFeatureKey = (typeof MINECRAFT_PLAN_FEATURE_KEYS)[number]

/** Feature section keys — maps to `games.minecraft.pageFeatures.<key>.*` in translations. */
export const MINECRAFT_FEATURE_KEYS = [
  { key: "modLoaders", icon: "Settings"  as const },
  { key: "hardware",   icon: "Cpu"       as const },
  { key: "ddos",       icon: "Shield"    as const },
  { key: "instant",    icon: "Zap"       as const },
  { key: "ftp",        icon: "HardDrive" as const },
  { key: "slots",      icon: "Users"     as const },
] as const

/** FAQ keys — maps to `games.minecraft.faqs.<key>.{question,answer}` in translations. */
export const MINECRAFT_FAQ_KEYS = [
  "versions",
  "mods",
  "upload",
  "playerLimit",
  "upgrade",
  "refunds",
  "location",
] as const

/** Static hero feature pills. */
export const MINECRAFT_HERO_FEATURES = [
  "Forge & Fabric",
  "Unlimited Players",
  "DDoS Protection",
  "24/7 Support",
] as const

/** Visual + display config for the Minecraft hosting pages */
export const MINECRAFT_CONFIG = {
  name: "Minecraft",
  description:
    "High performance Minecraft server hosting with instant setup, one click mod loaders, and enterprise grade DDoS protection. Java & Bedrock support.",
  banner: "/games/minecraft.png",
  /** String name matching a lucide-react icon — instantiate in the page component */
  iconName: "Blocks",
  tagColor: "bg-primary/10 border border-primary/20 text-primary",
  headerGradient: "from-primary/20 via-primary/10 to-accent/5",
  headerIconBg: "bg-primary/10 text-primary",
} as const
