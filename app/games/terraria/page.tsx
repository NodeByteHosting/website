import type { Metadata } from "next"
import { Pickaxe } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { LINKS } from "@/packages/core/constants/links"
import {
  TERRARIA_FEATURES,
  TERRARIA_FAQS,
  TERRARIA_HERO_FEATURES,
  TERRARIA_CONFIG,
} from "@/packages/core/constants/game"

export const metadata: Metadata = {
  title: "Terraria Server Hosting",
  description:
    "High-performance Terraria server hosting with full tModLoader support, custom world configuration, automatic backups, and enterprise DDoS protection.",
}

export default function TerrariaPage() {
  return (
    <>
      <GameHero
        name={TERRARIA_CONFIG.name}
        description={TERRARIA_CONFIG.description}
        banner={TERRARIA_CONFIG.banner}
        icon={TERRARIA_CONFIG.iconName}
        tag={TERRARIA_CONFIG.tag}
        tagColor={TERRARIA_CONFIG.tagColor}
        billingUrl={LINKS.billing.terrariaHosting}
        features={[...TERRARIA_HERO_FEATURES]}
        comingSoon
      />
      <GamePricing
        gameName={TERRARIA_CONFIG.name}
        billingUrl={LINKS.billing.terrariaHosting}
        plans={[]}
        comingSoon
        headerIcon={<Pickaxe className="w-8 h-8" />}
        headerGradient={TERRARIA_CONFIG.headerGradient}
        headerIconBg={TERRARIA_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={TERRARIA_CONFIG.name} features={[...TERRARIA_FEATURES]} />
      <GameFAQ gameName={TERRARIA_CONFIG.name} faqs={[...TERRARIA_FAQS]} />
    </>
  )
}
