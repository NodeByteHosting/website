/**
 * Server-side only — BYTEPAY_TOKEN is never sent to the browser.
 *
 * Fetches products from the Paymenter admin API and normalises the
 * JSON:API response into a flat, typed structure the website can consume.
 */

import { unstable_cache } from "next/cache"

function getConfig(): { host: string; token: string } {
  const host = process.env.BYTEPAY_HOST
  const token = process.env.BYTEPAY_TOKEN
  if (!host || !token) {
    throw new Error(
      "Billing API misconfigured: BYTEPAY_HOST and BYTEPAY_TOKEN must both be set.",
    )
  }
  return { host, token }
}

const REQUEST_TIMEOUT_MS = 10_000
const MAX_ATTEMPTS = 3
const PAGE_SIZE = 100

/** Fetch with a timeout and retries for transient failures (429/5xx/network errors). */
async function fetchWithRetry(url: string, token: string): Promise<Response> {
  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
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

// ─── JSON:API wire types ───────────────────────────────────────────────────

interface JsonApiRelRef {
  type: string
  id: string
}

interface JsonApiResource {
  type: string
  id: string
  attributes: Record<string, unknown>
  relationships?: Record<string, { data: JsonApiRelRef | JsonApiRelRef[] | null }>
}

interface JsonApiResponse {
  data: JsonApiResource[]
  included?: JsonApiResource[]
  links?: { next?: string | null }
  meta?: Record<string, unknown>
}

// ─── Normalised types ──────────────────────────────────────────────────────

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
  image: string | null
  /** null = unlimited, 0 = out of stock, n = n remaining */
  stock: number | null
  hidden: boolean
  sort: number | null
  /** Derived from the category's name, e.g. "minecraft", "rust", "amd-vps" */
  categorySlug: string
  plans: BillingPlan[]
}

// ─── JSON:API normalisation ────────────────────────────────────────────────

function buildIncludedMap(included: JsonApiResource[] = []): Map<string, JsonApiResource> {
  const map = new Map<string, JsonApiResource>()
  for (const item of included) {
    map.set(`${item.type}:${item.id}`, item)
  }
  return map
}

/** Convert a display name to a URL-safe slug, e.g. "AMD VPS" → "amd-vps". */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface CategoryInfo {
  id: string
  name: string
  parentId: string | null
}

/**
 * Fetch every category from the admin Categories endpoint (authoritative —
 * independent of whatever a given products page happens to `include`).
 * Paymenter doesn't expose a `slug` attribute on categories, only `name`
 * and `parent_id`, so slugs are still derived by slugifying the name.
 */
async function fetchAllCategories(): Promise<CategoryInfo[]> {
  const { host, token } = getConfig()
  const all: CategoryInfo[] = []
  let page = 1

  while (true) {
    const url = new URL(`${host}/api/v1/admin/categories`)
    url.searchParams.set("per_page", String(PAGE_SIZE))
    url.searchParams.set("page", String(page))

    const res = await fetchWithRetry(url.toString(), token)
    if (!res.ok) {
      throw new Error(`Billing API error ${res.status}: ${res.statusText}`)
    }

    const json: JsonApiResponse = await res.json()
    for (const cat of json.data) {
      all.push({
        id: cat.id,
        name: (cat.attributes.name as string) ?? "",
        parentId: cat.attributes.parent_id != null ? String(cat.attributes.parent_id) : null,
      })
    }

    if (!json.links?.next) break
    page++
  }

  return all
}

const getCachedCategories = unstable_cache(fetchAllCategories, ["billing-categories"], {
  revalidate: 600,
})

/**
 * Build category id → slug from the authoritative category list, warning on
 * any two categories whose names slugify to the same value (since site pages
 * key off the flat leaf slug, a collision would silently merge two categories'
 * products together).
 */
function buildCategorySlugMap(categories: CategoryInfo[]): Map<string, string> {
  const slugMap = new Map<string, string>()
  const ownerOfSlug = new Map<string, string>()

  for (const cat of categories) {
    const slug = nameToSlug(cat.name)
    slugMap.set(cat.id, slug)

    const existingOwner = ownerOfSlug.get(slug)
    if (existingOwner && existingOwner !== cat.id) {
      console.warn(
        `[bytepay] Category slug collision: "${cat.name}" (id ${cat.id}) and category id ${existingOwner} both slugify to "${slug}" — products in one category may shadow the other on the site.`,
      )
    } else {
      ownerOfSlug.set(slug, cat.id)
    }
  }

  return slugMap
}

