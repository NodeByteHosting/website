import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { Sparkles } from "lucide-react"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LINKS } from "@/packages/core/constants/links"

export const metadata: Metadata = {
  title: "Hytale Server Hosting",
  description: "Be ready when Hytale launches. NodeByte Hosting will offer high-performance Hytale server hosting with mod support, custom maps, DDoS protection, and 24/7 support.",
}

export default async function HytalePage() {
  const t = await getTranslations()

  const features = [
    {
      title: "Instant Setup",
      description: "One purchased, the server will install instantly and will install a performance plugin for optimal performance.",
      icon: "Zap" as const,
      highlights: [
        "Fast Install",
        "Optimized configurations",
        "Pre-built templates",
        "Quick deployment",
      ],
    },
    {
      title: "Mod Support",
      description: "Full support for Hytale's modding capabilities. Create and host your custom experiences.",
      icon: "Settings" as const,
      highlights: [
        "Custom mod support",
        "Easy mod management",
        "Auto-updates",
      ],
    },
    {
      title: "High Performance",
      description: "Enterprise grade hardware ready to deliver smooth gameplay for your Hytale community.",
      icon: "Cpu" as const,
      highlights: [
        "Latest gen CPUs",
        "NVMe SSD storage",
        "High-speed networking",
        "Low latency",
      ],
    },
    {
      title: "DDoS Protection",
      description: "Your server will be protected by enterprise-grade DDoS mitigation from day one.",
      icon: "Shield" as const,
      highlights: [
        "Always-on protection",
        "Automated network filtering",
        "Zero downtime",
        "Global POPs",
      ],
    },
    {
      title: "Data Centers",
      description: "Servers hosted in strategically located data centers for excellent latency wherever your players are.",
      icon: "Globe" as const,
      highlights: [
        "Multiple locations",
        "Low latency routing",
        "Premium network",
        "Global coverage",
      ],
    },
    {
      title: "24/7 Support",
      description: "Our expert support team will be ready to help you with any Hytale hosting questions.",
      icon: "Server" as const,
      highlights: [
        "24/7 availability",
        "Game experts",
        "Fast response times",
        "Discord support",
      ],
    },
  ]

  const faqs = [
    {
      question: "What features are supported?",
      answer: "We support all Hytale server features including mods, custom worlds, and multiplayer.",
    },
    {
      question: "Is there be mod support?",
      answer: "Yes, we support Hytale's modding capabilities.",
    },
    {
      question: "What regions will be available?",
      answer: "We'll offer Hytale hosting across multiple data center locations for low latency and great coverage wherever your players are.",
    },
  ]

  const plans = [
      {
        name: "Starter",
        description: "Perfect for small communities and testing.",
        priceGBP: 5.00,
        period: t("pricing.perMonth"),
        features: [
          "AMD Ryzen™ 9 5900X",
          "4GB RAM",
          "40GB SSD Storage",
          "10 Database",
          "DDoS Protection",
          "BytePanel",
          "99.9% Uptime SLA",
        ],
        url: "https://billing.nodebyte.host/store/hytale-hosting/starter"
      },
      {
        name: "Standard",
        description: "Perfect for growing communities and performance.",
        priceGBP: 7.50,
        period: t("pricing.perMonth"),
        features: [
          "AMD Ryzen™ 9 5900X",
          "6GB RAM",
          "60GB SSD Storage",
          "10 Database",
          "DDoS Protection",
          "BytePanel",
          "99.9% Uptime SLA",
        ],
        url: "https://billing.nodebyte.host/store/hytale-hosting/standard"
      },
      {
        name: "Performance",
        description: "Perfect for large communities and high performance.",
        priceGBP: 10.00,
        period: t("pricing.perMonth"),
        popular: true,
        features: [
          "AMD Ryzen™ 9 5900X",
          "8GB RAM",
          "80GB SSD Storage",
          "10 Database",
          "DDoS Protection",
          "BytePanel",
          "99.9% Uptime SLA",
        ],
        url: "https://billing.nodebyte.host/store/hytale-hosting/performance"
      },
    ]

  return (
    <>
      <GameHero
        name="Hytale"
        description="Set out on an adventure built for both creation and play. Hytale blends the freedom of a sandbox with the momentum of an RPG: explore a procedurally generated world full of dungeons, secrets, and a variety of creatures, then shape it block by block."
        banner="/hytale.png"
        icon="Sparkles"
        tag="Early Access Game"
        tagColor="bg-amber-500/15 text-amber-400 border border-amber-500/20"
        billingUrl={LINKS.billing.hytaleHosting}
        features={["Mod Support", "Custom Maps", "DDoS Protection", "24/7 Support"]}
      />
      <GamePricing
        gameName="Hytale"
        billingUrl={LINKS.billing.hytaleHosting}
        plans={plans}
        headerIcon={<Sparkles className="w-8 h-8" />}
        headerGradient="from-amber-500/20 via-amber-500/10 to-primary/5"
        headerIconBg="bg-amber-500/10 text-amber-400"
      />
      <GameFeatures gameName="Hytale" features={features} />
      <GameFAQ gameName="Hytale" faqs={faqs} />
    </>
  )
}