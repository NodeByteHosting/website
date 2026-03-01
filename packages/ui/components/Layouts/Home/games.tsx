"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Gamepad2, Sparkles, ArrowRight, Check, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function Download() {
  const t = useTranslations()

  const games = [
    {
      name: "Minecraft",
      slug: "minecraft",
      description: t("games.minecraft.description"),
      banner: "/minecraft.png",
      tag: t("games.minecraft.tag"),
      tagColor: "bg-primary text-primary-foreground",
      features: [
        t("games.minecraft.features.0"),
        t("games.minecraft.features.1"),
        t("games.minecraft.features.2"),
        t("games.minecraft.features.3"),
      ],
      href: "/games/minecraft",
      cta: t("games.learnMore"),
    },
    {
      name: "Rust",
      slug: "rust",
      description: t("games.rust.description"),
      banner: "/rust.png",
      tag: t("games.rust.tag"),
      tagColor: "bg-accent text-accent-foreground",
      features: [
        t("games.rust.features.0"),
        t("games.rust.features.1"),
        t("games.rust.features.2"),
        t("games.rust.features.3"),
      ],
      href: "/games/rust",
      cta: t("games.learnMore"),
    },
    {
      name: "Hytale",
      slug: "hytale",
      description: t("games.hytale.description"),
      banner: "/hytale.png",
      tag: t("games.hytale.tag"),
      tagColor: "bg-primary text-accent-foreground",
      features: [
        t("games.hytale.features.0"),
        t("games.hytale.features.1"),
        t("games.hytale.features.2"),
        t("games.hytale.features.3"),
      ],
      href: "/games/hytale",
      cta: t("games.learnMore"),
      gradient: "from-violet-500 to-purple-600",
      comingSoon: true,
    },
  ]

  return (
    <section id="download" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Gamepad2 className="w-4 h-4" />
            <span>{t("games.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("games.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("games.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("games.description")}
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {games.map((game, index) => (
            <Card
              key={game.name}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "hover:border-primary/30 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "flex flex-col h-full",
              )}
            >
              {/* Banner/Header */}
              <div className="h-32 relative overflow-hidden">
                {game.banner ? (
                  <Image
                    src={game.banner}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className={cn(
                    "h-full w-full bg-linear-to-br flex items-center justify-center",
                    game.gradient
                  )}>
                    {game.icon && <game.icon className="w-12 h-12 text-white/90" />}
                  </div>
                )}
                
                {/* Tag */}
                <div className={cn(
                  "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium",
                  game.tagColor
                )}>
                  {game.tag}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {game.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {game.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {game.comingSoon ? (
                        <Clock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      ) : (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={cn(
                    "w-full gap-2 rounded-lg mt-auto -mb-6"
                  )}
                  variant="default"
                  asChild
                >
                  <Link href={game.href}>
                    {game.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
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
