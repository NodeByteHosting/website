import { MINECRAFT_PLANS } from "@/packages/core/constants/game/minecraft"
import { RUST_PLANS } from "@/packages/core/constants/game/rust"
import { HYTALE_PLANS } from "@/packages/core/constants/game/hytale"
import { FIVEM_PLANS } from "@/packages/core/constants/game/fivem"
import { REDM_PLANS } from "@/packages/core/constants/game/redm"
import { PALWORLD_PLANS } from "@/packages/core/constants/game/palworld"
import { AMD_PLANS } from "@/packages/core/constants/vps/amd"
import { INTEL_PLANS } from "@/packages/core/constants/vps/intel"
import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import type { ProductEntry } from "./types"

// ─── Adapters ────────────────────────────────────────────────────────────────

function fromGamePlan(plan: GamePlanSpec, category: string): ProductEntry {
  return {
    id: `${category}-${plan.id}`,
    planId: plan.id,
    category,
    type: "game",
    description: plan.description,
    priceGBP: plan.priceGBP,
    stock: plan.stock ?? "in_stock",
    popular: plan.popular,
    billingUrl: plan.url,
    location: plan.location,
    cpuModel: plan.cpuModel,
    ramGB: plan.ramGB,
    storageGB: plan.storageGB,
    bandwidth: plan.bandwidth,
    uplink: plan.uplink,
    ddos: plan.ddos,
  }
}

function fromVpsPlan(plan: VpsPlanSpec, category: string): ProductEntry {
  return {
    id: `${category}-${plan.id}`,
    planId: plan.id,
    category,
    type: "vps",
    description: plan.description,
    priceGBP: plan.priceGBP,
    stock: plan.stock ?? "in_stock",
    popular: plan.popular,
    billingUrl: plan.url,
    location: plan.location,
    cpu: plan.cpu,
    cpuModel: plan.cpuModel,
    ramGB: plan.ramGB,
    storageGB: plan.storageGB,
    bandwidth: plan.bandwidth,
    uplink: plan.uplink,
    ddos: plan.ddos,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * All products derived from the hardcoded plan constants.
 * TODO: replace with an API fetch when the backend product endpoint is ready.
 */
export function getAllProducts(): ProductEntry[] {
  return [
    ...MINECRAFT_PLANS.map((p) => fromGamePlan(p, "minecraft")),
    ...RUST_PLANS.map((p) => fromGamePlan(p, "rust")),
    ...HYTALE_PLANS.map((p) => fromGamePlan(p, "hytale")),
    ...FIVEM_PLANS.map((p) => fromGamePlan(p, "fivem")),
    ...REDM_PLANS.map((p) => fromGamePlan(p, "redm")),
    ...PALWORLD_PLANS.map((p) => fromGamePlan(p, "palworld")),
    ...AMD_PLANS.map((p) => fromVpsPlan(p, "amd")),
    ...INTEL_PLANS.map((p) => fromVpsPlan(p, "intel")),
  ]
}

/** Products filtered by product type ("game" | "vps"). */
export function getProductsByType(type: "game" | "vps"): ProductEntry[] {
  return getAllProducts().filter((p) => p.type === type)
}

/** Products for a specific category slug e.g. "minecraft", "amd". */
export function getProductsByCategory(category: string): ProductEntry[] {
  return getAllProducts().filter((p) => p.category === category)
}

/**
 * Returns true if the whole category should be shown as out-of-stock on its
 * landing page — i.e. the plan list is empty OR every plan is individually OOS.
 */
export function isCategoryOutOfStock(category: string): boolean {
  const plans = getProductsByCategory(category)
  return plans.length === 0 || plans.every((p) => p.stock === "out_of_stock")
}

/**
 * Lowest in-stock price for a category.
 * Returns null when every plan is OOS or the category has no plans.
 */
export function getCategoryStartingPrice(category: string): number | null {
  const available = getProductsByCategory(category).filter(
    (p) => p.stock === "in_stock",
  )
  if (available.length === 0) return null
  return Math.min(...available.map((p) => p.priceGBP))
}
