import { unstable_cache } from "next/cache"

import { BILLING_URL } from "@/packages/core/constants/links"

const REQUEST_TIMEOUT_MS = 10_000
const MAX_ATTEMPTS = 3

function getHost(): string {
  const host = process.env.BYTEPAY_HOST
  if (!host) {
    throw new Error("Billing API misconfigured: BYTEPAY_HOST must be set.")
  }
  return host.replace(/\/+$/, "")
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: 300 },
      })

      if (res.ok) return res

      const isRetryable = res.status === 429 || res.status >= 500
      if (!isRetryable || attempt === MAX_ATTEMPTS) return res

      const retryAfter = Number(res.headers.get("Retry-After"))
      const delayMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 250 * 2 ** (attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    } catch (err) {
      lastError = err
      if (attempt === MAX_ATTEMPTS) throw err
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** (attempt - 1)))
    }
  }

  throw lastError
}

interface CatalogPrice {
  currency_code: string
  price: number
  setup_fee: number
}

interface CatalogPlan {
  id: number
  name: string | null
  type: BillingPlan["type"]
  billing_period: number | null
  billing_unit: string | null
  sort: number | null
  prices: CatalogPrice[]
}

interface CatalogProduct {
  id: number
  name: string
  slug: string
  description: string | null
  category_id: number | null
  stock: number | null
  sort: number | null
  plans: CatalogPlan[]
}

interface CatalogCategory {
  id: number
  name: string
  slug: string
  description: string | null
  parent_id: number | null
  sort: number | null
}

interface Catalog {
  categories: CatalogCategory[]
  products: CatalogProduct[]
}

export interface BillingPrice {
  price: number
  setupFee: number
  currencyCode: string
}

export interface BillingPlan {
  id: string
  name: string | null
  type: "free" | "one-time" | "recurring"
  billingPeriod: number | null
  billingUnit: string | null
  sort: number
  prices: BillingPrice[]
}

export interface BillingProduct {
  id: string
  name: string
  slug: string
  description: string | null
  stock: number | null
  hidden: boolean
  sort: number | null
  categorySlug: string
  storeCategorySlug: string
  plans: BillingPlan[]
}

export interface CategoryInfo {
  id: string
  name: string
  slug: string
  storeSlug: string
  description: string | null
  parentId: string | null
}

