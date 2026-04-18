import type { GamePlanSpec } from "@/packages/core/types/servers/game";

/** Hytale is not yet released — plans are placeholder/early-access pricing. */
export const HYTALE_PLANS: GamePlanSpec[] = [
  {
    id: "starter",
    priceGBP: 5,
    ramGB: 4,
    storageGB: 40,
    url: "https://billing.nodebyte.host/products/hytale-hosting/hytale-starter",
  },
  {
    id: "standard",
    priceGBP: 7.5,
    ramGB: 6,
    storageGB: 60,
    url: "https://billing.nodebyte.host/products/hytale-hosting/hytale-standard",
  },
  {
    id: "performance",
    priceGBP: 10,
    ramGB: 8,
    storageGB: 80,
    popular: true,
    url: "https://billing.nodebyte.host/products/hytale-hosting/hytale-performance",
  },
]

/**
 * Hytale doesn't have translation keys yet — names/descriptions are stored
 * here directly instead of being keyed through i18n.
 */
export const HYTALE_PLAN_DISPLAY = {
  starter: {
    name: "Starter",
    description: "Perfect for small communities and testing.",
  },
  standard: {
    name: "Standard",
    description: "Perfect for growing communities and performance.",
  },
  performance: {
    name: "Performance",
    description: "Perfect for large communities and high performance.",
  },
} as const satisfies Record<string, { name: string; description: string }>

/**
 * Static features shared across all Hytale plans.
 * The page appends the parametric RAM/storage strings built from each plan's spec.
 */
export const HYTALE_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "10 MySQL Databases",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Hytale doesn't have translation keys yet — feature data is stored inline. */
export const HYTALE_FEATURES = [
  {
    title: "Instant Setup",
    description:
      "Once purchased, the server will install instantly with a performance plugin for optimal performance.",
    icon: "Zap" as const,
    highlights: [
      "Fast install",
      "Optimized configurations",
      "Pre-built templates",
      "Quick deployment",
    ],
  },
  {
    title: "Mod Support",
    description:
      "Full support for Hytale's modding capabilities. Create and host your custom experiences.",
    icon: "Settings" as const,
    highlights: [
      "Custom mod support",
      "Easy mod management",
      "Auto-updates",
      "Full file access",
    ],
  },
  {
    title: "High Performance",
    description:
      "Enterprise grade hardware ready to deliver smooth gameplay for your Hytale community.",
    icon: "Cpu" as const,
    highlights: [
      "Latest gen CPUs",
      "NVMe SSD storage",
      "High-speed networking",
      "Low latency",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Your server will be protected by enterprise-grade DDoS mitigation from day one.",
    icon: "Shield" as const,
    highlights: [
      "Always-on protection",
      "Automated network filtering",
      "Zero downtime",
      "Global POPs",
    ],
  },
  {
    title: "Global Data Centers",
    description:
      "Servers hosted in strategically located data centers for excellent latency wherever your players are.",
    icon: "Globe" as const,
    highlights: [
      "Multiple locations",
      "Low latency routing",
      "Premium network",
      "Global coverage",
    ],
  },
  {
    title: "24/7 Support",
    description:
      "Our expert support team will be ready to help you with any Hytale hosting questions.",
    icon: "Server" as const,
    highlights: [
      "24/7 availability",
      "Game experts",
      "Fast response times",
      "Discord support",
    ],
  },
] as const

/** Hytale doesn't have translation keys yet — FAQ data is stored inline. */
export const HYTALE_FAQS = [
  {
    question: "What features are supported?",
    answer:
      "We support all Hytale server features including mods, custom worlds, and multiplayer.",
  },
  {
    question: "Will there be mod support?",
    answer: "Yes, we support Hytale's modding capabilities.",
  },
  {
    question: "What regions will be available?",
    answer:
      "We'll offer Hytale hosting across multiple data center locations for low latency and great coverage wherever your players are.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your players.",
  },
] as const

/** Static hero feature pills. */
export const HYTALE_HERO_FEATURES = [
  "Mod Support",
  "Custom Maps",
  "DDoS Protection",
  "24/7 Support",
] as const

export const HYTALE_CONFIG = {
  name: "Hytale",
  description:
    "Set out on an adventure built for both creation and play. Hytale blends the freedom of a sandbox with the momentum of an RPG: explore a procedurally generated world full of dungeons, secrets, and a variety of creatures, then shape it block by block.",
  banner: "/games/hytale.png",
  tag: "Early Access Game",
  /** String name matching a lucide-react icon — instantiate in the page component */
  iconName: "Sparkles",
  tagColor: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  headerGradient: "from-amber-500/20 via-amber-500/10 to-primary/5",
  headerIconBg: "bg-amber-500/10 text-amber-400",
} as const
