import { unstable_cache } from "next/cache"
import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import type { DedicatedPlanSpec } from "@/packages/core/types/servers/dedicated"
import type { ObjectStoragePlanSpec } from "@/packages/core/types/servers/object-storage"
import type { DiscordBotPlanSpec } from "@/packages/core/types/servers/discord-bot"
import {
  fetchAllBillingProducts,
  getProductsByCategory,
  getGbpPrice,
  getPricesMap,
  getSetupFeeGBP,
  getSetupFeesMap,
  getStockStatus,
  getBillingUrl,
} from "@/packages/core/lib/bytepay"
import { parseBotSpecs, parseDescriptionSpecs, parseProductName, parseObjectStorageSpecs, formatStorageType } from "@/packages/core/lib/spec-parser"
import { POPULAR_SLUGS, DEFAULT_DDOS } from "@/packages/core/constants/product-overrides"
import type { BillingProduct } from "@/packages/core/lib/bytepay"

const getCachedProducts = unstable_cache(
  fetchAllBillingProducts,
  ["billing-public-products"],
  { revalidate: 300 },
)

function warnDroppedProduct(
  product: BillingProduct,
  categorySlug: string,
  missingFields: string[],
): void {
  console.warn(
    `[billing-service] Product "${product.name}" (id ${product.id}, slug ${product.slug}) in category "${categorySlug}" is live but missing parsed spec(s): ${missingFields.join(", ")}. Check its description formatting.`,
  )
}

export async function getGamePlans(categorySlug: string): Promise<GamePlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)

    if (!parsed.ramGB || !parsed.storageGB) {
      const missing = [!parsed.ramGB && "ramGB", !parsed.storageGB && "storageGB"].filter(
        (v): v is string => Boolean(v),
      )
      warnDroppedProduct(product, categorySlug, missing)
      return []
    }

    return [
      {
        id: product.slug,
        name: product.name,
        category: categorySlug,
        cpu: parsed.cpu,
        location: parsed.location,
        description: parsed.description,
        databases: parsed.databases,
        backups: parsed.backups,
        ramGB: parsed.ramGB,
        ramType: parsed.ramType,
        storageGB: parsed.storageGB,
        storageLabel: formatStorageType(parsed.storageType),
        bandwidth: parsed.bandwidth ?? null,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        setupFeeGBP: getSetupFeeGBP(product),
        setupFees: getSetupFeesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(product),
      } satisfies GamePlanSpec,
    ]
  })
}

export async function getDedicatedPlans(categorySlug: string): Promise<DedicatedPlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)

    if (!parsed.ramGB) {
      warnDroppedProduct(product, categorySlug, ["ramGB"])
      return []
    }

    return [
      {
        id: product.slug,
        hardware: parsed.hardware as DedicatedPlanSpec["hardware"],
        cpuModel: parsed.cpuModel,
        location: parsed.location,
        description: parsed.description,
        databases: parsed.databases,
        backups: parsed.backups,
        cores: parsed.cpu,
        ramGB: parsed.ramGB,
        storageGB: parsed.storageGB,
        storageDescription: parsed.storageDescription,
        bandwidth: parsed.bandwidth ?? null,
        uplink: parsed.uplink,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        setupFeeGBP: getSetupFeeGBP(product),
        setupFees: getSetupFeesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(product),
      } satisfies DedicatedPlanSpec,
    ]
  })
}

export async function getVpsPlans(categorySlug: string): Promise<VpsPlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseDescriptionSpecs(product.description)
    const { sku, lineup, series } = parseProductName(product.name)

    if (!parsed.cpu || !parsed.ramGB || !parsed.storageGB) {
      const missing = [
        !parsed.cpu && "cpu",
        !parsed.ramGB && "ramGB",
        !parsed.storageGB && "storageGB",
      ].filter((v): v is string => Boolean(v))
      warnDroppedProduct(product, categorySlug, missing)
      return []
    }

    return [
      {
        id: product.slug,
        sku,
        lineup,
        series: series as VpsPlanSpec["series"],
        hardware: parsed.hardware,
        cpuModel: parsed.cpuModel,
        location: parsed.location,
        description: parsed.description,
        databases: parsed.databases,
        backups: parsed.backups,
        cpu: parsed.cpu,
        ramGB: parsed.ramGB,
        storageGB: parsed.storageGB,
        bandwidth: parsed.bandwidth ?? null,
        uplink: parsed.uplink,
        ddos: DEFAULT_DDOS,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        setupFeeGBP: getSetupFeeGBP(product),
        setupFees: getSetupFeesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(product),
      } satisfies VpsPlanSpec,
    ]
  })
}

export async function getObjectStoragePlans(categorySlug: string): Promise<ObjectStoragePlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseObjectStorageSpecs(product.description)

    if (!parsed.storageGB) {
      warnDroppedProduct(product, categorySlug, ["storageGB"])
      return []
    }

    return [
      {
        id: product.slug,
        name: product.name,
        description: parsed.storageValue,
        storageGB: parsed.storageGB,
        storageLabel: formatStorageType(parsed.storageType),
        accessKeys: parsed.accessKeys,
        egress: parsed.egress,
        apiRequests: parsed.apiRequests,
        archivePolicy: parsed.archivePolicy,
        features: parsed.features,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        setupFeeGBP: getSetupFeeGBP(product),
        setupFees: getSetupFeesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(product),
      } satisfies ObjectStoragePlanSpec,
    ]
  })
}

export async function getDiscordBotPlans(categorySlug: string): Promise<DiscordBotPlanSpec[]> {
  const all = await getCachedProducts()
  return getProductsByCategory(all, categorySlug).flatMap((product) => {
    const parsed = parseBotSpecs(product.description)

    if (!parsed.ramMB) {
      warnDroppedProduct(product, categorySlug, ["ramMB"])
      return []
    }

    return [
      {
        id: product.slug,
        name: product.name,
        worksWith: parsed.worksWith,
        ramMB: parsed.ramMB,
        vcpu: parsed.vcpu,
        storageGB: parsed.storageGB,
        backups: parsed.backups,
        features: parsed.features,
        popular: POPULAR_SLUGS.has(`${categorySlug}/${product.slug}`),
        priceGBP: getGbpPrice(product),
        prices: getPricesMap(product),
        setupFeeGBP: getSetupFeeGBP(product),
        setupFees: getSetupFeesMap(product),
        stock: getStockStatus(product),
        url: getBillingUrl(product),
      } satisfies DiscordBotPlanSpec,
    ]
  })
}
