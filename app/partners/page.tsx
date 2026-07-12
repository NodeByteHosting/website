import { PartnersPage } from "@/packages/ui/components/Layouts/Partners"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partners & Sponsors",
  description: "Meet the communities, creators, and projects we partner with, and learn how to join the NodeByte Partnership Program.",
}

export default function Partners() {
  return <PartnersPage />
}
