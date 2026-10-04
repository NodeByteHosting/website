export interface DiscordBotPlanSpec {
  id: string
  name: string
  worksWith?: string
  ramMB: number
  vcpu?: number
  storageGB?: number
  backups?: number
  features: string[]
  priceGBP: number
  prices: Record<string, number>
  setupFeeGBP: number
  setupFees: Record<string, number>
  popular?: boolean
  url: string
  stock: "in_stock" | "out_of_stock" | "coming_soon"
}
