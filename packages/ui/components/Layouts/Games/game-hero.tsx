"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { ArrowRight, ExternalLink, Star, Blocks, Gamepad2, Sparkles, Leaf, Pickaxe, Wrench } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

const iconMap = {
  Blocks: Blocks,
  Gamepad2: Gamepad2,
  Sparkles: Sparkles,
  Leaf: Leaf,
  Pickaxe: Pickaxe,
  Wrench: Wrench,
}

interface GameHeroProps {
  name: string
  description: string
  banner: string
  icon: keyof typeof iconMap
  tag: string
  tagColor: string
  billingUrl: string
  features: string[]
  comingSoon?: boolean
}

export function GameHero({
  name,
  description,
  banner,
  icon,
  tag,
  tagColor,
  billingUrl,
  features,
  comingSoon,
}: GameHeroProps) {
  const t = useTranslations()
  const Icon = iconMap[icon]

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Banner overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={banner}
          alt={name}
          fill
          className="object-cover opacity-10 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Tag */}
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm",
              tagColor
            )}>
              <Icon className="w-4 h-4" />
              <span>{tag}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {name}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("games.hosting")}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              {description}
            </p>

            {/* Quick Features */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {features.slice(0, 4).map((feature) => (
                <div
                  key={feature}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground"
                >
                  <Star className="w-3 h-3 text-primary" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {comingSoon ? (
                <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                  <Link href={LINKS.discord} target="_blank">
                    {t("gamePage.hero.joinWaitlist")}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                    <Link href={billingUrl} target="_blank">
                      {t("gamePage.hero.viewPlans")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 rounded-full px-8" asChild>
                    <Link href="#features">
                      {t("gamePage.hero.learnMore")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right - Banner Image */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
              <Image
                src={banner}
                alt={name}
                fill
                className="object-cover"
                priority
              />
              {comingSoon && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold">{t("gamePage.hero.comingSoon")}</p>
                    <p className="text-muted-foreground">{t("gamePage.hero.joinDiscordForUpdates")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
