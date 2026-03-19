import type { GamePlanSpec } from "@/packages/core/types/servers/game";

/** Garry's Mod hosting is coming soon — no plans yet. */
export const GMOD_PLANS: GamePlanSpec[] = []

/** Static features shared across all Garry's Mod plans (for future use). */
export const GMOD_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Inline feature data — maps directly to GameFeatures props. */
export const GMOD_FEATURES = [
  {
    title: "Workshop & Addon Support",
    description:
      "Full Steam Workshop integration lets you install and auto-download addons for your players at server start, keeping everyone in sync.",
    icon: "Settings" as const,
    highlights: [
      "Steam Workshop support",
      "Addon auto-download",
      "Collection support",
      "Resource manager",
    ],
  },
  {
    title: "Gamemode Flexibility",
    description:
      "Run any gamemode — DarkRP, TTT, Prophunt, Murder, Sandbox, and more. Switch gamemodes without reinstalling or rebuilding your server.",
    icon: "Gamepad2" as const,
    highlights: [
      "DarkRP & TTT ready",
      "Any custom gamemode",
      "Sandbox support",
      "Easy config switching",
    ],
  },
  {
    title: "MySQL Integration",
    description:
      "Integrated MySQL databases for data-heavy gamemodes like DarkRP. Store player data, inventories, and economy without needing a separate host.",
    icon: "Server" as const,
    highlights: [
      "Bundled MySQL databases",
      "DarkRP optimised",
      "Easy database access",
      "Regular backups",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Enterprise-grade DDoS mitigation keeps your Garry's Mod server online and your community protected at all times.",
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
      "Low latency hardware chosen for the demanding addon and workshop workloads that Garry's Mod servers generate.",
    icon: "Cpu" as const,
    highlights: [
      "High-clock AMD CPUs",
      "NVMe SSD storage",
      "Low latency networking",
      "DDR4 ECC memory",
    ],
  },
  {
    title: "Full File Access",
    description:
      "Complete FTP and web-based file manager access. Upload custom addons, Lua scripts, sounds, and models without restrictions.",
    icon: "Users" as const,
    highlights: [
      "Web file manager",
      "FTP access",
      "Lua script support",
      "No upload restrictions",
    ],
  },
] as const

/** Inline FAQ data — maps directly to GameFAQ props. */
export const GMOD_FAQS = [
  {
    question: "Can I install addons and gamemodes from the Steam Workshop?",
    answer:
      "Yes! Full Steam Workshop integration is included. You can add Workshop collections to your server config and addons will download automatically for your players on join.",
  },
  {
    question: "Which gamemodes are supported?",
    answer:
      "All gamemodes are supported — DarkRP, TTT, Prophunt, Murder, Sandbox, and any custom ones. You have full file access to install and configure whatever your community needs.",
  },
  {
    question: "Do you provide MySQL databases for DarkRP?",
    answer:
      "Yes. MySQL databases are included with our Garry's Mod plans so you can run DarkRP and other database-backed gamemodes without needing an external database host.",
  },
  {
    question: "Can I run multiple gamemodes or server instances?",
    answer:
      "Each plan covers one server instance. To run multiple gamemodes simultaneously, you would need separate plans for each server.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations across Europe and the Americas for the best latency.",
  },
] as const

/** Static hero feature pills. */
export const GMOD_HERO_FEATURES = [
  "Workshop Addons",
  "DarkRP Ready",
  "MySQL Included",
  "DDoS Protection",
] as const

/** Visual + display config for the Garry's Mod hosting page. */
export const GMOD_CONFIG = {
  name: "Garry's Mod",
  description:
    "High-performance Garry's Mod server hosting with full Steam Workshop support, MySQL integration, and enterprise DDoS protection. Built for any gamemode.",
  banner: "/games/gmod.png",
  tag: "Coming Soon",
  /** String name matching a lucide-react icon — instantiate in the page component. */
  iconName: "Wrench" as const,
  tagColor: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  headerGradient: "from-orange-500/20 via-orange-500/10 to-primary/5",
  headerIconBg: "bg-orange-500/10 text-orange-400",
} as const
