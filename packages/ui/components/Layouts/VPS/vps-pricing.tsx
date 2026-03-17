"use client"

import { useState } from "react"
import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Input } from "@/packages/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/packages/ui/components/ui/select"
import { Slider } from "@/packages/ui/components/ui/slider"
import { Cpu, Zap, PackageX, ExternalLink, ArrowRight, HardDrive, MemoryStick, Network, MapPin, Shield, Wifi, Search, X, Tag, Copy, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Price } from "@/packages/ui/components/ui/price"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"
import type { VpsPlanSpec } from "@/packages/core/constants/vps"

interface VpsPricingProps {
  variant: "amd" | "intel"
  plans: VpsPlanSpec[]
  billingUrl: string
}

const VARIANT_STYLES = {
  amd: {
    gradient: "from-red-500/20 via-orange-500/10 to-primary/5",
    iconBg: "bg-red-500/10 text-red-500",
  },
  intel: {
    gradient: "from-blue-500/20 via-cyan-500/10 to-accent/5",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
} as const

export function VpsPricing({ variant, plans, billingUrl }: VpsPricingProps) {
  const t = useTranslations()
  const isOutOfStock = plans.length === 0 || plans.every((p) => p.stock === "out_of_stock")
  const variantName = variant === "amd" ? "AMD" : "Intel"
  const styles = VARIANT_STYLES[variant]

  const priceBounds: [number, number] = plans.length > 0
    ? [Math.min(...plans.map(p => p.priceGBP)), Math.max(...plans.map(p => p.priceGBP))]
    : [0, 100]
  const cpuBounds: [number, number] = plans.length > 0
    ? [Math.min(...plans.map(p => p.cpu)), Math.max(...plans.map(p => p.cpu))]
    : [1, 32]
  const ramBounds: [number, number] = plans.length > 0
    ? [Math.min(...plans.map(p => p.ramGB)), Math.max(...plans.map(p => p.ramGB))]
    : [1, 64]
  const storageBounds: [number, number] = plans.length > 0
    ? [Math.min(...plans.map(p => p.storageGB)), Math.max(...plans.map(p => p.storageGB))]
    : [10, 1000]

  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default")
  const [priceRange, setPriceRange] = useState<[number, number]>(priceBounds)
  const [cpuRange, setCpuRange] = useState<[number, number]>(cpuBounds)
  const [ramRange, setRamRange] = useState<[number, number]>(ramBounds)
  const [storageRange, setStorageRange] = useState<[number, number]>(storageBounds)
  const [copied, setCopied] = useState(false)

  function copyPromoCode() {
    navigator.clipboard.writeText("VPSLAUNCH").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const hasActiveFilters =
    search !== "" ||
    sortOrder !== "default" ||
    priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1] ||
    cpuRange[0] !== cpuBounds[0] || cpuRange[1] !== cpuBounds[1] ||
    ramRange[0] !== ramBounds[0] || ramRange[1] !== ramBounds[1] ||
    storageRange[0] !== storageBounds[0] || storageRange[1] !== storageBounds[1]

  const filteredPlans = [...plans]
    .filter(p =>
      (!search || p.id.toLowerCase().includes(search.toLowerCase())) &&
      p.priceGBP >= priceRange[0] && p.priceGBP <= priceRange[1] &&
      p.cpu >= cpuRange[0] && p.cpu <= cpuRange[1] &&
      p.ramGB >= ramRange[0] && p.ramGB <= ramRange[1] &&
      p.storageGB >= storageRange[0] && p.storageGB <= storageRange[1]
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.priceGBP - b.priceGBP
      if (sortOrder === "desc") return b.priceGBP - a.priceGBP
      return 0
    })

  function clearFilters() {
    setSearch("")
    setSortOrder("default")
    setPriceRange(priceBounds)
    setCpuRange(cpuBounds)
    setRamRange(ramBounds)
    setStorageRange(storageBounds)
  }

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
            <Zap className="w-4 h-4" />
            <span>{t("vps.pricing.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {variantName} VPS{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("vps.pricing.title")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("vps.pricing.description")}
          </p>
        </div>

        {isOutOfStock ? (
          <Card className="max-w-xl mx-auto border-destructive/20 bg-card/30 backdrop-blur-sm p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">{t("gamePage.pricing.outOfStock")}</h3>
              <p className="text-muted-foreground">
                {t("gamePage.pricing.outOfStockDesc", { game: `${variantName} VPS` })}
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
            {/* Promo Banner */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      50% off your first month on all VPS plans
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use this code at checkout valid until <span className="font-medium text-foreground">March 22, 2026</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={copyPromoCode}
                  className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-mono font-bold text-primary transition-colors hover:bg-primary/20"
                >
                  <span>VPSLAUNCH</span>
                  {copied
                    ? <Check className="h-3.5 w-3.5 text-green-500" />
                    : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="max-w-6xl mx-auto mb-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 space-y-4">
              {/* Row 1: search + sort + clear */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("vps.pricing.filters.search")}
                    className="pl-9 h-9 bg-background/50"
                  />
                </div>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "default" | "asc" | "desc")}>
                  <SelectTrigger className="h-9 w-[180px] bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("vps.pricing.filters.sortDefault")}</SelectItem>
                    <SelectItem value="asc">{t("vps.pricing.filters.sortAsc")}</SelectItem>
                    <SelectItem value="desc">{t("vps.pricing.filters.sortDesc")}</SelectItem>
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 h-9">
                    <X className="w-3.5 h-3.5" />
                    {t("vps.pricing.filters.clearFilters")}
                  </Button>
                )}
              </div>

              {/* Row 2: range sliders */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("vps.pricing.filters.price")}</span>
                    <span className="font-medium text-foreground/80">
                      £{priceRange[0]} – £{priceRange[1]}<span className="text-muted-foreground">/mo</span>
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    step={1}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("vps.pricing.filters.cpu")}</span>
                    <span className="font-medium text-foreground/80">{cpuRange[0]} – {cpuRange[1]} vCPU</span>
                  </div>
                  <Slider
                    value={cpuRange}
                    min={cpuBounds[0]}
                    max={cpuBounds[1]}
                    step={1}
                    onValueChange={(v) => setCpuRange(v as [number, number])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("vps.pricing.filters.ram")}</span>
                    <span className="font-medium text-foreground/80">{ramRange[0]} – {ramRange[1]} GB</span>
                  </div>
                  <Slider
                    value={ramRange}
                    min={ramBounds[0]}
                    max={ramBounds[1]}
                    step={1}
                    onValueChange={(v) => setRamRange(v as [number, number])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("vps.pricing.filters.storage")}</span>
                    <span className="font-medium text-foreground/80">{storageRange[0]} – {storageRange[1]} GB</span>
                  </div>
                  <Slider
                    value={storageRange}
                    min={storageBounds[0]}
                    max={storageBounds[1]}
                    step={1}
                    onValueChange={(v) => setStorageRange(v as [number, number])}
                  />
                </div>
              </div>
            </div>

            {/* No results */}
            {filteredPlans.length === 0 ? (
              <Card className="max-w-md mx-auto border-border/50 bg-card/30 backdrop-blur-sm p-8 text-center mb-12">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{t("vps.pricing.filters.noResults")}</h3>
                  <p className="text-sm text-muted-foreground">{t("vps.pricing.filters.noResultsDesc")}</p>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
                    <X className="w-3.5 h-3.5" />
                    {t("vps.pricing.filters.clearFilters")}
                  </Button>
                </div>
              </Card>
            ) : (
            <div
              className={cn(
                "grid gap-6 max-w-6xl mx-auto mb-12",
                filteredPlans.length <= 2
                  ? "md:grid-cols-2"
                  : filteredPlans.length === 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
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
                  <div className={cn("relative h-36 overflow-hidden bg-linear-to-br", styles.gradient)}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center",
                          styles.iconBg,
                          "group-hover:scale-110 transition-transform duration-300",
                        )}
                      >
                        <Cpu className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Most popular badge */}
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
                        {t("vps.pricing.mostPopular")}
                      </div>
                    ) : null}

                    {/* Gradient fade to card */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-card/80 to-transparent" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Name + price row */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{plan.id}</h3>
                      <div className="text-right">
                        <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{t("vpsPage.startingAt")}</p>
                        <Price amount={plan.priceGBP} className="text-lg font-bold leading-none" />
                      </div>
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    )}

                    {/* CPU model chip */}
                    {plan.cpuModel && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/50 text-xs text-muted-foreground mb-4 w-fit">
                        <Cpu className="w-3 h-3 shrink-0" />
                        {plan.cpuModel}
                      </div>
                    )}

                    {/* Spec list */}
                    <ul className="space-y-2 mb-5 flex-1">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Cpu className="w-4 h-4 text-primary shrink-0" />
                        <span>{plan.cpu} {plan.cpu === 1 ? t("vps.pricing.specs.vcpuSingle") : t("vps.pricing.specs.vcpuPlural")}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MemoryStick className="w-4 h-4 text-primary shrink-0" />
                        <span>{t("vps.pricing.specs.ram", { amount: plan.ramGB })}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HardDrive className="w-4 h-4 text-primary shrink-0" />
                        <span>{t("vps.pricing.specs.storage", { amount: plan.storageGB })}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Network className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          {plan.bandwidth === null
                            ? t("vps.pricing.specs.bandwidthUnmetered")
                            : t("vps.pricing.specs.bandwidth", { amount: plan.bandwidth.amount, unit: plan.bandwidth.unit })}
                        </span>
                      </li>
                      {plan.uplink && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Wifi className="w-4 h-4 text-primary shrink-0" />
                          <span>{t("vps.pricing.specs.uplink", { amount: plan.uplink.amount, unit: plan.uplink.unit })}</span>
                        </li>
                      )}
                      {plan.ddos && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            {t("vps.pricing.specs.ddos", { layers: plan.ddos.layers.map(l => `L${l}`).join("/") })}
                            {plan.ddos.autoOn && ` (${t("vps.pricing.specs.ddosAlwaysOn")})`}
                          </span>
                        </li>
                      )}
                      {plan.location && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span>{plan.location}</span>
                        </li>
                      )}
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
                          {t("vps.pricing.getStarted")}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            )}

            {/* Footer CTA */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {t("vps.pricing.customSolution")}{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  {t("vps.pricing.contactUs")}
                </Link>
              </p>
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link href={billingUrl} target="_blank">
                  {t("vps.pricing.viewAllPlans")}
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
