import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { Sparkles } from "lucide-react"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"
import {
  HYTALE_PLAN_DISPLAY,
  HYTALE_PLAN_STATIC_FEATURES,
  HYTALE_FEATURES,
  HYTALE_FAQS,
  HYTALE_HERO_FEATURES,
  HYTALE_CONFIG,
} from "@/packages/core/constants/game"
import { getGamePlans } from "@/packages/core/products/billing-service"

export const metadata: Metadata = {
  title: "Hytale Server Hosting",
  description: "Be ready when Hytale launches. NodeByte Hosting will offer high-performance Hytale server hosting with mod support, custom maps, DDoS protection, and 24/7 support.",
}

export default async function HytalePage() {
  const t = await getTranslations()

  const plans = (await getGamePlans("hytale")).map((plan) => {
    const display = HYTALE_PLAN_DISPLAY[plan.id as keyof typeof HYTALE_PLAN_DISPLAY]
    return {
      name: display.name,
      description: display.description,
      priceGBP: plan.priceGBP,
      prices: plan.prices,
      period: t("pricing.perMonth"),
      popular: plan.popular,
      url: plan.url,
      stock: plan.stock,
      features: [
        ...HYTALE_PLAN_STATIC_FEATURES,
        `${plan.ramGB}GB DDR4 RAM`,
        `${plan.storageGB}GB SSD Storage`,
      ],
    }
  })

  return (
    <>
      <GameHero
        name={HYTALE_CONFIG.name}
        description={HYTALE_CONFIG.description}
        banner={HYTALE_CONFIG.banner}
        icon={HYTALE_CONFIG.iconName}
        tag={HYTALE_CONFIG.tag}
        tagColor={HYTALE_CONFIG.tagColor}
        billingUrl={LINKS.billing.hytaleHosting}
        features={[...HYTALE_HERO_FEATURES]}
      />
      <GamePricing
        gameName={HYTALE_CONFIG.name}
        billingUrl={LINKS.billing.hytaleHosting}
        plans={plans}
        headerIcon={<Sparkles className="w-8 h-8" />}
        headerGradient={HYTALE_CONFIG.headerGradient}
        headerIconBg={HYTALE_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={HYTALE_CONFIG.name} features={[...HYTALE_FEATURES]} />
      <GameFAQ gameName={HYTALE_CONFIG.name} faqs={[...HYTALE_FAQS]} />
    </>
  )
}

