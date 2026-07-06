import { fetchAllBillingProducts } from "@/packages/core/lib/bytepay"

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

  return Response.json({ count: summary.length, products: summary })
}
