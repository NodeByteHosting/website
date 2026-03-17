import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Blocks } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
const GamePricing = dynamic(() => import("@/packages/ui/components/Layouts/Games/game-pricing").then((m) => ({ default: m.GamePricing })))
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"
import {
  MINECRAFT_PLANS,
  MINECRAFT_PLAN_FEATURE_KEYS,
  MINECRAFT_FEATURE_KEYS,
  MINECRAFT_FAQ_KEYS,
  MINECRAFT_HERO_FEATURES,
  MINECRAFT_CONFIG,
} from "@/packages/core/constants/game"
import { applyGamePlanOverrides } from "@/packages/core/products/server"

export const metadata: Metadata = {
  title: "Minecraft Server Hosting",
  description: "High-performance Minecraft server hosting with instant setup, Java & Bedrock support, one-click Forge & Fabric mod loaders, and enterprise DDoS protection.",
}

export default async function MinecraftPage() {
  const t = await getTranslations()

  const plans = applyGamePlanOverrides("minecraft", MINECRAFT_PLANS).map((plan) => ({
    name: t(`games.minecraft.plans.${plan.id}.name`),
    description: t(`games.minecraft.plans.${plan.id}.description`),
    priceGBP: plan.priceGBP,
    period: t("pricing.perMonth"),
    popular: plan.popular,
    location: plan.location,
    stock: plan.stock,
    features: MINECRAFT_PLAN_FEATURE_KEYS.map((key) => {
      if (key === "ram") return t("games.minecraft.planFeatures.ram", { amount: plan.ramGB })
      if (key === "storage") return t("games.minecraft.planFeatures.storage", { amount: plan.storageGB })
      return t(`games.minecraft.planFeatures.${key}`)
    }),
    url: plan.url,
  }))

  const features = MINECRAFT_FEATURE_KEYS.map(({ key, icon }) => ({
    title: t(`games.minecraft.pageFeatures.${key}.title`),
    description: t(`games.minecraft.pageFeatures.${key}.description`),
    icon,
    highlights: Array.from({ length: 4 }, (_, i) =>
      t(`games.minecraft.pageFeatures.${key}.highlights.${i}`)
    ),
  }))

  const faqs = MINECRAFT_FAQ_KEYS.map((key) => ({
    question: t(`games.minecraft.faqs.${key}.question`),
    answer: t(`games.minecraft.faqs.${key}.answer`),
  }))

  return (
    <>
      <GameHero
        name={MINECRAFT_CONFIG.name}
        description={MINECRAFT_CONFIG.description}
        banner={MINECRAFT_CONFIG.banner}
        icon={MINECRAFT_CONFIG.iconName}
        tag={t("games.minecraft.tag")}
        tagColor={MINECRAFT_CONFIG.tagColor}
        billingUrl={LINKS.billing.minecraftHosting}
        features={[...MINECRAFT_HERO_FEATURES]}
      />
      <GamePricing
        gameName={MINECRAFT_CONFIG.name}
        billingUrl={LINKS.billing.minecraftHosting}
        plans={plans}
        headerIcon={<Blocks className="w-8 h-8" />}
        headerGradient={MINECRAFT_CONFIG.headerGradient}
        headerIconBg={MINECRAFT_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={MINECRAFT_CONFIG.name} features={features} />
      <GameFAQ gameName={MINECRAFT_CONFIG.name} faqs={faqs} />
    </>
  )
}
