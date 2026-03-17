import { VpsPlanSpec } from "@/packages/core/types/servers/vps";

export const INTEL_BILLING_URL = "https://billing.nodebyte.host/store/vps-hosting"

/**
 * Intel VPS plans.
 * Currently EMPTY — out of stock.
 * Add entries here (matching the VpsPlanSpec shape) when inventory is available.
 */
export const INTEL_PLANS: VpsPlanSpec[] = []

/** Feature section definitions — icon maps to GameFeatures iconMap */
export const INTEL_FEATURE_KEYS = [
  { key: "hardware", icon: "Cpu"       as const },
  { key: "storage",  icon: "HardDrive" as const },
  { key: "ddos",     icon: "Shield"    as const },
  { key: "network",  icon: "Zap"       as const },
  { key: "access",   icon: "Settings"  as const },
  { key: "support",  icon: "Users"     as const },
] as const

/** FAQ keys — maps to `vps.intel.faqs.<key>` in translations */
export const INTEL_FAQ_KEYS = [
  "rootAccess", "os", "upgrade", "bandwidth", "ddos", "refunds", "windows", "location",
] as const

/** Number of hero feature pills (maps to `vps.intel.heroFeatures.{0..n}`) */
export const INTEL_HERO_FEATURE_COUNT = 4

/** Spec panel rows shown in the hero */
export const INTEL_SPECS = [
  { icon: "Cpu"       as const, label: "Processor",   value: "Enterprise Intel®"  },
  { icon: "Zap"       as const, label: "Storage",     value: "NVMe SSD"           },
  { icon: "HardDrive" as const, label: "Memory",      value: "DDR4 ECC RAM"       },
  { icon: "Network"   as const, label: "Network",     value: "1 Gbps Uplink"      },
  { icon: "Shield"    as const, label: "Protection",  value: "Enterprise DDoS"    },
  { icon: "Terminal"  as const, label: "Access",      value: "Full Root / SSH"    },
]
