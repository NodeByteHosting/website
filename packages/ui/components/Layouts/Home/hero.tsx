"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/packages/ui/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, PartyPopper, Sparkles, Play } from "lucide-react"
import Link from "next/link"
import HeroGraphic from "./hero-graphic"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations()
  const [uptime, setUptime] = useState(0)
  const [ping, setPing] = useState(120)

  useEffect(() => {
    // Animate uptime to 99.6
    let start: number | null = null
    const duration = 1200
    const from = 95
    const to = 99.6
    function step(ts: number) {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / duration)
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (to - from) * eased
      setUptime(Number(v.toFixed(1)))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

    // Animate ping down to ~50ms
    let pstart: number | null = null
    const pduration = 1000
    const pfrom = 120
    const pto = 50
    function pstep(ts: number) {
      if (!pstart) pstart = ts
      const t = Math.min(1, (ts - pstart) / pduration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = Math.round(pfrom + (pto - pfrom) * eased)
      setPing(v)
      if (t < 1) requestAnimationFrame(pstep)
    }
    requestAnimationFrame(pstep)
  }, [])

  const stats = [
    {
      icon: Shield,
      value: `${uptime}%`,
      label: t("hero.stats.uptime"),
      description: t("hero.stats.uptimeDesc"),
      color: "primary",
    },
    {
      icon: Zap,
      value: `≈${ping}ms`,
      label: t("hero.stats.ping"),
      description: t("hero.stats.pingDesc"),
      color: "accent",
    },
    {
      icon: Globe,
      value: "24/7",
      label: t("hero.stats.support"),
      description: t("hero.stats.supportDesc"),
      color: "primary",
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Promo Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {t("hero.promo.prefix")} <strong className="text-primary font-semibold">WELCOME10</strong> {t("hero.promo.suffix")}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {t("hero.title")}
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t("hero.description")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full px-8 h-12 text-base" asChild>
                <Link href="https://billing.nodebyte.host/store">
                  {t("hero.getStarted")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto gap-2 rounded-full px-8 h-12 text-base border-border/50 hover:bg-accent/10"
                asChild
              >
                <Link href="https://discord.gg/wN58bTzzpW" target="_blank">
                  <Play className="w-4 h-4" />
                  {t("hero.joinDiscord")}
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "group relative p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm",
                    "hover:border-primary/30 hover:bg-card/50 transition-all duration-300",
                    "hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    stat.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Graphic */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow effect behind graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 rounded-full blur-3xl scale-110" />
              
              {/* Main graphic container */}
              <div className="relative">
                <HeroGraphic />
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By / Social Proof */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>{t("hero.trustedBy")}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium text-foreground">4.1/5</span>
              <a 
                href="https://uk.trustpilot.com/review/nodebyte.host" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t("hero.trustpilotReviews")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}