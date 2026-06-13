import React from "react"
import { Shield, Zap, Globe, Lock, Eye, Server, ArrowRight, CheckCircle2 } from "lucide-react"
import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Price } from "@/packages/ui/components/ui/price"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

export function Features() {
  const t = useTranslations()

  const features = [
    {
      icon: Shield,
      title: t("features.items.ddos.title"),
      description: t("features.items.ddos.description"),
      highlights: [
        t("features.items.ddos.highlights.0"),
        t("features.items.ddos.highlights.1"),
        t("features.items.ddos.highlights.2"),
      ],
    },
    {
      icon: Zap,
      title: t("features.items.latency.title"),
      description: t("features.items.latency.description"),
      highlights: [
        t("features.items.latency.highlights.0"),
        t("features.items.latency.highlights.1"),
        t("features.items.latency.highlights.2"),
      ],
    },
    {
      icon: Server,
      title: t("features.items.setup.title"),
      description: t("features.items.setup.description"),
      highlights: [
        t("features.items.setup.highlights.0"),
        t("features.items.setup.highlights.1"),
        t("features.items.setup.highlights.2"),
      ],
    },
    {
      icon: Globe,
      title: t("features.items.locations.title"),
      description: t("features.items.locations.description"),
      highlights: [
        t("features.items.locations.highlights.0"),
        t("features.items.locations.highlights.1"),
        t("features.items.locations.highlights.2"),
      ],
    },
    {
      icon: Eye,
      title: t("features.items.panel.title"),
      description: t("features.items.panel.description"),
      highlights: [
        t("features.items.panel.highlights.0"),
        t("features.items.panel.highlights.1"),
        t("features.items.panel.highlights.2"),
      ],
    },
    {
      icon: Lock,
      title: t("features.items.support.title"),
      description: t("features.items.support.description"),
      highlights: [
        t("features.items.support.highlights.0"),
        t("features.items.support.highlights.1"),
        t("features.items.support.highlights.2"),
      ],
    },
  ]

  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />
      <div className="absolute inset-0 text-foreground/[0.01] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
            <Server className="w-4 h-4" />
            <span>{t("features.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("features.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("features.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("features.description")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative p-6 bg-card/30 backdrop-blur-sm border-border/50",
                "hover:border-primary/30 hover:bg-card/50 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5"
              )}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((highlight, i) => (
                  <li key={highlight} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary/60" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="rounded-full px-8 gap-2" asChild>
              <Link href={LINKS.billing.store}>
                {t("features.viewPlans")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("features.startingFrom")} <Price amount={4} className="font-semibold text-foreground" />/{t("pricing.perMonth")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
