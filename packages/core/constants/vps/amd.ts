import { VpsPlanSpec } from "@/packages/core/types/servers/vps";

export const AMD_BILLING_URL = "https://billing.nodebyte.host/store/vps-hosting"

/** AMD plans: add / remove entries here to control what's listed on the site */
export const AMD_PLANS: VpsPlanSpec[] = [
  {
    id: "2GB-R71700X",
    description: "Perfect for small projects, dev environments, and personal sites.",
    cpuModel: "AMD Ryzen™ 7 1700X",
    priceGBP: 4.50,
    cpu: 1,
    ramGB: 2,
    storageGB: 25,
    bandwidth: { amount: 1, unit: "TB" },
    uplink: { amount: 1, unit: "Gbps" },
    ddos: { layers: [3, 4, 7], autoOn: true },
    url: "https://billing.nodebyte.host/store/vps-hosting/2gb-r71700x",
  },
  {
    id: "4GB-R71700X",
    description: "Great for growing web apps, APIs, and small databases.",
    cpuModel: "AMD Ryzen™ 7 1700X",
    priceGBP: 9,
    cpu: 2,
    ramGB: 4,
    storageGB: 50,
    bandwidth: { amount: 2, unit: "TB" },
    uplink: { amount: 1, unit: "Gbps" },
    ddos: { layers: [3, 4, 7], autoOn: true },
    url: "https://billing.nodebyte.host/store/vps-hosting/4gb-r71700x",
  },
  {
    id: "8GB-R71700X",
    description: "Ideal for production workloads, game backends, and high-traffic sites.",
    cpuModel: "AMD Ryzen™ 7 1700X",
    priceGBP: 18,
    cpu: 4,
    ramGB: 8,
    storageGB: 100,
    bandwidth: null,
    uplink: { amount: 1, unit: "Gbps" },
    ddos: { layers: [3, 4, 7], autoOn: true },
    popular: true,
    url: "https://billing.nodebyte.host/store/vps-hosting/8gb-r71700x",
  },
  {
    id: "16GB-R71700X",
    description: "Maximum power for demanding applications and resource-heavy services.",
    cpuModel: "AMD Ryzen™ 7 1700X",
    priceGBP: 35,
    cpu: 4,
    ramGB: 16,
    storageGB: 200,
    bandwidth: null,
    uplink: { amount: 1, unit: "Gbps" },
    ddos: { layers: [3, 4, 7], autoOn: true },
    url: "https://billing.nodebyte.host/store/vps-hosting/16gb-r71700x",
  },
]

/** Feature section definitions — icon maps to GameFeatures iconMap */
export const AMD_FEATURE_KEYS = [
  { key: "hardware", icon: "Cpu"       as const },
  { key: "storage",  icon: "HardDrive" as const },
  { key: "ddos",     icon: "Shield"    as const },
  { key: "network",  icon: "Zap"       as const },
  { key: "access",   icon: "Settings"  as const },
  { key: "support",  icon: "Users"     as const },
] as const

/** FAQ keys — maps to `vps.amd.faqs.<key>` in translations */
export const AMD_FAQ_KEYS = [
  "rootAccess", "os", "upgrade", "bandwidth", "ddos", "refunds", "windows", "location",
] as const

/** Number of hero feature pills (maps to `vps.amd.heroFeatures.{0..n}`) */
export const AMD_HERO_FEATURE_COUNT = 4

/** Spec panel rows shown in the hero */
export const AMD_SPECS = [
  { icon: "Cpu"       as const, label: "Processor",   value: "Enterprise AMD™" },
  { icon: "Zap"       as const, label: "Storage",     value: "NVMe SSD"              },
  { icon: "HardDrive" as const, label: "Memory",      value: "DDR4 ECC RAM"          },
  { icon: "Network"   as const, label: "Network",     value: "1 Gbps Uplink"         },
  { icon: "Shield"    as const, label: "Protection",  value: "Enterprise DDoS"       },
  { icon: "Terminal"  as const, label: "Access",      value: "Full Root / SSH"       },
]