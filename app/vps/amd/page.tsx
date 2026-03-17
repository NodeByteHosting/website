import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getTranslations } from "next-intl/server"
import { VpsHero } from "@/packages/ui/components/Layouts/VPS/vps-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { AMD_PLANS, AMD_FEATURE_KEYS, AMD_FAQ_KEYS, AMD_HERO_FEATURE_COUNT, AMD_SPECS } from "@/packages/core/constants/vps"
import { isCategoryOutOfStock } from "@/packages/core/products"
import { applyVpsPlanOverrides } from "@/packages/core/products/server"
import { LINKS } from "@/packages/core/constants/links"

const VpsPricing = dynamic(() => import("@/packages/ui/components/Layouts/VPS/vps-pricing").then((m) => ({ default: m.VpsPricing })))

export const metadata: Metadata = {
  title: "AMD VPS Hosting",
  description: "Enterprise AMD KVM VPS with full root access, NVMe SSD storage, DDR4 ECC RAM, enterprise DDoS protection, and instant deployment. Starting from £5/mo.",
}

export default async function AmdVpsPage() {
  const t = await getTranslations()

  const features = AMD_FEATURE_KEYS.map(({ key, icon }) => ({
    title: t(`vps.amd.pageFeatures.${key}.title`),
    description: t(`vps.amd.pageFeatures.${key}.description`),
    icon,
    highlights: Array.from({ length: 4 }, (_, i) => t(`vps.amd.pageFeatures.${key}.highlights.${i}`)),
  }))

  const faqs = AMD_FAQ_KEYS.map((key) => ({
    question: t(`vps.amd.faqs.${key}.question`),
    answer: t(`vps.amd.faqs.${key}.answer`),
  }))

  const heroFeatures = Array.from({ length: AMD_HERO_FEATURE_COUNT }, (_, i) => t(`vps.amd.heroFeatures.${i}`))

  const amdPlans = applyVpsPlanOverrides("amd", AMD_PLANS)

  return (
    <>
      <VpsHero
        variant="amd"
        tag={t("vps.amd.tag")}
        description={t("vps.amd.heroDescription")}
        heroFeatures={heroFeatures}
        billingUrl={LINKS.billing.amdVps}
        specs={AMD_SPECS}
        outOfStock={amdPlans.length === 0 || amdPlans.every((p) => p.stock === "out_of_stock")}
      />
      <VpsPricing variant="amd" plans={amdPlans} billingUrl={LINKS.billing.amdVps} />
      <GameFeatures gameName="AMD VPS" features={features} />
      <GameFAQ gameName="AMD VPS" faqs={faqs} />
    </>
  )
}