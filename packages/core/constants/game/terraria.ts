/** Static features shared across all Terraria plans (for future use). */
export const TERRARIA_PLAN_STATIC_FEATURES = [
  "AMD Ryzen™ 9 5900X",
  "DDoS Protection",
  "BytePanel",
  "99.9% Uptime SLA",
] as const

/** Inline feature data — maps directly to GameFeatures props. */
export const TERRARIA_FEATURES = [
  {
    title: "Mod Support",
    description:
      "Full tModLoader support so you and your players can install and manage mods directly from the control panel with zero hassle.",
    icon: "Settings" as const,
    highlights: [
      "tModLoader ready",
      "Mod manager",
      "Auto-restart on crash",
      "Easy mod updates",
    ],
  },
  {
    title: "Custom World Generation",
    description:
      "Configure world size, difficulty, seed, and game mode at creation. Reset or create multiple worlds at any time with a single click.",
    icon: "Map" as const,
    highlights: [
      "Small / Medium / Large worlds",
      "Custom seeds",
      "Multiple worlds",
      "Journey, Classic & Expert modes",
    ],
  },
  {
    title: "Automatic Backups",
    description:
      "Scheduled world and character backups protect your progress. Restore to any snapshot with one click in case of accidents or corruption.",
    icon: "Server" as const,
    highlights: [
      "Scheduled backups",
      "One-click restore",
      "Multiple restore points",
      "World file download",
    ],
  },
  {
    title: "DDoS Protection",
    description:
      "Enterprise-grade DDoS mitigation keeps your Terraria server online and your adventurers safe at all times.",
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
      "Low latency hardware chosen for smooth Terraria workloads, keeping your world responsive even during boss events and large build projects.",
    icon: "Cpu" as const,
    highlights: [
      "High-clock AMD CPUs",
      "NVMe SSD storage",
      "Low latency networking",
      "DDR4 ECC memory",
    ],
  },
  {
    title: "Simple Management",
    description:
      "BytePanel gives you full control — start, stop, restart, manage files, view console output, and configure your server all in one place.",
    icon: "Users" as const,
    highlights: [
      "Web-based control panel",
      "Live console",
      "File manager",
      "Player & ban management",
    ],
  },
] as const

/** Inline FAQ data — maps directly to GameFAQ props. */
export const TERRARIA_FAQS = [
  {
    question: "Does my server support tModLoader?",
    answer:
      "Yes! We fully support tModLoader so you can install and run mods directly. You can switch between vanilla and tModLoader from your control panel.",
  },
  {
    question: "How many players can join my Terraria server?",
    answer:
      "Terraria officially supports up to 255 simultaneous players. Our plans are sized to handle typical community servers comfortably.",
  },
  {
    question: "Can I create multiple worlds on one server?",
    answer:
      "Yes, you can store and switch between multiple world files. Simply upload your worlds via FTP or the file manager and select the active world in the config.",
  },
  {
    question: "Will my world be backed up automatically?",
    answer:
      "Yes. Automatic scheduled backups are included. You can restore to any snapshot from your control panel in case of corruption or accidental changes.",
  },
  {
    question: "Can I choose my server location?",
    answer:
      "Yes! You can select your preferred data centre location at checkout. We offer multiple locations across Europe and the Americas for the best latency.",
  },
] as const

/** Static hero feature pills. */
export const TERRARIA_HERO_FEATURES = [
  "tModLoader",
  "Custom Worlds",
  "Auto Backups",
  "DDoS Protection",
] as const

/** Visual + display config for the Terraria hosting page. */
export const TERRARIA_CONFIG = {
  name: "Terraria",
  description:
    "High-performance Terraria server hosting with full tModLoader support, custom world configuration, automatic backups, and enterprise DDoS protection. Built for adventurers.",
  banner: "/games/terraria.png",
  tag: "Coming Soon",
  /** String name matching a lucide-react icon — instantiate in the page component. */
  iconName: "Pickaxe" as const,
  tagColor: "bg-lime-500/15 text-lime-400 border border-lime-500/20",
  headerGradient: "from-lime-500/20 via-lime-500/10 to-primary/5",
  headerIconBg: "bg-lime-500/10 text-lime-400",
} as const
