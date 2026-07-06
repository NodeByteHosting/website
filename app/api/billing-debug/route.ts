import { fetchAllBillingProducts } from "@/packages/core/lib/bytepay"
import { parseDescriptionSpecs } from "@/packages/core/lib/spec-parser"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available in production" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const products = await fetchAllBillingProducts()
  const filtered = category ? products.filter((p) => p.categorySlug === category) : products

  const summary = filtered.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categorySlug: p.categorySlug,
    hidden: p.hidden,
    stock: p.stock,
    gbpMonthly:
      p.plans
        .find((pl) => pl.type === "recurring" && pl.billingPeriod === 1 && pl.billingUnit === "month")
        ?.prices.find((pr) => pr.currencyCode === "GBP")?.price ?? null,
    description: p.description,
  }))

  // Live products whose description fails to parse cpu/ramGB/storageGB — a
  // subset (or all) of these fields are required by getGamePlans/getVpsPlans/
  // getDedicatedPlans, so a missing one here means the product silently
  // disappears from its billing page.
  const dropped = filtered.flatMap((p) => {
    const parsed = parseDescriptionSpecs(p.description)
    const missing = [
      !parsed.cpu && "cpu",
      !parsed.ramGB && "ramGB",
      !parsed.storageGB && "storageGB",
    ].filter((v): v is string => Boolean(v))
    if (missing.length === 0) return []
    return [{ id: p.id, name: p.name, slug: p.slug, categorySlug: p.categorySlug, missing }]
  })

  return Response.json({ count: summary.length, products: summary, dropped })
}
