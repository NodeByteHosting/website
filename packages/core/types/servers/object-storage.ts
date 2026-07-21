/**
 * Shared interface for object storage (S3-compatible) plan specs.
 * @param {string} id - Unique plan slug
 * @param {string} [description] - Short marketing description
 * @param {number} priceGBP - Monthly price in GBP (base currency)
 * @param {number} storageGB - Storage allowance in gigabytes
 * @param {string} [storageLabel] - Human-friendly storage type, e.g. "SSD-Cached Storage", "High-Speed Storage"
 * @param {string} [accessKeys] - Access key/credential allowance, e.g. "Max 5 active credentials", "Unlimited"
 * @param {string} [egress] - Monthly egress allowance, e.g. "1 TB Free (Overage just $0.01/GB)"
 * @param {string} [apiRequests] - API request pricing/limits, e.g. "100% Free (Unlimited GET, PUT, LIST)"
 * @param {string} [archivePolicy] - Auto-archive/lifecycle policy, e.g. "14 Days (Files transition automatically)"
 * @param {boolean} [popular] - Highlights the plan as a recommended/popular choice
 * @param {string} [url] - Direct order URL on the billing portal
 */
export interface ObjectStoragePlanSpec {
  id: string
  name?: string
  description?: string
  priceGBP: number
  storageGB: number
  storageLabel?: string
  accessKeys?: string
  egress?: string
  apiRequests?: string
  archivePolicy?: string
  /** Remaining marketing bullets not captured by a structured field above. */
  features: string[]
  popular?: boolean
  url?: string
  /** One-time setup fee in GBP (0 if none). */
  setupFeeGBP: number
  /** Native one-time setup fees per currency code. */
  setupFees?: Record<string, number>
  stock?: "in_stock" | "out_of_stock" | "coming_soon"
  /** Native billing prices per currency code, e.g. { GBP: 4, EUR: 4.59, USD: 5.37 } */
  prices?: Record<string, number>
}
