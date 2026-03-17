"use client"

import type React from "react"
import { Card } from "@/packages/ui/components/ui/card"
import { Heart, Code, Gamepad2, Server, Sparkles, ArrowRight, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

export function About() {
  const t = useTranslations()

  const stats = [
    { value: "9+", label: t("about.stats.locations"), icon: Globe },
    { value: "Always on", label: t("about.stats.ddos"), icon: Shield },
    { value: "~1 Gbps", label: t("about.stats.network"), icon: Zap },
    { value: "99.9%", label: t("about.stats.uptime"), icon: Server },
  ]

  const values = [
    {
      icon: Gamepad2,
      title: t("about.values.players.title"),
      description: t("about.values.players.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code,
      title: t("about.values.community.title"),
      description: t("about.values.community.description"),
      gradient: "from-orange-500 to-rose-500",
    },
    {
      icon: Sparkles,
      title: t("about.values.open.title"),
      description: t("about.values.open.description"),
      gradient: "from-violet-500 to-blue-500",
    },
  ]

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-accent/2 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
              <Heart className="w-4 h-4" />
              <span>{t("about.badge")}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("about.title")}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("about.titleHighlight")}
              </span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="rounded-full gap-2" asChild>
                <Link href={LINKS.discord} target="_blank">
                  {t("about.joinCommunity")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm text-center hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
              >
                <stat.icon className="w-7 h-7 mx-auto mb-2 text-primary" />
                <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "hover:border-primary/30 transition-all duration-300"
              )}
            >
              {/* Gradient Header */}
              <div className={cn(
                "h-1.5 bg-linear-to-r",
                value.gradient
              )} />
              
              <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center mb-4 text-white",
                  value.gradient
                )}>
                  <value.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
