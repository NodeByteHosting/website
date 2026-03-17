import type { StockStatus } from "./types"

export interface ProductOverride {
  stock: StockStatus
  enabled: boolean
}

/**
 * Module-level store — persists across requests within the same server process.
 * Resets on server restart. Replace with DB/Redis when a real backend is available.
 */
const store = new Map<string, ProductOverride>()

export function getOverride(id: string): ProductOverride | undefined {
  return store.get(id)
}

export function getAllOverrides(): Record<string, ProductOverride> {
  return Object.fromEntries(store.entries())
}

export function setOverride(id: string, data: ProductOverride): void {
  store.set(id, data)
}
