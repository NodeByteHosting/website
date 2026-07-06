"use client"

import { useState } from "react"
import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Input } from "@/packages/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/packages/ui/components/ui/select"
import { Zap, ArrowRight, ExternalLink, PackageX, Search, X, Check, Cpu, HardDrive, MemoryStick, Shield, Database, Monitor, Package, Activity, MapPin } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Price } from "@/packages/ui/components/ui/price"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"
import type { ReactNode } from "react"

const DEFAULT_HEADER_ICON = <Zap className="w-8 h-8" />

function getFeatureIcon(feature: string) {
  const f = feature.toLowerCase()
  if (f.includes("ram") || f.includes("ddr") || f.includes("memory")) return <MemoryStick className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("storage") || f.includes("ssd") || f.includes("nvme") || f.includes("disk")) return <HardDrive className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("ryzen") || f.includes("intel") || f.includes("cpu") || f.includes("processor")) return <Cpu className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("ddos") || f.includes("protection") || f.includes("firewall")) return <Shield className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("database") || f.includes("mysql") || f.includes("mariadb")) return <Database className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("panel") || f.includes("control") || f.includes("dashboard")) return <Monitor className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("jar") || f.includes("plugin") || f.includes("mod") || f.includes("oxide") || f.includes("umod")) return <Package className="w-4 h-4 text-primary shrink-0" />
  if (f.includes("uptime") || f.includes("sla")) return <Activity className="w-4 h-4 text-primary shrink-0" />
  return <Check className="w-4 h-4 text-primary shrink-0" />
}

interface PricingPlan {
  name: string
  description: string
  /** Price in GBP (base currency) - just the number */
  priceGBP: number
  period: string
  features: string[]
  /** Data centre location e.g. "Newcastle, United Kingdom" */
  location?: string
  popular?: boolean
  url?: string
  /** Availability status — defaults to in_stock */
  stock?: "in_stock" | "out_of_stock" | "coming_soon"
  /** Native billing prices per currency code; when present, used instead of converting priceGBP */
  prices?: Record<string, number>
}

interface GamePricingProps {
  gameName: string
  billingUrl: string
  plans: PricingPlan[]
  comingSoon?: boolean
  /** Show an out-of-stock state instead of pricing cards (also triggered when plans is empty) */
  outOfStock?: boolean
  /** Icon node rendered in the card gradient header */
  headerIcon?: ReactNode
  /** Tailwind gradient classes for the card header background */
  headerGradient?: string
  /** Tailwind classes for the icon background/colour inside the header */
  headerIconBg?: string
}

