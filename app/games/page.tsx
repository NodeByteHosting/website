import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { GamePrice } from "@/packages/ui/components/ui/game-price"
import { Gamepad2, ArrowRight, Check, Blocks, Sparkles, Leaf, Pickaxe, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { GAME_OPTIONS } from "@/packages/core/constants/game"

const ICON_MAP: Record<string, LucideIcon> = { Blocks, Gamepad2, Sparkles, Leaf, Pickaxe, Wrench }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: `${t("gamesPage.title")}`,
    description: t("gamesPage.description"),
  }
}

export default async function GamesPage() {
  const t = await getTranslations()

  const games = GAME_OPTIONS.map((g) => ({
    ...g,
    comingSoon: g.comingSoon ?? false,
    icon: ICON_MAP[g.iconName],
    description: t(`games.${g.slug}.description`),
    tag: t(`games.${g.slug}.tag`),
    features: [
      t(`games.${g.slug}.features.0`),
      t(`games.${g.slug}.features.1`),
      t(`games.${g.slug}.features.2`),
      t(`games.${g.slug}.features.3`),
    ],
  }))

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-24 sm:pb-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Gamepad2 className="w-4 h-4" />
            <span>{t("games.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("games.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("games.titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("games.description")}
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <Card
              key={game.name}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "hover:border-primary/30 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "flex flex-col h-full"
              )}
            >
              {/* Banner */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={game.banner}
                  alt={game.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card to-transparent" />
                
                {/* Tag */}
                <div className={cn(
                  "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium",
                  game.tagColor
                )}>
                  {game.tag}
                </div>

                {/* Icon */}
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <game.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Title & Price */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold">{game.name}</h2>
                  {game.comingSoon ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50">
                      Coming Soon
                    </span>
                  ) : game.startingPriceGBP ? (
                    <GamePrice
                      amountGBP={game.startingPriceGBP}
                      label={t("gamesPage.startingAt")}
                    />
                  ) : null}
                </div>

                <p className="text-muted-foreground mb-4">{game.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {game.features.map((feature, i) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className="w-full gap-2 rounded-lg mt-auto"
                  variant="default"
                  asChild
                >
                  <Link href={`/games/${game.slug}`}>
                    {t("games.learnMore")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            {t("games.customSolution")}{" "}
            <Link href="/contact" className="text-primary hover:underline">
              {t("games.contactUs")}
            </Link>{" "}
            {t("games.forCustom")}
          </p>
        </div>
      </div>
    </section>
  )
}
