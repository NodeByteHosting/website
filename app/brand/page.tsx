import { BrandPage } from "@/packages/ui/components/Layouts/Brand/brand-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brand & Press Kit",
  description: "Logo files, color palettes, and usage guidelines for partners, press, and anyone writing about NodeByte Hosting.",
}

export default function Brand() {
  return <BrandPage />
}