function normalisePage(
  data: JsonApiResource[],
  map: Map<string, JsonApiResource>,
  categorySlugMap: Map<string, string>,
): BillingProduct[] {
  return data.map((product): BillingProduct => {
    const attr = product.attributes

    const catRef = product.relationships?.category?.data as JsonApiRelRef | null | undefined
    const categorySlug = catRef ? (categorySlugMap.get(catRef.id) ?? "") : ""

    const planRefs = (product.relationships?.plans?.data ?? []) as JsonApiRelRef[]
    const plans = planRefs
      .map((ref): BillingPlan | null => {
        const planRes = map.get(`plans:${ref.id}`)
        if (!planRes) return null
        const pa = planRes.attributes

        const priceRefs = (planRes.relationships?.prices?.data ?? []) as JsonApiRelRef[]
        const prices = priceRefs
          .map((pref): BillingPrice | null => {
            const priceRes = map.get(`prices:${pref.id}`)
            if (!priceRes) return null
            const pra = priceRes.attributes
            return {
              price: parseFloat((pra.price as string) ?? "0"),
              setupFee: parseFloat((pra.setup_fee as string) ?? "0"),
              currencyCode: pra.currency_code as string,
            }
          })
          .filter((p): p is BillingPrice => p !== null)

        return {
          id: ref.id,
          name: (pa.name as string | null) ?? null,
          type: pa.type as BillingPlan["type"],
          billingPeriod: (pa.billing_period as number | null) ?? null,
          billingUnit: (pa.billing_unit as string | null) ?? null,
          sort: (pa.sort as number) ?? 0,
          prices,
        }
      })
      .filter((p): p is BillingPlan => p !== null)

    return {
      id: product.id,
      name: attr.name as string,
      slug: attr.slug as string,
      description: (attr.description as string | null) ?? null,
      image: (attr.image as string | null) ?? null,
      stock: attr.stock === undefined ? null : (attr.stock as number | null),
      hidden: Boolean(attr.hidden),
      sort: attr.sort === null || attr.sort === undefined ? null : (attr.sort as number),
      categorySlug,
      plans,
    }
  })
}

async function fetchPage(
  page: number,
  categorySlugMap: Map<string, string>,
): Promise<{ products: BillingProduct[]; hasNext: boolean }> {
  const { host, token } = getConfig()

  const url = new URL(`${host}/api/v1/admin/products`)
  url.searchParams.set("include", "category,plans,plans.prices")
  url.searchParams.set("filter[hidden]", "0")
  url.searchParams.set("per_page", String(PAGE_SIZE))
  url.searchParams.set("page", String(page))

  const res = await fetchWithRetry(url.toString(), token)

  if (!res.ok) {
    throw new Error(`Billing API error ${res.status}: ${res.statusText}`)
  }

  const json: JsonApiResponse = await res.json()
  const map = buildIncludedMap(json.included)

  return {
    products: normalisePage(json.data, map, categorySlugMap),
    hasNext: Boolean(json.links?.next),
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Fetch every non-hidden product across all pagination pages. */
export async function fetchAllBillingProducts(): Promise<BillingProduct[]> {
  const categories = await getCachedCategories()
  const categorySlugMap = buildCategorySlugMap(categories)

  const all: BillingProduct[] = []
  let page = 1

  while (true) {
    const { products, hasNext } = await fetchPage(page, categorySlugMap)
    all.push(...products)
    if (!hasNext) break
    page++
  }

  return all
}

/**
 * Return products belonging to a category, identified by the slugified
 * category name (e.g. "minecraft", "rust", "amd-vps").
 * Ordered by ascending sort index; null-sort products go last, then by id.
 */
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

/** Resolve the GBP monthly price from the product's recurring plan. */
export function getGbpPrice(product: BillingProduct): number {
  const plan =
    product.plans.find((p) => p.type === "recurring" && p.billingPeriod === 1 && p.billingUnit === "month")
    ?? product.plans.find((p) => p.type === "recurring")
    ?? product.plans[0]
  if (!plan) return 0
  return plan.prices.find((p) => p.currencyCode === "GBP")?.price ?? 0
}

/** Return a map of currency code → monthly price from the product's recurring plan. */
export function getPricesMap(product: BillingProduct): Record<string, number> {
  const plan =
    product.plans.find((p) => p.type === "recurring" && p.billingPeriod === 1 && p.billingUnit === "month")
    ?? product.plans.find((p) => p.type === "recurring")
    ?? product.plans[0]
  if (!plan) return {}
  const map: Record<string, number> = {}
  for (const price of plan.prices) {
    map[price.currencyCode] = price.price
  }
  return map
}

/** Map billing stock to the website StockStatus type. */
export function getStockStatus(
  product: BillingProduct,
): "in_stock" | "out_of_stock" | "coming_soon" {
  if (product.stock === 0) return "out_of_stock"
  return "in_stock"
}

/** Build the billing portal order URL for a product. */
export function getBillingUrl(categorySlug: string, productSlug: string): string {
  return `https://billing.nodebyte.host/products/${categorySlug}/${productSlug}`
}
