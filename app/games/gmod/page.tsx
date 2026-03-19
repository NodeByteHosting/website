import type { Metadata } from "next"
import { Wrench } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { LINKS } from "@/packages/core/constants/links"
import {
  GMOD_FEATURES,
  GMOD_FAQS,
  GMOD_HERO_FEATURES,
  GMOD_CONFIG,
} from "@/packages/core/constants/game"

export const metadata: Metadata = {
  title: "Garry's Mod Server Hosting",
  description:
    "High-performance Garry's Mod server hosting with full Steam Workshop support, MySQL integration, DarkRP-ready setup, and enterprise DDoS protection.",
}

export default function GModPage() {
  return (
    <>
      <GameHero
        name={GMOD_CONFIG.name}
        description={GMOD_CONFIG.description}
        banner={GMOD_CONFIG.banner}
        icon={GMOD_CONFIG.iconName}
        tag={GMOD_CONFIG.tag}
        tagColor={GMOD_CONFIG.tagColor}
        billingUrl={LINKS.billing.gmodHosting}
        features={[...GMOD_HERO_FEATURES]}
        comingSoon
      />
      <GamePricing
        gameName={GMOD_CONFIG.name}
        billingUrl={LINKS.billing.gmodHosting}
        plans={[]}
        comingSoon
        headerIcon={<Wrench className="w-8 h-8" />}
        headerGradient={GMOD_CONFIG.headerGradient}
        headerIconBg={GMOD_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={GMOD_CONFIG.name} features={[...GMOD_FEATURES]} />
      <GameFAQ gameName={GMOD_CONFIG.name} faqs={[...GMOD_FAQS]} />
    </>
  )
}
