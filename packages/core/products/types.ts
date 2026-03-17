export type StockStatus = "in_stock" | "out_of_stock" | "coming_soon"

export type ProductType = "game" | "vps"

/**
 * Unified read-only view of any product plan.
 * Consumed by the admin panel and derived from the hardcoded plan constants.
 * Replace `getAllProducts()` with an API call in `service.ts` when the backend is ready.
 */
export interface ProductEntry {
  /** Unique slug — format: "{category}-{planId}" e.g. "minecraft-ember", "amd-2GB-R71700X" */
  id: string
  /** Technical plan id from the spec constant e.g. "ember", "2GB-R71700X" */
  planId: string
  /** Category slug: "minecraft" | "rust" | "hytale" | "amd" | "intel" */
  category: string
  /** Product type */
  type: ProductType
  /** Optional marketing description */
  description?: string
  /** Monthly price in GBP */
  priceGBP: number
  /** Availability status */
  stock: StockStatus
  /** Highlighted as the recommended / most-popular plan */
  popular?: boolean
  /** Direct order URL on the billing portal */
  billingUrl?: string
  /** Data-centre location string */
  location?: string

  // ── Specs (optional — not all product types expose all fields) ────────────
  cpu?: number
  cpuModel?: string
  ramGB?: number
  storageGB?: number
  bandwidth?: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  ddos?: { layers: number[]; autoOn: boolean }
}
