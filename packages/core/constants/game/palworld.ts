import type { GamePlanSpec } from "@/packages/core/types/servers/game";

/** Palworld hosting is coming soon — no plans yet. */
export const PALWORLD_PLANS: GamePlanSpec[] = []

/** Static features shared across all Palworld plans (for future use). */
export const PALWORLD_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "10 MySQL Databases",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Inline feature data — maps directly to GameFeatures props. */
export const PALWORLD_FEATURES = [
  {
    title: "Custom World Configuration",
    description:
      "Take full control of your Palworld server settings — adjust spawn rates, difficulty, XP multipliers, and more to suit your community.",
    icon: "Settings" as const,
    highlights: [
      "Difficulty settings",
      "Spawn rate control",
      "XP & drop multipliers",
      "Time & weather config",
    ],
  },
  {
    title: "Pal Data Persistence",
    description:
      "Your Pals, bases, and world progress are kept safe with reliable save management and automated backups.",
    icon: "HardDrive" as const,
    highlights: [
      "Reliable save management",
      "Automated backups",
      "Easy save restores",
      "World seed support",
    ],
  },
  {
    title: "Mod Support",
    description:
      "Install community mods to expand your Palworld experience with new Pals, items, maps, and gameplay tweaks.",
    icon: "Zap" as const,
    highlights: [
      "Community mod support",
      "Easy mod installation",
      "Full file access",
      "FTP & file manager",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Enterprise-grade DDoS mitigation keeps your Palworld server online and your community protected around the clock.",
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
      "Powerful hardware ensures smooth gameplay for all players, even during intense base raids or large Pal battles.",
    icon: "Cpu" as const,
    highlights: [
      "High-clock AMD CPUs",
      "NVMe SSD storage",
      "Low latency networking",
      "DDR4 ECC memory",
    ],
  },
  {
    title: "Auto Backups",
    description:
      "Automated world backups protect your Palworld progress. Restore to any backup point with a single click from the control panel.",
    icon: "Server" as const,
    highlights: [
      "Scheduled backups",
      "One-click restore",
      "Multiple restore points",
      "Safe world management",
    ],
  },
] as const

/** Inline FAQ data — maps directly to GameFAQ props. */
export const PALWORLD_FAQS = [
  {
    question: "How many players can join my Palworld server?",
    answer:
      "Palworld dedicated servers support up to 32 players by default. Our plans are provisioned with enough resources to keep gameplay smooth for all your players.",
  },
  {
    question: "Can I install mods on my Palworld server?",
    answer:
      "Yes! You can install community mods via FTP or the file manager. We provide full file access so you can customise your Palworld experience however you like.",
  },
  {
    question: "Is my Pal and world data backed up automatically?",
    answer:
      "Absolutely. We run automated backups of your world saves on a regular schedule. You can restore to any backup point from within the control panel.",
  },
  {
    question: "Can I customise world settings like spawn rates and difficulty?",
    answer:
      "Yes! All Palworld server configuration options are available to you, including difficulty levels, Pal spawn rates, XP multipliers, drop rates, and more.",
  },
  {
    question: "Can I transfer my single-player save to my dedicated server?",
    answer:
      "Yes, it is possible to transfer a single-player world save to a dedicated server. Our support team can assist you with the process if needed.",
  },
  {
    question: "What version of Palworld will you support?",
    answer:
      "We will keep servers updated with the latest stable Palworld dedicated server releases and will notify you of any updates that require server restarts.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your players.",
  },
] as const

/** Static hero feature pills. */
export const PALWORLD_HERO_FEATURES = [
  "Custom World",
  "Mod Support",
  "Auto Backups",
  "DDoS Protection",
] as const

/** Visual + display config for the Palworld hosting page. */
export const PALWORLD_CONFIG = {
  name: "Palworld",
  description:
    "High-performance Palworld server hosting with full world customisation, mod support, automatic backups, and enterprise DDoS protection. The perfect home for your Pal-catching community.",
  banner: "/games/palworld.png",
  tag: "Coming Soon",
  /** String name matching a lucide-react icon — instantiate in the page component. */
  iconName: "Leaf" as const,
  tagColor: "bg-green-500/15 text-green-400 border border-green-500/20",
  headerGradient: "from-green-500/20 via-green-500/10 to-primary/5",
  headerIconBg: "bg-green-500/10 text-green-400",
} as const
