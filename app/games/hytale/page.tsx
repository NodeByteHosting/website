import { GameHero } from "@/packages/ui/components/Layouts/Games/game-hero"
import { GameFeatures } from "@/packages/ui/components/Layouts/Games/game-features"
import { GamePricing } from "@/packages/ui/components/Layouts/Games/game-pricing"
import { GameFAQ } from "@/packages/ui/components/Layouts/Games/game-faq"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hytale Server Hosting",
  description: "Be ready for Hytale launch with NodeByte Hosting. Join our waitlist for early access to our Hytale server hosting platform.",
}

const features = [
  {
    title: "Day One Support",
    description: "We're preparing our infrastructure to support Hytale from day one of release.",
    icon: "Zap" as const,
    highlights: [
      "Launch-day availability",
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
      "Version control",
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
    description: "Your server will be protected by FyfeWeb's enterprise-grade DDoS mitigation from day one.",
    icon: "Shield" as const,
    highlights: [
      "Always-on protection",
      "FyfeWeb network filtering",
      "Zero downtime",
      "UK London POPs",
    ],
  },
  {
    title: "UK Data Centers",
    description: "Servers hosted in UK data centers with London POPs for excellent latency across the UK and Europe.",
    icon: "Globe" as const,
    highlights: [
      "London POPs",
      "Low latency routing",
      "FyfeWeb network",
      "UK coverage",
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
    question: "When will Hytale hosting be available?",
    answer: "We'll launch our Hytale hosting service as soon as the game releases. Join our Discord to be notified when we go live!",
  },
  {
    question: "Can I join a waitlist?",
    answer: "Yes! Join our Discord server to be added to the waitlist. You'll get early access and special launch pricing.",
  },
  {
    question: "What features will be supported?",
    answer: "We plan to support all Hytale server features including mods, custom worlds, and multiplayer. Specific features will be confirmed closer to launch.",
  },
  {
    question: "Will there be mod support?",
    answer: "Yes, we'll support Hytale's modding capabilities. You'll be able to install and manage mods through our control panel.",
  },
  {
    question: "What regions will be available?",
    answer: "We offer Hytale hosting from our UK data centers with London POPs powered by FyfeWeb, providing excellent coverage across the UK and Europe.",
  },
  {
    question: "How can I stay updated?",
    answer: "Join our Discord server for the latest updates on our Hytale hosting plans. We'll announce pricing and features as we get closer to launch.",
  },
]

export default function HytalePage() {
  return (
    <>
      <GameHero
        name="Hytale"
        description="Be ready for Hytale launch with NodeByte Hosting. We're preparing enterprise grade infrastructure for the best Hytale server experience."
        banner="/hytale.png"
        icon="Sparkles"
        tag="Coming Soon"
        tagColor="bg-muted border border-border text-muted-foreground"
        billingUrl="https://discord.gg/wN58bTzzpW"
        features={["Mod Support", "Custom Maps", "DDoS Protection", "24/7 Support"]}
        comingSoon
      />
      <GameFeatures gameName="Hytale" features={features} />
      <GamePricing
        gameName="Hytale"
        billingUrl="https://discord.gg/wN58bTzzpW"
        plans={[]}
        comingSoon
      />
      <GameFAQ gameName="Hytale" faqs={faqs} />
    </>
  )
}
