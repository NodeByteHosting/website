import { unstable_cache } from "next/cache"
import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import type { DedicatedPlanSpec } from "@/packages/core/types/servers/dedicated"
import {
  fetchAllBillingProducts,
  getProductsByCategory,
  getGbpPrice,
  getPricesMap,
  getStockStatus,
  getBillingUrl,
} from "@/packages/core/lib/bytepay"
import { parseDescriptionSpecs, parseProductName } from "@/packages/core/lib/spec-parser"
import { POPULAR_SLUGS, DEFAULT_DDOS } from "@/packages/core/constants/product-overrides"

const getCachedProducts = unstable_cache(
  fetchAllBillingProducts,
  ["billing-products"],
  { revalidate: 300 },
)

/**
 * Returns live-priced game plans for the given billing category slug.
 * RAM and storage are parsed from the billing panel description automatically.
 * Plans whose descriptions don't contain the required specs are skipped.
 */
export async function getGamePlans(categorySlug: string): Promise<GamePlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)

    if (!parsed.ramGB || !parsed.storageGB) return []

    return [
      {
        id: product.slug,
        ramGB: parsed.ramGB,
        storageGB: parsed.storageGB,
        bandwidth: parsed.bandwidth ?? null,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(categorySlug, product.slug),
      } satisfies GamePlanSpec,
    ]
  })
}

/**
 * Returns live-priced dedicated server plans for the given billing category slug.
 * All specs are parsed from the billing panel description automatically.
 * Plans missing cores/ram/storage in their description are skipped.
 */
export async function getDedicatedPlans(categorySlug: string): Promise<DedicatedPlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)

    if (!parsed.ramGB) return []

    return [
      {
        id: product.slug,
        hardware: parsed.hardware as DedicatedPlanSpec["hardware"],
        cpuModel: parsed.cpuModel,
        description: parsed.description,
        cores: parsed.cpu,
        ramGB: parsed.ramGB,
        storageGB: parsed.storageGB,
        storageDescription: parsed.storageDescription,
        bandwidth: parsed.bandwidth ?? null,
        uplink: parsed.uplink,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(categorySlug, product.slug),
      } satisfies DedicatedPlanSpec,
    ]
  })
}

/**
 * Returns live-priced VPS plans for the given billing category slug.
 * All specs are parsed from the billing panel description automatically.
 * Series→location mapping and popular flags come from product-overrides.ts.
 * Plans missing cpu/ram/storage in their description are skipped.
 */
export async function getVpsPlans(categorySlug: string): Promise<VpsPlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)
    const { sku, lineup, series } = parseProductName(product.name)

    if (!parsed.cpu || !parsed.ramGB || !parsed.storageGB) return []

    return [
      {
        id: product.slug,
        sku,
        lineup,
        series: series as VpsPlanSpec["series"],
        hardware: parsed.hardware,
        cpuModel: parsed.cpuModel,
        location: undefined,
        description: parsed.description,
        cpu: parsed.cpu,
        ramGB: parsed.ramGB,
        storageGB: parsed.storageGB,
        bandwidth: parsed.bandwidth ?? null,
        uplink: parsed.uplink,
        ddos: DEFAULT_DDOS,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(categorySlug, product.slug),
      } satisfies VpsPlanSpec,
    ]
  })
}
