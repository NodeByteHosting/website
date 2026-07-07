/**
 * Minecraft doesn't need translation keys — plan/feature/FAQ copy is stored
 * here directly, same pattern as Hytale/Terraria/Gmod/Palworld. Plan-level
 * content always prefers the live billing panel data first; this is only a
 * fallback for the 5 originally-curated plan ids.
 */
export const MINECRAFT_PLAN_DISPLAY = {
  ember: { name: "Ember", description: "Perfect for small servers and testing" },
  blaze: { name: "Blaze", description: "Great for growing communities" },
  inferno: { name: "Inferno", description: "Ideal for medium sized communities" },
  firestorm: { name: "Firestorm", description: "Built for large and active communities" },
  supernova: { name: "Supernova", description: "Maximum power for massive servers" },
} as const satisfies Record<string, { name: string; description: string }>

/** Static features shared across all Minecraft plans; RAM/storage are appended parametrically per plan. */
export const MINECRAFT_PLAN_STATIC_FEATURES = [
  "High Performance CPU",
  "10 MySQL Databases",
  "DDoS Protection",
  "BytePanel",
  "Auto/Pre Installed Jars",
  "99.6% Uptime SLA",
] as const

export const MINECRAFT_FEATURES = [
  {
    title: "One-Click Mod Loaders",
    description: "Install Forge, Fabric, Paper, Spigot, and more with a single click from our control panel.",
    icon: "Settings" as const,
    highlights: ["Forge & Fabric support", "Paper & Spigot servers", "Bukkit compatibility", "Custom JAR uploads"],
  },
  {
    title: "High Performance Hardware",
    description: "Enterprise grade processors with NVMe storage for blazing fast performance.",
    icon: "Cpu" as const,
    highlights: ["High performance CPUs", "NVMe SSD storage", "DDR4 ECC memory", "High clock speed processors"],
  },
  {
    title: "DDoS Protection",
    description: "Enterprise grade DDoS mitigation keeps your server online even during the largest attacks.",
    icon: "Shield" as const,
    highlights: ["Layer 3/4/7 protection", "Enterprise network filtering", "Zero downtime mitigation", "Enterprise POPs"],
  },
  {
    title: "Instant Setup",
    description: "Your server is deployed within seconds. Start playing immediately after purchase.",
    icon: "Zap" as const,
    highlights: ["Automated provisioning", "Pre configured settings", "Ready in under 60 seconds", "No technical knowledge needed"],
  },
  {
    title: "Full FTP Access",
    description: "Complete file access via FTP/SFTP. Upload worlds, plugins, and configurations with ease.",
    icon: "HardDrive" as const,
    highlights: ["SFTP file access", "Web based file manager", "Drag & drop uploads", "Automatic backups"],
  },
  {
    title: "Unlimited Slots",
    description: "No artificial player limits. Host as many players as your hardware can handle.",
    icon: "Users" as const,
    highlights: ["No slot restrictions", "Scalable resources", "Upgrade anytime", "Fair resource allocation"],
  },
] as const

export const MINECRAFT_FAQS = [
  {
    question: "What Minecraft versions do you support?",
    answer: "We support all Minecraft versions from 1.7.10 to the latest release, including snapshots. Both Java Edition and Bedrock Edition servers are available.",
  },
  {
    question: "Can I install mods and plugins?",
    answer: "Yes! We support all major mod loaders including Forge, Fabric, and NeoForge. For plugins, we support Paper, Spigot, Bukkit, and Purpur. You can also upload custom JARs.",
  },
  {
    question: "How do I upload my existing world?",
    answer: "You can upload your world files via our web based file manager or through SFTP. Simply drag and drop your world folder and it will be ready to use.",
  },
  {
    question: "Is there a player limit?",
    answer: "No, we don't impose artificial player limits. Your server can host as many players as your allocated resources can handle.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time from our billing panel. Changes take effect immediately with no downtime.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 48 hour money back guarantee on all new purchases. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "Can I choose my server location?",
    answer: "Yes! You can select your preferred data centre location at checkout. We offer multiple locations to ensure the best latency for you and your players.",
  },
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
  tag: "Most Popular",
  /** String name matching a lucide-react icon — instantiate in the page component */
  iconName: "Blocks",
  tagColor: "bg-primary/10 border border-primary/20 text-primary",
  headerGradient: "from-primary/20 via-primary/10 to-accent/5",
  headerIconBg: "bg-primary/10 text-primary",
} as const
