import type { GamePlanSpec } from "@/packages/core/types/servers/game";

/** FiveM hosting is coming soon — no plans yet. */
export const FIVEM_PLANS: GamePlanSpec[] = []

/** Static features shared across all FiveM plans (for future use). */
export const FIVEM_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "10 MySQL Databases",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Inline feature data — maps directly to GameFeatures props. */
export const FIVEM_FEATURES = [
  {
    title: "Custom Script Support",
    description:
      "Full support for Lua and C# resources. Install and manage any FiveM script or resource directly from your control panel.",
    icon: "Settings" as const,
    highlights: [
      "Lua & C# resources",
      "Resource manager",
      "Auto-restart on crash",
      "Hot reload support",
    ],
  },
  {
    title: "txAdmin Panel",
    description:
      "Integrated txAdmin for complete server management, live console, player management, and scheduled restarts.",
    icon: "Server" as const,
    highlights: [
      "Live server console",
      "Player management",
      "Scheduled restarts",
      "Ban & whitelist system",
    ],
  },
  {
    title: "OneSync Support",
    description:
      "Full OneSync and OneSync Infinity support for expanded player counts and advanced entity synchronisation.",
    icon: "Users" as const,
    highlights: [
      "OneSync Infinity",
      "1000+ player support",
      "Entity streaming",
      "Advanced sync",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Enterprise-grade DDoS mitigation keeps your FiveM server online and your community protected at all times.",
    icon: "Shield" as const,
    highlights: [
      "Always-on protection",
      "Layer 3/4/7 filtering",
      "Zero downtime",
      "Global POPs",
    ],
  },
  {
    title: "High Performance",
    description:
      "Low latency hardware optimised for FiveM's demanding workloads, keeping your roleplay server smooth for all players.",
    icon: "Cpu" as const,
    highlights: [
      "High-clock AMD CPUs",
      "NVMe SSD storage",
      "Low latency networking",
      "DDR4 ECC memory",
    ],
  },
  {
    title: "Custom Maps & MLOs",
    description:
      "Full support for custom maps, interior replacements (MLOs), and streamed assets to bring your world to life.",
    icon: "Map" as const,
    highlights: [
      "MLO interiors",
      "Custom streamed assets",
      "Map replacements",
      "Easy FTP upload",
    ],
  },
] as const

/** Inline FAQ data — maps directly to GameFAQ props. */
export const FIVEM_FAQS = [
  {
    question: "Do you support all FiveM resources and scripts?",
    answer:
      "Yes! Our servers support any FiveM-compatible resource or script, whether it's a free community resource or a premium one. You can install them via the file manager or FTP.",
  },
  {
    question: "Is txAdmin included with my server?",
    answer:
      "Yes, txAdmin is fully integrated and available from day one. You can use it for live console access, player management, scheduled restarts, and ban/whitelist management.",
  },
  {
    question: "Can I install ESX, QBCore, or other frameworks?",
    answer:
      "Absolutely! We support all popular FiveM frameworks including ESX, QBCore, VORP, and any other custom framework. You have full file access to install whatever your community needs.",
  },
  {
    question: "What player limit does OneSync offer?",
    answer:
      "With OneSync Infinity enabled, FiveM supports up to 1024 players on a single server. Our hardware is provisioned to handle the demands of large player counts.",
  },
  {
    question: "Can I use custom maps and MLOs?",
    answer:
      "Yes! You can upload custom map replacements, MLO interiors, and streamed assets directly via FTP or the file manager to customise your server world.",
  },
  {
    question: "What artifact version will you support?",
    answer:
      "We will support the latest stable and recommended FiveM artifact versions. You will be able to select or update your artifact version directly from the control panel.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your community.",
  },
] as const

/** Static hero feature pills. */
export const FIVEM_HERO_FEATURES = [
  "Custom Scripts",
  "txAdmin",
  "OneSync",
  "DDoS Protection",
] as const

/** Visual + display config for the FiveM hosting page. */
export const FIVEM_CONFIG = {
  name: "FiveM",
  description:
    "High-performance FiveM server hosting with full script and resource support, txAdmin panel, OneSync Infinity, and enterprise DDoS protection. Built for GTA roleplay communities.",
  banner: "/games/fivem.png",
  tag: "Coming Soon",
  /** String name matching a lucide-react icon — instantiate in the page component. */
  iconName: "Radio" as const,
  tagColor: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  headerGradient: "from-blue-500/20 via-blue-500/10 to-primary/5",
  headerIconBg: "bg-blue-500/10 text-blue-400",
} as const
