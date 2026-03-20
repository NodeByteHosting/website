import type { Metadata } from "next"
import { VpsHub } from "@/packages/ui/components/Layouts/VPS/vps-hub"
import { ALL_VPS_PLANS } from "@/packages/core/constants/vps"

export const metadata: Metadata = {
  title: "VPS Hosting",
  description:
    "Enterprise KVM virtual servers across AMD and Intel hardware lineups. Full root access, NVMe SSD, DDoS protection, and instant deployment.",
}

export default function VpsPage() {
  return <VpsHub plans={ALL_VPS_PLANS} />
}

