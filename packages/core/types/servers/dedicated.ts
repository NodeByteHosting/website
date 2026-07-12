/**
 * Shared interface for all dedicated (bare-metal) server plan specs.
 * @param {string} id - Unique plan slug
 * @param {string} [description] - Short marketing description
 * @param {string} [cpuModel] - CPU model name e.g. "Intel® Xeon® E-2388G"
 * @param {number} priceGBP - Monthly price in GBP (base currency)
 * @param {number} cores - Physical CPU cores
 * @param {number} ramGB - Allocated RAM in gigabytes
 * @param {number} storageGB - Primary storage in gigabytes
 * @param {{ amount: number; unit: "MB" | "GB" | "TB" } | null} bandwidth - Bandwidth allowance; null = unmetered
 * @param {{ amount: number; unit: "Mbps" | "Gbps" }} [uplink] - Port speed
 * @param {string} [location] - Data centre location
 * @param {boolean} [popular] - Highlights the plan as a recommended/popular choice
 * @param {string} url - Direct order URL on the billing portal
 */
export interface DedicatedPlanSpec {
  id: string
  description?: string
  cpuModel?: string
  hardware?: "amd" | "intel"
  priceGBP: number
  /** One-time setup fee in GBP (0 if none). */
  setupFeeGBP: number
  /** Native one-time setup fees per currency code. */
  setupFees?: Record<string, number>
  /** Physical CPU cores. May be undefined if not listed in the product description. */
  cores?: number
  ramGB: number
  storageGB?: number
  /** Raw storage label, e.g. "2 × 1 TB NVMe SSD (RAID 1)" */
  storageDescription?: string
  bandwidth: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  location?: string
  popular?: boolean
  url: string
  stock?: "in_stock" | "out_of_stock" | "coming_soon"
  /** Native billing prices per currency code, e.g. { GBP: 80, EUR: 92, USD: 99 } */
  prices?: Record<string, number>
}