export function GamePricing({
  gameName,
  billingUrl,
  plans,
  comingSoon,
  outOfStock,
  headerIcon = DEFAULT_HEADER_ICON,
  headerGradient = "from-primary/20 via-primary/10 to-accent/5",
  headerIconBg = "bg-primary/10 text-primary",
}: GamePricingProps) {
  const isOutOfStock = outOfStock || plans.length === 0
  const t = useTranslations()

  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default")

  const hasActiveFilters = search !== "" || sortOrder !== "default"

  const filteredPlans = [...plans]
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.priceGBP - b.priceGBP
      if (sortOrder === "desc") return b.priceGBP - a.priceGBP
      return 0
    })

  function clearFilters() {
    setSearch("")
    setSortOrder("default")
  }
  
  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
            <Zap className="w-4 h-4" />
            <span>{t("gamePage.pricing.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {gameName}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("gamePage.pricing.title")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("gamePage.pricing.description")}
          </p>
        </div>

        {comingSoon ? (
          <Card className="max-w-xl mx-auto border-border/50 bg-card/30 backdrop-blur-sm p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t("gamePage.pricing.comingSoon")}</h3>
              <p className="text-muted-foreground">
                {t("gamePage.pricing.comingSoonDesc", { game: gameName })}
              </p>
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link href={LINKS.discord} target="_blank">
                  {t("gamePage.pricing.joinDiscord")}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : isOutOfStock ? (          <Card className="max-w-xl mx-auto border-destructive/20 bg-card/30 backdrop-blur-sm p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">{t("gamePage.pricing.outOfStock")}</h3>
              <p className="text-muted-foreground">
                {t("gamePage.pricing.outOfStockDesc", { game: gameName })}
              </p>
              <p className="text-sm text-muted-foreground/70 border border-border/40 rounded-lg px-4 py-3 bg-muted/20">
                {t("gamePage.pricing.outOfStockNote")}
              </p>
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link href={LINKS.discord} target="_blank">
                  {t("gamePage.pricing.joinDiscord")}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 max-w-5xl mx-auto mb-8 p-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("gamePage.pricing.filters.search")}
                  className="pl-9 h-9 bg-background/50"
                />
              </div>

              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "default" | "asc" | "desc")}>
                <SelectTrigger className="h-9 w-[180px] bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("gamePage.pricing.filters.sortDefault")}</SelectItem>
                  <SelectItem value="asc">{t("gamePage.pricing.filters.sortAsc")}</SelectItem>
                  <SelectItem value="desc">{t("gamePage.pricing.filters.sortDesc")}</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 h-9">
                  <X className="w-3.5 h-3.5" />
                  {t("gamePage.pricing.filters.clearFilters")}
                </Button>
              )}
            </div>

            {/* Pricing Grid */}
            {filteredPlans.length === 0 ? (
              <Card className="max-w-md mx-auto border-border/50 bg-card/30 backdrop-blur-sm p-8 text-center mb-12">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{t("gamePage.pricing.filters.noResults")}</h3>
                  <p className="text-sm text-muted-foreground">{t("gamePage.pricing.filters.noResultsDesc")}</p>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
                    <X className="w-3.5 h-3.5" />
                    {t("gamePage.pricing.filters.clearFilters")}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                {filteredPlans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(
                      "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                      "hover:border-primary/30 transition-all duration-300",
                      "hover:shadow-xl hover:shadow-primary/5",
                      "flex flex-col h-full",
                      plan.popular && "border-primary/50 ring-1 ring-primary/20",
                      plan.stock === "out_of_stock" && "opacity-70",
                    )}
                  >
                    {/* Gradient header with icon */}
                    <div className={cn("relative h-36 overflow-hidden bg-linear-to-br", headerGradient)}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center",
                            headerIconBg,
                            "group-hover:scale-110 transition-transform duration-300",
                          )}
                        >
                          {headerIcon}
                        </div>
                      </div>

                      {plan.stock === "out_of_stock" ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
                          {t("pricing.outOfStock")}
                        </div>
                      ) : plan.stock === "coming_soon" ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          {t("pricing.comingSoon")}
                        </div>
                      ) : plan.popular ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                          {t("gamePage.pricing.mostPopular")}
                        </div>
                      ) : null}

                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-card/80 to-transparent" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Name + price row */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="text-right">
                          <div className="flex items-baseline gap-0.5">
                            <Price amount={plan.priceGBP} prices={plan.prices} className="text-lg font-bold leading-none" />
                            <span className="text-xs text-muted-foreground">/{plan.period}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                      {/* Location */}
                      {plan.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 px-2.5 py-1.5 rounded-md bg-muted/40 border border-border/40 w-fit">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{plan.location}</span>
                        </div>
                      )}

                      {/* Features */}
                      <ul className="space-y-2 mb-5 flex-1">
                        {plan.features.map((feature, i) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.stock === "out_of_stock" ? (
                        <Button className="w-full gap-2 rounded-lg mt-auto" variant="outline" disabled>
                          {t("pricing.outOfStock")}
                        </Button>
                      ) : plan.stock === "coming_soon" ? (
                        <Button className="w-full gap-2 rounded-lg mt-auto" variant="outline" disabled>
                          {t("pricing.comingSoon")}
                        </Button>
                      ) : (
                        <Button
                          className="w-full gap-2 rounded-lg mt-auto"
                          variant={plan.popular ? "default" : "outline"}
                          asChild
                        >
                          <Link href={plan.url || billingUrl} target="_blank">
                            {t("gamePage.pricing.getStarted")}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {t("gamePage.pricing.customSolution")}{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  {t("gamePage.pricing.contactUs")}
                </Link>
              </p>
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link href={billingUrl} target="_blank">
                  {t("gamePage.pricing.viewAllPlans")}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