export interface CategoryHub {
  id: string
  name: string
  slug: string
  description: string | null
  children: CategoryInfo[]
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function fetchCatalog(): Promise<Catalog> {
  const res = await fetchWithRetry(`${getHost()}/api/v1/catalog`)
  if (!res.ok) {
    throw new Error(`Billing API error ${res.status}: ${res.statusText}`)
  }
  const json: { data: Catalog } = await res.json()
  return json.data
}

const getCachedCatalog = unstable_cache(fetchCatalog, ["billing-public-catalog"], {
  revalidate: 300,
})

async function getCategories(): Promise<CategoryInfo[]> {
  const { categories } = await getCachedCatalog()
  return categories.map((category) => ({
    id: String(category.id),
    name: category.name,
    slug: nameToSlug(category.name),
    storeSlug: category.slug,
    description: category.description,
    parentId: category.parent_id != null ? String(category.parent_id) : null,
  }))
}

async function fetchCategoryTree(): Promise<CategoryHub[]> {
  const categories = await getCategories()
  const byParent = new Map<string, CategoryInfo[]>()

  for (const cat of categories) {
    if (!cat.parentId) continue
    if (!byParent.has(cat.parentId)) byParent.set(cat.parentId, [])
    byParent.get(cat.parentId)!.push(cat)
  }

  return categories
    .filter((cat) => !cat.parentId)
    .map((hub) => ({
      id: hub.id,
      name: hub.name,
      slug: hub.slug,
      description: hub.description,
      children: [hub, ...(byParent.get(hub.id) ?? [])],
    }))
}

export const getCachedCategoryTree = unstable_cache(fetchCategoryTree, ["billing-public-category-tree"], {
  revalidate: 300,
})

export async function getCategoryHub(hubSlugOrAliases: string | string[]): Promise<CategoryHub | null> {
  const aliases = Array.isArray(hubSlugOrAliases) ? hubSlugOrAliases : [hubSlugOrAliases]
  const tree = await getCachedCategoryTree()

  const exact = tree.find((hub) => aliases.includes(hub.slug))
  if (exact) return exact

  const fuzzy = tree.find((hub) => aliases.some((alias) => hub.slug.includes(alias)))
  if (fuzzy) {
    console.warn(
      `[bytepay] No category exactly matched hub aliases [${aliases.join(", ")}] — falling back to "${fuzzy.name}" (slug "${fuzzy.slug}") via substring match. Rename the Paymenter category, or add its slug to the alias list, to make this exact.`,
    )
    return fuzzy
  }

  return null
}

function warnSlugCollisions(categories: CategoryInfo[]): void {
  const ownerOfSlug = new Map<string, CategoryInfo>()
  for (const cat of categories) {
    const owner = ownerOfSlug.get(cat.slug)
    if (owner && owner.id !== cat.id) {
      console.warn(
        `[bytepay] Category slug collision: "${cat.name}" (id ${cat.id}) and "${owner.name}" (id ${owner.id}) both slugify to "${cat.slug}" — products in one category may shadow the other on the site.`,
      )
    } else {
      ownerOfSlug.set(cat.slug, cat)
    }
  }
}

export async function fetchAllBillingProducts(): Promise<BillingProduct[]> {
  const [{ products }, categories] = await Promise.all([getCachedCatalog(), getCategories()])
  warnSlugCollisions(categories)
  const byId = new Map(categories.map((category) => [category.id, category]))

  return products.map((product): BillingProduct => {
    const category = product.category_id != null ? byId.get(String(product.category_id)) : undefined
    return {
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      stock: product.stock,
      hidden: false,
      sort: product.sort,
      categorySlug: category?.slug ?? "",
      storeCategorySlug: category?.storeSlug ?? "",
      plans: product.plans.map((plan) => ({
        id: String(plan.id),
        name: plan.name,
        type: plan.type,
        billingPeriod: plan.billing_period,
        billingUnit: plan.billing_unit,
        sort: plan.sort ?? 0,
        prices: plan.prices.map((price) => ({
          price: price.price,
          setupFee: price.setup_fee,
          currencyCode: price.currency_code,
        })),
      })),
    }
  })
}

export function getProductsByCategory(
  products: BillingProduct[],
  categorySlug: string,
): BillingProduct[] {
  return products
    .filter((p) => p.categorySlug === categorySlug)
    .sort((a, b) => {
      if (a.sort === b.sort) return parseInt(a.id) - parseInt(b.id)
      if (a.sort === null) return 1
      if (b.sort === null) return -1
      return a.sort - b.sort
    })
}

function monthlyPlan(product: BillingProduct): BillingPlan | undefined {
  return (
    product.plans.find((p) => p.type === "recurring" && p.billingPeriod === 1 && p.billingUnit === "month")
    ?? product.plans.find((p) => p.type === "recurring")
    ?? product.plans[0]
  )
}

export function getGbpPrice(product: BillingProduct): number {
  return monthlyPlan(product)?.prices.find((p) => p.currencyCode === "GBP")?.price ?? 0
}

export function getPricesMap(product: BillingProduct): Record<string, number> {
  const map: Record<string, number> = {}
  for (const price of monthlyPlan(product)?.prices ?? []) {
    map[price.currencyCode] = price.price
  }
  return map
}

export function getSetupFeeGBP(product: BillingProduct): number {
  return monthlyPlan(product)?.prices.find((p) => p.currencyCode === "GBP")?.setupFee ?? 0
}

export function getSetupFeesMap(product: BillingProduct): Record<string, number> {
  const map: Record<string, number> = {}
  for (const price of monthlyPlan(product)?.prices ?? []) {
    map[price.currencyCode] = price.setupFee
  }
  return map
}

export function getStockStatus(
  product: BillingProduct,
): "in_stock" | "out_of_stock" | "coming_soon" {
  if (product.stock === 0) return "out_of_stock"
  return "in_stock"
}

export function getBillingUrl(product: BillingProduct): string {
  return `${BILLING_URL}/store/${product.storeCategorySlug}/${product.slug}`
}
