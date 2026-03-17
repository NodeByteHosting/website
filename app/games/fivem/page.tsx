import type { Metadata } from "next"
import { Radio } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { LINKS } from "@/packages/core/constants/links"
import {
  FIVEM_FEATURES,
  FIVEM_FAQS,
  FIVEM_HERO_FEATURES,
  FIVEM_CONFIG,
} from "@/packages/core/constants/game"

export const metadata: Metadata = {
  title: "FiveM Server Hosting",
  description:
    "High-performance FiveM server hosting with full script and resource support, txAdmin panel, OneSync Infinity, and enterprise DDoS protection.",
}

export default function FiveMPage() {
  return (
    <>
      <GameHero
        name={FIVEM_CONFIG.name}
        description={FIVEM_CONFIG.description}
        banner={FIVEM_CONFIG.banner}
        icon={FIVEM_CONFIG.iconName}
        tag={FIVEM_CONFIG.tag}
        tagColor={FIVEM_CONFIG.tagColor}
        billingUrl={LINKS.billing.fivemHosting}
        features={[...FIVEM_HERO_FEATURES]}
        comingSoon
      />
      <GamePricing
        gameName={FIVEM_CONFIG.name}
        billingUrl={LINKS.billing.fivemHosting}
        plans={[]}
        comingSoon
        headerIcon={<Radio className="w-8 h-8" />}
        headerGradient={FIVEM_CONFIG.headerGradient}
        headerIconBg={FIVEM_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={FIVEM_CONFIG.name} features={[...FIVEM_FEATURES]} />
      <GameFAQ gameName={FIVEM_CONFIG.name} faqs={[...FIVEM_FAQS]} />
    </>
  )
}
