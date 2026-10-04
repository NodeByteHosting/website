export interface GamePlanSpec {
  id: string
  name?: string
  category: string
  description?: string
  cpu?: number
  databases?: number
  backups?: boolean
  cpuModel?: string
  priceGBP: number
  setupFeeGBP: number
  setupFees?: Record<string, number>
  ramGB: number
  ramType?: string
  storageGB: number
  storageLabel?: string
  bandwidth: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  ddos?: { layers: number[]; autoOn: boolean }
  location?: string
  popular?: boolean
  url?: string
  stock?: "in_stock" | "out_of_stock" | "coming_soon"
  prices?: Record<string, number>
}