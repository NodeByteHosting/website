import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { Gamepad2 } from "lucide-react"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rust Server Hosting",
  description: "High-performance Rust server hosting with Oxide/uMod support, custom maps, wipe scheduling, RCON access, and enterprise DDoS protection.",
}

export default async function RustPage() {
  const t = await getTranslations()

  const plans = [
    {
      name: t("games.rust.plans.starter.name"),
      description: t("games.rust.plans.starter.description"),
      priceGBP: 5.75,
      period: t("pricing.perMonth"),
      features: [
        t("games.rust.planFeatures.cpu"),
        t("games.rust.planFeatures.ram", { amount: 8 }),
        t("games.rust.planFeatures.storage", { amount: 150 }),
        t("games.rust.planFeatures.ddos"),
        t("games.rust.planFeatures.location"),
        t("games.rust.planFeatures.databases"),
        t("games.rust.planFeatures.panel"),
        t("games.rust.planFeatures.oxide"),
        t("games.rust.planFeatures.rustplus"),
        t("games.rust.planFeatures.uptime"),
      ],
    },
    {
      name: t("games.rust.plans.standard.name"),
      description: t("games.rust.plans.standard.description"),
      priceGBP: 8.95,
      period: t("pricing.perMonth"),
      popular: true,
      features: [
        t("games.rust.planFeatures.cpu"),
        t("games.rust.planFeatures.ram", { amount: 12 }),
        t("games.rust.planFeatures.storage", { amount: 200 }),
        t("games.rust.planFeatures.ddos"),
        t("games.rust.planFeatures.location"),
        t("games.rust.planFeatures.databases"),
        t("games.rust.planFeatures.panel"),
        t("games.rust.planFeatures.oxide"),
        t("games.rust.planFeatures.rustplus"),
        t("games.rust.planFeatures.uptime"),
      ],
    },
    {
      name: t("games.rust.plans.performance.name"),
      description: t("games.rust.plans.performance.description"),
      priceGBP: 12.75,
      period: t("pricing.perMonth"),
      features: [
        t("games.rust.planFeatures.cpu"),
        t("games.rust.planFeatures.ram", { amount: 16 }),
        t("games.rust.planFeatures.storage", { amount: 250 }),
        t("games.rust.planFeatures.ddos"),
        t("games.rust.planFeatures.location"),
        t("games.rust.planFeatures.databases"),
        t("games.rust.planFeatures.panel"),
        t("games.rust.planFeatures.oxide"),
        t("games.rust.planFeatures.rustplus"),
        t("games.rust.planFeatures.uptime"),
      ],
    },
  ]

  const features = [
    {
      title: t("games.rust.pageFeatures.oxide.title"),
      description: t("games.rust.pageFeatures.oxide.description"),
      icon: "Settings" as const,
      highlights: [
        t("games.rust.pageFeatures.oxide.highlights.0"),
        t("games.rust.pageFeatures.oxide.highlights.1"),
        t("games.rust.pageFeatures.oxide.highlights.2"),
        t("games.rust.pageFeatures.oxide.highlights.3"),
      ],
    },
    {
      title: t("games.rust.pageFeatures.maps.title"),
      description: t("games.rust.pageFeatures.maps.description"),
      icon: "Map" as const,
      highlights: [
        t("games.rust.pageFeatures.maps.highlights.0"),
        t("games.rust.pageFeatures.maps.highlights.1"),
        t("games.rust.pageFeatures.maps.highlights.2"),
        t("games.rust.pageFeatures.maps.highlights.3"),
      ],
    },
    {
      title: t("games.rust.pageFeatures.performance.title"),
      description: t("games.rust.pageFeatures.performance.description"),
      icon: "Cpu" as const,
      highlights: [
        t("games.rust.pageFeatures.performance.highlights.0"),
        t("games.rust.pageFeatures.performance.highlights.1"),
        t("games.rust.pageFeatures.performance.highlights.2"),
        t("games.rust.pageFeatures.performance.highlights.3"),
      ],
    },
    {
      title: t("games.rust.pageFeatures.ddos.title"),
      description: t("games.rust.pageFeatures.ddos.description"),
      icon: "Shield" as const,
      highlights: [
        t("games.rust.pageFeatures.ddos.highlights.0"),
        t("games.rust.pageFeatures.ddos.highlights.1"),
        t("games.rust.pageFeatures.ddos.highlights.2"),
        t("games.rust.pageFeatures.ddos.highlights.3"),
      ],
    },
    {
      title: t("games.rust.pageFeatures.wipe.title"),
      description: t("games.rust.pageFeatures.wipe.description"),
      icon: "Zap" as const,
      highlights: [
        t("games.rust.pageFeatures.wipe.highlights.0"),
        t("games.rust.pageFeatures.wipe.highlights.1"),
        t("games.rust.pageFeatures.wipe.highlights.2"),
        t("games.rust.pageFeatures.wipe.highlights.3"),
      ],
    },
    {
      title: t("games.rust.pageFeatures.rcon.title"),
      description: t("games.rust.pageFeatures.rcon.description"),
      icon: "Server" as const,
      highlights: [
        t("games.rust.pageFeatures.rcon.highlights.0"),
        t("games.rust.pageFeatures.rcon.highlights.1"),
        t("games.rust.pageFeatures.rcon.highlights.2"),
        t("games.rust.pageFeatures.rcon.highlights.3"),
      ],
    },
  ]

  const faqs = [
    {
      question: t("games.rust.faqs.oxide.question"),
      answer: t("games.rust.faqs.oxide.answer"),
    },
    {
      question: t("games.rust.faqs.maps.question"),
      answer: t("games.rust.faqs.maps.answer"),
    },
    {
      question: t("games.rust.faqs.wipe.question"),
      answer: t("games.rust.faqs.wipe.answer"),
    },
    {
      question: t("games.rust.faqs.tickRate.question"),
      answer: t("games.rust.faqs.tickRate.answer"),
    },
    {
      question: t("games.rust.faqs.rcon.question"),
      answer: t("games.rust.faqs.rcon.answer"),
    },
    {
      question: t("games.rust.faqs.modded.question"),
      answer: t("games.rust.faqs.modded.answer"),
    },
  ]

  return (
    <>
      <GameHero
        name="Rust"
        description="High-performance Rust server hosting with Oxide/uMod support, custom maps, wipe scheduling, and enterprise-grade DDoS protection."
        banner="/rust.png"
        icon="Gamepad2"
        tag={t("games.rust.tag")}
        tagColor="bg-accent/10 border border-accent/20 text-accent"
        billingUrl={LINKS.billing.rustHosting}
        features={["Oxide/uMod", "Custom Maps", "Wipe Scheduler", "RCON Access"]}
      />
      <GamePricing
        gameName="Rust"
        billingUrl={LINKS.billing.rustHosting}
        plans={plans}
        headerIcon={<Gamepad2 className="w-8 h-8" />}
        headerGradient="from-accent/20 via-accent/10 to-primary/5"
        headerIconBg="bg-accent/10 text-accent"
      />
      <GameFeatures gameName="Rust" features={features} />
      <GameFAQ gameName="Rust" faqs={faqs} />
    </>
  )
}
