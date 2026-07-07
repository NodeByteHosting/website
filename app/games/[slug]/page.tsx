import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Blocks, Gamepad2, Sparkles, Leaf, Pickaxe, Wrench } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { getGamePlans } from "@/packages/core/products/billing-service"
import { resolveGameDisplayConfig } from "@/packages/core/products/catalog-config"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { GAME_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

const HEADER_ICON_MAP = { Blocks, Gamepad2, Sparkles, Leaf, Pickaxe, Wrench }

interface PageProps {
  params: Promise<{ slug: string }>
}

async function resolveCategory(slug: string) {
  const hub = await getCategoryHub(GAME_HUB_SLUGS)
  return hub?.children.find((c) => c.slug === slug) ?? null
}

export async function generateStaticParams() {
  const hub = await getCategoryHub(GAME_HUB_SLUGS)
  return (hub?.children ?? []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await resolveCategory(slug)
  if (!category) return {}

  const config = resolveGameDisplayConfig(category)
  return {
    title: `${config.name} Server Hosting`,
    description: config.description,
  }
}

export default async function GameCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await resolveCategory(slug)
  if (!category) notFound()

  const t = await getTranslations()
  const config = resolveGameDisplayConfig(category)
  const rawPlans = await getGamePlans(slug)

  const plans = rawPlans.map((plan) => {
    const display = config.resolvePlanDisplay(plan)
    return {
      name: display.name,
      description: display.description,
      priceGBP: plan.priceGBP,
      prices: plan.prices,
      period: t("pricing.perMonth"),
      popular: plan.popular,
      location: plan.location,
      stock: plan.stock,
      features: display.features,
      url: plan.url,
    }
  })

  const HeaderIcon = HEADER_ICON_MAP[config.iconName]

  return (
    <>
      <GameHero
        name={config.name}
        description={config.description}
        banner={config.banner}
        icon={config.iconName}
        tag={config.tag}
        tagColor={config.tagColor}
        billingUrl={config.billingUrl}
        features={config.heroFeatures}
        comingSoon={plans.length === 0}
      />
      <GamePricing
        gameName={config.name}
        billingUrl={config.billingUrl}
        plans={plans}
        comingSoon={plans.length === 0}
        headerIcon={<HeaderIcon className="w-8 h-8" />}
        headerGradient={config.headerGradient}
        headerIconBg={config.headerIconBg}
      />
      <GameFeatures gameName={config.name} features={config.pageFeatures} />
      <GameFAQ gameName={config.name} faqs={config.faqs} />
    </>
  )
}
