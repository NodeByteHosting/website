import type { Metadata } from "next"
import { Blocks } from "lucide-react"
import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"

export const metadata: Metadata = {
  title: "Minecraft Server Hosting",
  description: "High-performance Minecraft server hosting with instant setup, Java & Bedrock support, one-click Forge & Fabric mod loaders, and enterprise DDoS protection.",
}

export default async function MinecraftPage() {
  const t = await getTranslations()

  const plans = [
    {
      name: t("games.minecraft.plans.ember.name"),
      description: t("games.minecraft.plans.ember.description"),
      priceGBP: 4,
      period: t("pricing.perMonth"),
      features: [
        t("games.minecraft.planFeatures.cpu"),
        t("games.minecraft.planFeatures.ram", { amount: 4 }),
        t("games.minecraft.planFeatures.storage", { amount: 40 }),
        t("games.minecraft.planFeatures.databases"),
        t("games.minecraft.planFeatures.ddos"),
        t("games.minecraft.planFeatures.panel"),
        t("games.minecraft.planFeatures.jars"),
        t("games.minecraft.planFeatures.uptime"),
      ],
      url: "https://billing.nodebyte.host/store/minecraft-server-hosting/ember"
    },
    {
      name: t("games.minecraft.plans.blaze.name"),
      description: t("games.minecraft.plans.blaze.description"),
      priceGBP: 6,
      period: t("pricing.perMonth"),
      features: [
        t("games.minecraft.planFeatures.cpu"),
        t("games.minecraft.planFeatures.ram", { amount: 6 }),
        t("games.minecraft.planFeatures.storage", { amount: 60 }),
        t("games.minecraft.planFeatures.databases"),
        t("games.minecraft.planFeatures.ddos"),
        t("games.minecraft.planFeatures.panel"),
        t("games.minecraft.planFeatures.jars"),
        t("games.minecraft.planFeatures.uptime"),
      ],
      url: "https://billing.nodebyte.host/store/minecraft-server-hosting/blaze"
    },
    {
      name: t("games.minecraft.plans.inferno.name"),
      description: t("games.minecraft.plans.inferno.description"),
      priceGBP: 7.5,
      period: t("pricing.perMonth"),
      popular: true,
      features: [
        t("games.minecraft.planFeatures.cpu"),
        t("games.minecraft.planFeatures.ram", { amount: 8 }),
        t("games.minecraft.planFeatures.storage", { amount: 80 }),
        t("games.minecraft.planFeatures.databases"),
        t("games.minecraft.planFeatures.ddos"),
        t("games.minecraft.planFeatures.panel"),
        t("games.minecraft.planFeatures.jars"),
        t("games.minecraft.planFeatures.uptime"),
      ],
      url: "https://billing.nodebyte.host/store/minecraft-server-hosting/inferno"
    },
  ]

  const features = [
    {
      title: t("games.minecraft.pageFeatures.modLoaders.title"),
      description: t("games.minecraft.pageFeatures.modLoaders.description"),
      icon: "Settings" as const,
      highlights: [
        t("games.minecraft.pageFeatures.modLoaders.highlights.0"),
        t("games.minecraft.pageFeatures.modLoaders.highlights.1"),
        t("games.minecraft.pageFeatures.modLoaders.highlights.2"),
        t("games.minecraft.pageFeatures.modLoaders.highlights.3"),
      ],
    },
    {
      title: t("games.minecraft.pageFeatures.hardware.title"),
      description: t("games.minecraft.pageFeatures.hardware.description"),
      icon: "Cpu" as const,
      highlights: [
        t("games.minecraft.pageFeatures.hardware.highlights.0"),
        t("games.minecraft.pageFeatures.hardware.highlights.1"),
        t("games.minecraft.pageFeatures.hardware.highlights.2"),
        t("games.minecraft.pageFeatures.hardware.highlights.3"),
      ],
    },
    {
      title: t("games.minecraft.pageFeatures.ddos.title"),
      description: t("games.minecraft.pageFeatures.ddos.description"),
      icon: "Shield" as const,
      highlights: [
        t("games.minecraft.pageFeatures.ddos.highlights.0"),
        t("games.minecraft.pageFeatures.ddos.highlights.1"),
        t("games.minecraft.pageFeatures.ddos.highlights.2"),
        t("games.minecraft.pageFeatures.ddos.highlights.3"),
      ],
    },
    {
      title: t("games.minecraft.pageFeatures.instant.title"),
      description: t("games.minecraft.pageFeatures.instant.description"),
      icon: "Zap" as const,
      highlights: [
        t("games.minecraft.pageFeatures.instant.highlights.0"),
        t("games.minecraft.pageFeatures.instant.highlights.1"),
        t("games.minecraft.pageFeatures.instant.highlights.2"),
        t("games.minecraft.pageFeatures.instant.highlights.3"),
      ],
    },
    {
      title: t("games.minecraft.pageFeatures.ftp.title"),
      description: t("games.minecraft.pageFeatures.ftp.description"),
      icon: "HardDrive" as const,
      highlights: [
        t("games.minecraft.pageFeatures.ftp.highlights.0"),
        t("games.minecraft.pageFeatures.ftp.highlights.1"),
        t("games.minecraft.pageFeatures.ftp.highlights.2"),
        t("games.minecraft.pageFeatures.ftp.highlights.3"),
      ],
    },
    {
      title: t("games.minecraft.pageFeatures.slots.title"),
      description: t("games.minecraft.pageFeatures.slots.description"),
      icon: "Users" as const,
      highlights: [
        t("games.minecraft.pageFeatures.slots.highlights.0"),
        t("games.minecraft.pageFeatures.slots.highlights.1"),
        t("games.minecraft.pageFeatures.slots.highlights.2"),
        t("games.minecraft.pageFeatures.slots.highlights.3"),
      ],
    },
  ]

  const faqs = [
    {
      question: t("games.minecraft.faqs.versions.question"),
      answer: t("games.minecraft.faqs.versions.answer"),
    },
    {
      question: t("games.minecraft.faqs.mods.question"),
      answer: t("games.minecraft.faqs.mods.answer"),
    },
    {
      question: t("games.minecraft.faqs.upload.question"),
      answer: t("games.minecraft.faqs.upload.answer"),
    },
    {
      question: t("games.minecraft.faqs.playerLimit.question"),
      answer: t("games.minecraft.faqs.playerLimit.answer"),
    },
    {
      question: t("games.minecraft.faqs.upgrade.question"),
      answer: t("games.minecraft.faqs.upgrade.answer"),
    },
    {
      question: t("games.minecraft.faqs.refunds.question"),
      answer: t("games.minecraft.faqs.refunds.answer"),
    },
  ]

  return (
    <>
      <GameHero
        name="Minecraft"
        description="High performance Minecraft server hosting with instant setup, one click mod loaders, and enterprise grade DDoS protection. Java & Bedrock support."
        banner="/minecraft.png"
        icon="Blocks"
        tag={t("games.minecraft.tag")}
        tagColor="bg-primary/10 border border-primary/20 text-primary"
        billingUrl={LINKS.billing.minecraftHosting}
        features={["Forge & Fabric", "Unlimited Players", "DDoS Protection", "24/7 Support"]}
      />
      <GamePricing
        gameName="Minecraft"
        billingUrl={LINKS.billing.minecraftHosting}
        plans={plans}
        headerIcon={<Blocks className="w-8 h-8" />}
        headerGradient="from-primary/20 via-primary/10 to-accent/5"
        headerIconBg="bg-primary/10 text-primary"
      />
      <GameFeatures gameName="Minecraft" features={features} />
      <GameFAQ gameName="Minecraft" faqs={faqs} />
    </>
  )
}
