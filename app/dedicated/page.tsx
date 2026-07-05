import type { Metadata } from "next"
import { DedicatedHub } from "@/packages/ui/components/Layouts/Dedicated/dedicated-hub"
import { getDedicatedPlans } from "@/packages/core/products/billing-service"

export const metadata: Metadata = {
  title: "Dedicated Servers",
  description:
    "Physical bare-metal servers with fully dedicated CPU cores, enterprise storage, and IPMI out-of-band access. Zero resource contention, maximum performance.",
}

export default async function DedicatedPage() {
  const plans = await getDedicatedPlans("dedicated-servers")
  return <DedicatedHub plans={plans} />
}
