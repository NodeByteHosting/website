/**
 * Shared interface for all vps server plan specs.
 * @param {string} id - Unique plan slug, used as URL path segment and translation key
 * @param {string} [description] - Short marketing description for the plan card
 * @param {string} [cpuModel] - CPU model name e.g. "AMD Ryzen™ 7 1700X"
 * @param {number} priceGBP - Monthly price in GBP (base currency)
 * @param {number} cpu - Number of vCPU cores allocated
 * @param {number} ramGB - Allocated RAM in gigabytes
 * @param {number} storageGB - Allocated NVMe SSD storage in gigabytes
 * @param {{ amount: number; unit: "MB" | "GB" | "TB" } | null} bandwidth - Bandwidth allowance; null = unmetered
 * @param {{ amount: number; unit: "Mbps" | "Gbps" }} [uplink] - Port speed; defaults to platform default if omitted
 * @param {{ layers: number[]; autoOn: boolean }} [ddos] - DDoS protection layers and mitigation mode
 * @param {string} [location] - Data centre location e.g. "Helsinki, Finland"
 * @param {boolean} [popular] - Highlights the plan as a recommended/popular choice
 * @param {string} url - Direct order URL on the billing portal
 */
export interface VpsPlanSpec {
  id: string
  description?: string
  cpuModel?: string
  priceGBP: number
  cpu: number
  ramGB: number
  storageGB: number
  bandwidth: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  ddos?: { layers: number[]; autoOn: boolean }
  location?: string
  popular?: boolean
  url: string
  /** Availability status. Defaults to "in_stock" when omitted. */
  stock?: "in_stock" | "out_of_stock" | "coming_soon"
}