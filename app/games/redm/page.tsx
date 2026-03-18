import type { Metadata } from "next"
import { Mountain } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { LINKS } from "@/packages/core/constants/links"
import {
  REDM_FEATURES,
  REDM_FAQS,
  REDM_HERO_FEATURES,
  REDM_CONFIG,
} from "@/packages/core/constants/game"

export const metadata: Metadata = {
  title: "RedM Server Hosting",
  description:
    "High-performance RedM server hosting for Red Dead Redemption 2 roleplay communities. Full VORP/RedEM:R framework support, custom map streaming, and enterprise DDoS protection.",
}

export default function RedMPage() {
  return (
    <>
      <GameHero
        name={REDM_CONFIG.name}
        description={REDM_CONFIG.description}
        banner={REDM_CONFIG.banner}
        icon={REDM_CONFIG.iconName}
        tag={REDM_CONFIG.tag}
        tagColor={REDM_CONFIG.tagColor}
        billingUrl={LINKS.billing.redmHosting}
        features={[...REDM_HERO_FEATURES]}
        comingSoon
      />
      <GamePricing
        gameName={REDM_CONFIG.name}
        billingUrl={LINKS.billing.redmHosting}
        plans={[]}
        comingSoon
        headerIcon={<Mountain className="w-8 h-8" />}
        headerGradient={REDM_CONFIG.headerGradient}
        headerIconBg={REDM_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={REDM_CONFIG.name} features={[...REDM_FEATURES]} />
      <GameFAQ gameName={REDM_CONFIG.name} faqs={[...REDM_FAQS]} />
    </>
  )
}
