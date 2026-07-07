import type { Metadata } from "next"
import { VpsHub } from "@/packages/ui/components/Layouts/VPS/vps-hub"
import { getVpsPlans } from "@/packages/core/products/billing-service"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { VPS_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

export const metadata: Metadata = {
  title: "VPS Hosting",
  description:
    "Enterprise KVM virtual servers across AMD and Intel hardware lineups. Full root access, NVMe SSD, DDoS protection, and instant deployment.",
}

export default async function VpsPage() {
  const hub = await getCategoryHub(VPS_HUB_SLUGS)
  const children = hub?.children ?? []

  const plansByCategory = await Promise.all(children.map((c) => getVpsPlans(c.slug)))
  const plans = plansByCategory.flat()

  return <VpsHub plans={plans} />
}
