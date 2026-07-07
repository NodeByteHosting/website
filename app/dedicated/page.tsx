import type { Metadata } from "next"
import { DedicatedHub } from "@/packages/ui/components/Layouts/Dedicated/dedicated-hub"
import { getDedicatedPlans } from "@/packages/core/products/billing-service"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { DEDICATED_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

export const metadata: Metadata = {
  title: "Dedicated Servers",
  description:
    "Physical bare-metal servers with fully dedicated CPU cores, enterprise storage, and IPMI out-of-band access. Zero resource contention, maximum performance.",
}

export default async function DedicatedPage() {
  const hub = await getCategoryHub(DEDICATED_HUB_SLUGS)
  const children = hub?.children ?? []

  const plansByCategory = await Promise.all(children.map((c) => getDedicatedPlans(c.slug)))
  const plans = plansByCategory.flat()

  return <DedicatedHub plans={plans} />
}
