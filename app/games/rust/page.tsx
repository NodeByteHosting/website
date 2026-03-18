import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { Gamepad2 } from "lucide-react"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
const GamePricing = dynamic(() => import("@/packages/ui/components/Layouts/Games/game-pricing").then((m) => ({ default: m.GamePricing })))
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"
import {
  RUST_PLANS,
  RUST_PLAN_FEATURE_KEYS,
  RUST_FEATURE_KEYS,
  RUST_FAQ_KEYS,
  RUST_HERO_FEATURES,
  RUST_CONFIG,
} from "@/packages/core/constants/game"
import { applyGamePlanOverrides } from "@/packages/core/products/server"

export const metadata: Metadata = {
  title: "Rust Server Hosting",
  description: "High-performance Rust server hosting with Oxide/uMod support, custom maps, wipe scheduling, RCON access, and enterprise DDoS protection.",
}

export default async function RustPage() {
  const t = await getTranslations()

  const plans = applyGamePlanOverrides("rust", RUST_PLANS).map((plan) => ({
    name: t(`games.rust.plans.${plan.id}.name`),
    description: t(`games.rust.plans.${plan.id}.description`),
    priceGBP: plan.priceGBP,
    period: t("pricing.perMonth"),
    popular: plan.popular,
    location: plan.location,
    stock: plan.stock,
    features: RUST_PLAN_FEATURE_KEYS.map((key) => {
      if (key === "ram") return t("games.rust.planFeatures.ram", { amount: plan.ramGB })
      if (key === "storage") return t("games.rust.planFeatures.storage", { amount: plan.storageGB })
      return t(`games.rust.planFeatures.${key}`)
    }),
    url: plan.url,
  }))

  const features = RUST_FEATURE_KEYS.map(({ key, icon }) => ({
    title: t(`games.rust.pageFeatures.${key}.title`),
    description: t(`games.rust.pageFeatures.${key}.description`),
    icon,
    highlights: Array.from({ length: 4 }, (_, i) =>
      t(`games.rust.pageFeatures.${key}.highlights.${i}`)
    ),
  }))

  const faqs = RUST_FAQ_KEYS.map((key) => ({
    question: t(`games.rust.faqs.${key}.question`),
    answer: t(`games.rust.faqs.${key}.answer`),
  }))

  return (
    <>
      <GameHero
        name={RUST_CONFIG.name}
        description={RUST_CONFIG.description}
        banner={RUST_CONFIG.banner}
        icon={RUST_CONFIG.iconName}
        tag={t("games.rust.tag")}
        tagColor={RUST_CONFIG.tagColor}
        billingUrl={LINKS.billing.rustHosting}
        features={[...RUST_HERO_FEATURES]}
      />
      <GamePricing
        gameName={RUST_CONFIG.name}
        billingUrl={LINKS.billing.rustHosting}
        plans={plans}
        headerIcon={<Gamepad2 className="w-8 h-8" />}
        headerGradient={RUST_CONFIG.headerGradient}
        headerIconBg={RUST_CONFIG.headerIconBg}
      />
      <GameFeatures gameName={RUST_CONFIG.name} features={features} />
      <GameFAQ gameName={RUST_CONFIG.name} faqs={faqs} />
    </>
  )
}

