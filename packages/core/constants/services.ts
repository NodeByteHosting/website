import { Gamepad2, Server, Cpu, type LucideIcon } from "lucide-react"

/**
 * ServiceCategory defines a top-level service hub offered by NodeByte.
 *
 * This is the static config layer — in future, replace SERVICE_CATEGORIES
 * with an API/DB fetch that returns the same shape.
 */
export type ServiceCategory = {
  /** Unique slug, used for keying and future DB lookups */
  id: string
  /** Display name */
  name: string
  /** Short marketing description */
  description: string
  /** Hub page URL */
  href: string
  /** Lucide icon component */
  icon: LucideIcon
  /** Tailwind gradient classes for the card header (bg-linear-to-br ...) */
  gradient: string
  /** Tailwind text-color class for the icon and check marks */
  iconColor: string
  /** Tailwind hover:border-* class for card accent border on hover */
  accentBorder: string
  /** Lowest available price in GBP — rendered via the Price component so it respects the user's currency */
  startingPriceGBP: number
  /** Four short feature highlights shown as a checklist */
  highlights: [string, string, string, string]
  /** Set to false to hide this category everywhere on the site */
  enabled: boolean
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "game-servers",
    name: "Game Servers",
    description:
      "Instant deploy game servers with one-click mod loaders, DDoS protection, and a powerful control panel. Supports Minecraft, Rust, Hytale, and more.",
    href: "/games",
    icon: Gamepad2,
    gradient: "from-primary/25 via-primary/8 to-transparent",
    iconColor: "text-primary",
    accentBorder: "hover:border-primary/40",
    startingPriceGBP: 4,
    highlights: [
      "Minecraft, Rust & Hytale",
      "One-click mod installs",
      "Enterprise DDoS protection",
      "BytePanel control panel",
    ],
    enabled: true,
  },
  {
    id: "vps",
    name: "VPS Hosting",
    description:
      "Full control virtual private servers on enterprise hardware with NVMe SSD storage, full root access, and instant provisioning.",
    href: "/vps",
    icon: Server,
    gradient: "from-blue-600/25 via-blue-500/8 to-transparent",
    iconColor: "text-blue-400",
    accentBorder: "hover:border-blue-400/40",
    startingPriceGBP: 4.50,
    highlights: [
      "Enterprise-grade processors",
      "Full root / SSH access",
      "NVMe SSD storage",
      "Enterprise DDoS protection",
    ],
    enabled: true,
  },
  {
    id: "dedicated",
    name: "Dedicated Servers",
    description:
      "Physical bare-metal servers with fully dedicated CPU cores, enterprise storage, and IPMI out-of-band access. Zero resource contention and maximum raw performance.",
    href: "/dedicated",
    icon: Cpu,
    gradient: "from-amber-600/25 via-amber-500/8 to-transparent",
    iconColor: "text-amber-400",
    accentBorder: "hover:border-amber-400/40",
    startingPriceGBP: 50,
    highlights: [
      "100% dedicated CPU cores",
      "IPMI out-of-band access",
      "Enterprise storage",
      "Enterprise DDoS protection",
    ],
    enabled: true,
  },
]
