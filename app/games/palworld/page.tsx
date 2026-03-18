import type { Metadata } from "next"
import { Leaf } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { LINKS } from "@/packages/core/constants/links"
import {
  PALWORLD_FEATURES,
  PALWORLD_FAQS,
  PALWORLD_HERO_FEATURES,
  PALWORLD_CONFIG,
} from "@/packages/core/constants/game"

export const metadata: Metadata = {
  title: "Palworld Server Hosting",
  description:
    "High-performance Palworld server hosting with custom world configuration, mod support, automatic backups, and enterprise DDoS protection.",
}

export default function PalworldPage() {
  return (
    <>
      <GameHero
        name={PALWORLD_CONFIG.name}
        description={PALWORLD_CONFIG.description}
        banner={PALWORLD_CONFIG.banner}
        icon={PALWORLD_CONFIG.iconName}
        tag={PALWORLD_CONFIG.tag}
        tagColor={PALWORLD_CONFIG.tagColor}
        billingUrl={LINKS.billing.palworldHosting}
        features={[...PALWORLD_HERO_FEATURES]}
        comingSoon
      />
      <GamePricing
        gameName={PALWORLD_CONFIG.name}
        billingUrl={LINKS.billing.palworldHosting}
        plans={[]}
        comingSoon
        headerIcon={<Leaf className="w-8 h-8" />}
        headerGradient={PALWORLD_CONFIG.headerGradient}
        headerIconBg={PALWORLD_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={PALWORLD_CONFIG.name} features={[...PALWORLD_FEATURES]} />
      <GameFAQ gameName={PALWORLD_CONFIG.name} faqs={[...PALWORLD_FAQS]} />
    </>
  )
}
