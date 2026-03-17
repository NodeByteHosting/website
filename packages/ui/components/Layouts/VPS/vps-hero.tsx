"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { ArrowRight, Star, Cpu, Shield, Zap, HardDrive, Network, Terminal, PackageX, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

const SPEC_ICONS = { Cpu, Shield, Zap, HardDrive, Network, Terminal } as const
type SpecIconKey = keyof typeof SPEC_ICONS

export interface VpsSpec {
  icon: SpecIconKey
  label: string
  value: string
}

export interface VpsHeroProps {
  /** "amd" | "intel" — controls colour palette */
  variant: "amd" | "intel"
  tag: string
  description: string
  heroFeatures: string[]
  billingUrl: string
  specs: readonly VpsSpec[]
  /** When true the primary CTA is replaced with an out-of-stock notice */
  outOfStock?: boolean
}

export function VpsHero({
  variant,
  tag,
  description,
  heroFeatures,
  billingUrl,
  specs,
  outOfStock,
}: VpsHeroProps) {
  const t = useTranslations()
  const isAmd = variant === "amd"
  const displayName = isAmd ? "AMD VPS" : "Intel VPS"

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-24">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]",
            isAmd ? "bg-red-500/5" : "bg-blue-500/5",
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]",
            isAmd ? "bg-primary/5" : "bg-accent/5",
          )}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Tag */}
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm",
                isAmd
                  ? "bg-primary/10 border border-primary/20 text-primary"
                  : "bg-accent/10 border border-accent/20 text-accent",
              )}
            >
              <Cpu className="w-4 h-4" />
              <span>{tag}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {displayName}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("vps.hosting")}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">{description}</p>

            {/* Out-of-stock banner */}
            {outOfStock && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <PackageX className="w-4 h-4 shrink-0" />
                {t("vps.outOfStockNotice")}
              </div>
            )}

            {/* Hero feature pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {heroFeatures.map((f) => (
                <div
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground"
                >
                  <Star className="w-3 h-3 text-primary" />
                  {f}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {outOfStock ? (
                <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                  <Link href={LINKS.discord} target="_blank">
                    {t("gamePage.pricing.joinDiscord")}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                  <Link href={billingUrl} target="_blank">
                    {t("vps.viewPlans")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8" asChild>
                <Link href="#features">{t("vps.learnMore")}</Link>
              </Button>
            </div>
          </div>

          {/* ── Right — Specs panel ── */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Glow */}
              <div
                className={cn(
                  "absolute inset-0 rounded-3xl blur-2xl",
                  isAmd
                    ? "bg-linear-to-tr from-red-500/20 via-transparent to-primary/20"
                    : "bg-linear-to-tr from-blue-500/20 via-transparent to-accent/20",
                )}
              />
              <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 space-y-4">
                {/* Platform header */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isAmd ? "bg-red-500/10" : "bg-blue-500/10",
                    )}
                  >
                    <Cpu className={cn("w-6 h-6", isAmd ? "text-red-500" : "text-blue-500")} />
                  </div>
                  <div>
                    <p className="font-semibold">{displayName} Platform</p>
                    <p className="text-sm text-muted-foreground">
                      {isAmd ? "Enterprise-grade performance" : "Rock-solid reliability"}
                    </p>
                  </div>
                </div>

                {/* Spec rows */}
                {specs.map((spec) => {
                  const Icon = SPEC_ICONS[spec.icon]
                  return (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4" />
                        {spec.label}
                      </div>
                      <span className="text-sm font-medium">{spec.value}</span>
                    </div>
                  )
                })}

                {/* Out-of-stock overlay chip */}
                {outOfStock && (
                  <div className="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <PackageX className="w-4 h-4 text-destructive" />
                    <p className="text-sm font-medium text-destructive">{t("vps.outOfStock")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
