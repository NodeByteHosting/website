import type { Metadata } from "next"
import { VpsHub } from "@/packages/ui/components/Layouts/VPS/vps-hub"
import { getVpsPlans } from "@/packages/core/products/billing-service"

export const metadata: Metadata = {
  title: "VPS Hosting",
  description:
    "Enterprise KVM virtual servers across AMD and Intel hardware lineups. Full root access, NVMe SSD, DDoS protection, and instant deployment.",
}

export default async function VpsPage() {
  const [sharedPlans, dedicatedPlans] = await Promise.all([
    getVpsPlans("shared-cpu"),
    getVpsPlans("dedicated-cpu"),
  ])
  return <VpsHub plans={[...sharedPlans, ...dedicatedPlans]} />
}

