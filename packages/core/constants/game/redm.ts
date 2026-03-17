import type { GamePlanSpec } from "@/packages/core/types/servers/game";

/** RedM hosting is coming soon — no plans yet. */
export const REDM_PLANS: GamePlanSpec[] = []

/** Static features shared across all RedM plans (for future use). */
export const REDM_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "10 MySQL Databases",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Inline feature data — maps directly to GameFeatures props. */
export const REDM_FEATURES = [
  {
    title: "Framework Support",
    description:
      "Full support for VORP Core, RedEM:R, and other popular RedM roleplay frameworks for a rich western roleplay experience.",
    icon: "Settings" as const,
    highlights: [
      "VORP Core support",
      "RedEM:R compatible",
      "Custom framework support",
      "Resource hot reload",
    ],
  },
  {
    title: "Custom Maps & Interiors",
    description:
      "Stream custom maps, interiors, and map replacements to create unique environments for your RedM community.",
    icon: "Map" as const,
    highlights: [
      "Custom map streaming",
      "Interior replacements",
      "Streamed props",
      "Easy FTP upload",
    ],
  },
  {
    title: "High Performance",
    description:
      "Enterprise-grade hardware optimised for RedM server workloads, ensuring smooth gameplay for your western roleplay community.",
    icon: "Cpu" as const,
    highlights: [
      "High-clock AMD CPUs",
      "NVMe SSD storage",
      "Low latency networking",
      "DDR4 ECC memory",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Enterprise-grade DDoS mitigation protects your RedM server from attacks and keeps your community online 24/7.",
    icon: "Shield" as const,
    highlights: [
      "Always-on protection",
      "Layer 3/4/7 filtering",
      "Zero downtime",
      "Global POPs",
    ],
  },
  {
    title: "Script & Resource Management",
    description:
      "Install and manage Lua and C# resources with ease. Full FTP and file manager access for complete control over your server.",
    icon: "Server" as const,
    highlights: [
      "Lua & C# support",
      "Resource manager",
      "Auto-restart on crash",
      "Full file access",
    ],
  },
  {
    title: "Custom Content",
    description:
      "Stream custom peds, vehicles, weapons, and audio to deliver a fully immersive Red Dead roleplay experience.",
    icon: "Globe" as const,
    highlights: [
      "Custom peds & clothing",
      "Custom vehicles",
      "Custom weapons",
      "Audio streaming",
    ],
  },
] as const

/** Inline FAQ data — maps directly to GameFAQ props. */
export const REDM_FAQS = [
  {
    question: "What RedM frameworks are supported?",
    answer:
      "We support all popular RedM roleplay frameworks including VORP Core, RedEM:R, and any custom framework. You have full file access to install whatever your community requires.",
  },
  {
    question: "Can I use custom maps and interiors?",
    answer:
      "Yes! You can stream custom map replacements, interiors, and props directly to your players via FTP or our file manager.",
  },
  {
    question: "What is the player limit for RedM servers?",
    answer:
      "RedM servers support up to 64 players by default, with higher limits available depending on your server configuration. Our hardware is provisioned to handle the load.",
  },
  {
    question: "Can I install custom peds, vehicles, and weapons?",
    answer:
      "Absolutely! You can upload and stream custom peds, vehicles, weapons, and audio assets to create a fully immersive roleplay environment.",
  },
  {
    question: "Is there RCON or console access?",
    answer:
      "Yes, you get full console access through our control panel. You can execute server commands, monitor logs, and manage your server in real time.",
  },
  {
    question: "What version of RedM will you support?",
    answer:
      "We will support the latest stable RedM artifact versions and will provide easy version management from within the control panel.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your community.",
  },
] as const

/** Static hero feature pills. */
export const REDM_HERO_FEATURES = [
  "VORP/RedEM",
  "Custom Maps",
  "Custom Content",
  "DDoS Protection",
] as const

/** Visual + display config for the RedM hosting page. */
export const REDM_CONFIG = {
  name: "RedM",
  description:
    "High-performance RedM server hosting for Red Dead Redemption 2 roleplay communities. Full framework support, custom map and content streaming, and enterprise DDoS protection.",
  banner: "/games/redm.png",
  tag: "Coming Soon",
  /** String name matching a lucide-react icon — instantiate in the page component. */
  iconName: "Mountain" as const,
  tagColor: "bg-red-500/15 text-red-400 border border-red-500/20",
  headerGradient: "from-red-500/20 via-red-500/10 to-primary/5",
  headerIconBg: "bg-red-500/10 text-red-400",
} as const
