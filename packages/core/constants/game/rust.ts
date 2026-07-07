/**
 * Rust doesn't need translation keys — plan/feature/FAQ copy is stored here
 * directly, same pattern as Hytale/Terraria/Gmod/Palworld. Plan-level content
 * always prefers the live billing panel data first; this is only a fallback
 * for the 4 originally-curated plan ids.
 */
export const RUST_PLAN_DISPLAY = {
  starter: { name: "Starter", description: "Recommended for 40 Players" },
  standard: { name: "Standard", description: "Recommended for 75 Players" },
  performance: { name: "Performance", description: "Recommended for 100 Players" },
  premium: { name: "Premium", description: "Recommended for 150+ Players" },
} as const satisfies Record<string, { name: string; description: string }>

/** Static features shared across all Rust plans; RAM/storage are appended parametrically per plan. */
export const RUST_PLAN_STATIC_FEATURES = [
  "High Performance CPU",
  "DDoS Protection",
  "Multiple Locations",
  "10 MySQL Databases",
  "BytePanel (GSM)",
  "Oxide/Umod Supported",
  "Rust+ Supported",
  "99.6% Uptime SLA",
] as const

export const RUST_FEATURES = [
  {
    title: "Oxide/uMod Support",
    description: "Full support for Oxide and uMod plugins. Install and manage plugins directly from our control panel.",
    icon: "Settings" as const,
    highlights: ["One-click Oxide install", "Plugin manager", "Auto updates available", "Permission management"],
  },
  {
    title: "Custom Maps",
    description: "Use procedurally generated maps or upload your own custom maps. Full map customization support.",
    icon: "Map" as const,
    highlights: ["Procedural generation", "Custom map uploads", "Map size control", "Seed customization"],
  },
  {
    title: "High Performance",
    description: "Rust demands powerful hardware. Our servers use high performance CPUs and NVMe storage for a smooth experience.",
    icon: "Cpu" as const,
    highlights: ["High performance CPUs", "NVMe SSD storage", "High single thread performance", "Low-latency networking"],
  },
  {
    title: "DDoS Protection",
    description: "Enterprise grade DDoS mitigation through multiple network POPs protects your server from attacks 24/7.",
    icon: "Shield" as const,
    highlights: ["Enterprise network filtering", "Global POPs", "Layer 3/4/7 protection", "Zero downtime"],
  },
  {
    title: "Wipe Scheduler",
    description: "Automated wipe scheduling to keep your server fresh. Configure weekly, bi-weekly, or monthly wipes.",
    icon: "Zap" as const,
    highlights: ["Automated wipes", "Blueprint wipe options", "Map wipe scheduling", "Discord notifications"],
  },
  {
    title: "Full RCON Access",
    description: "Complete remote console access for server management. Execute commands from anywhere.",
    icon: "Server" as const,
    highlights: ["Web-based RCON", "Command scheduling", "Player management", "Real-time logs"],
  },
] as const

export const RUST_FAQS = [
  {
    question: "Do you support Oxide/uMod plugins?",
    answer: "Yes! We fully support Oxide and uMod. You can install Oxide with one click from our control panel and manage plugins through our plugin manager or via FTP.",
  },
  {
    question: "Can I use custom maps?",
    answer: "Absolutely! You can use procedurally generated maps with custom seeds and sizes, or upload your own custom map files via FTP.",
  },
  {
    question: "How does the wipe scheduler work?",
    answer: "Our wipe scheduler lets you automate server wipes on a schedule you choose. You can configure map-only wipes or full blueprint wipes, and optionally send Discord notifications.",
  },
  {
    question: "What's the server tick rate?",
    answer: "Our Rust servers run at the default 30 tick rate. Our high-performance hardware ensures consistent performance even with many players online.",
  },
  {
    question: "Can I access RCON?",
    answer: "Yes, you get full RCON access. You can use our web-based RCON console or connect with any standard RCON client.",
  },
  {
    question: "Do you support modded servers?",
    answer: "Yes, we support both vanilla and modded Rust servers. Install Oxide and add any plugins you need to create your perfect modded experience.",
  },
  {
    question: "Can I choose my server location?",
    answer: "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your players.",
  },
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
  tag: "High Performance",
  /** String name matching a lucide-react icon — instantiate in the page component */
  iconName: "Gamepad2",
  tagColor: "bg-accent/10 border border-accent/20 text-accent",
  headerGradient: "from-accent/20 via-accent/10 to-primary/5",
  headerIconBg: "bg-accent/10 text-accent",
} as const
