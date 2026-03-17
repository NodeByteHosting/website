import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VpsHero } from "@/packages/ui/components/Layouts/VPS/vps-hero"
import { VpsPricing } from "@/packages/ui/components/Layouts/VPS/vps-pricing"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { AMD_PLANS, AMD_FEATURE_KEYS, AMD_FAQ_KEYS, AMD_HERO_FEATURE_COUNT, AMD_SPECS } from "@/packages/core/constants/vps"
import { LINKS } from "@/packages/core/constants/links"

export const metadata: Metadata = {
  title: "AMD VPS Hosting",
  description: "High performance AMD VPS hosting with full root access, DDoS protection, NVMe SSD storage, and 24/7 support.",
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

  return (
    <>
      <VpsHero
        variant="amd"
        tag={t("vps.amd.tag")}
        description={t("vps.amd.heroDescription")}
        heroFeatures={heroFeatures}
        billingUrl={LINKS.billing.amdVps}
        specs={AMD_SPECS}
        outOfStock={AMD_PLANS.length === 0}
      />
      <VpsPricing variant="amd" plans={AMD_PLANS} billingUrl={LINKS.billing.amdVps} />
      <GameFeatures gameName="AMD VPS" features={features} />
      <GameFAQ gameName="AMD VPS" faqs={faqs} />
    </>
  )
}