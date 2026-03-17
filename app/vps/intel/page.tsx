import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VpsHero } from "@/packages/ui/components/Layouts/VPS/vps-hero"
import { VpsPricing } from "@/packages/ui/components/Layouts/VPS/vps-pricing"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { INTEL_PLANS, INTEL_FEATURE_KEYS, INTEL_FAQ_KEYS, INTEL_HERO_FEATURE_COUNT, INTEL_SPECS } from "@/packages/core/constants/vps"
import { LINKS } from "@/packages/core/constants/links"

export const metadata: Metadata = {
  title: "Intel VPS Hosting",
  description: "Enterprise Intel KVM VPS with full root access, NVMe SSD storage, DDR4 ECC RAM, enterprise DDoS protection, and instant deployment.",
}

export default async function IntelVpsPage() {
  const t = await getTranslations()

  const features = INTEL_FEATURE_KEYS.map(({ key, icon }) => ({
    title: t(`vps.intel.pageFeatures.${key}.title`),
    description: t(`vps.intel.pageFeatures.${key}.description`),
    icon,
    highlights: Array.from({ length: 4 }, (_, i) => t(`vps.intel.pageFeatures.${key}.highlights.${i}`)),
  }))

  const faqs = INTEL_FAQ_KEYS.map((key) => ({
    question: t(`vps.intel.faqs.${key}.question`),
    answer: t(`vps.intel.faqs.${key}.answer`),
  }))

  const heroFeatures = Array.from({ length: INTEL_HERO_FEATURE_COUNT }, (_, i) => t(`vps.intel.heroFeatures.${i}`))

  return (
    <>
      <VpsHero
        variant="intel"
        tag={t("vps.intel.tag")}
        description={t("vps.intel.heroDescription")}
        heroFeatures={heroFeatures}
        billingUrl={LINKS.billing.intelVps}
        specs={INTEL_SPECS}
        outOfStock={INTEL_PLANS.length === 0}
      />
      <VpsPricing variant="intel" plans={INTEL_PLANS} billingUrl={LINKS.billing.intelVps} />
      <GameFeatures gameName="Intel VPS" features={features} />
      <GameFAQ gameName="Intel VPS" faqs={faqs} />
    </>
  )
}