"use client"

import { useState } from "react"
import {
  Server,
  Search,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Zap,
  SlidersHorizontal,
  X,
  ArrowRight,
  ChevronDown,
  Star,
  PackageX,
} from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/packages/ui/components/ui/collapsible"
import { PlanInfoRow } from "@/packages/ui/components/ui/plan-info-row"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import { useTranslations } from "next-intl"
import { Price } from "@/packages/ui/components/ui/price"

const LINEUP_META = {
  BASE: {
    label: "BASE",
    description: "General use, bots, web & dev staging",
    color: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    dot: "bg-slate-400",
  },
  COMP: {
    label: "COMP",
    description: "High-performance apps, databases & backend",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  GAME: {
    label: "GAME",
    description: "Latency-sensitive gaming, peak single-core clocks",
    color: "bg-green-500/15 text-green-400 border-green-500/20",
    dot: "bg-green-400",
  },
  ELITE: {
    label: "ELITE",
    description: "Fully dedicated CPU threads, no oversubscription",
    color: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    dot: "bg-purple-400",
  },
} as const

// ─── Series metadata ──────────────────────────────────────────────────────────

const SERIES_META: Record<string, { label: string; fullName: string; chip: string; brand: string }> = {
  RG1:  { label: "RG1",  fullName: "Ryzen 1000 Series",    chip: "1700X",  brand: "amd"   },
  RG3:  { label: "RG3",  fullName: "Ryzen 5000 Series",    chip: "5900X",  brand: "amd"   },
  RG4:  { label: "RG4",  fullName: "Ryzen 7000 Series",    chip: "7950X",  brand: "amd"   },
  IG3:  { label: "IG3",  fullName: "Intel 13th/14th Gen",  chip: "14900K", brand: "intel" },
  IX1:  { label: "IX1",  fullName: "Intel Xeon",           chip: "Xeon",   brand: "intel" },
  LND:  { label: "LND",  fullName: "Akamai Cloud (London)",chip: "Shared", brand: "amd"   },
  ARM1: { label: "ARM1", fullName: "Ampere Altra ARM64",   chip: "Altra",  brand: "arm"   },
  HZ3:  { label: "HZ3",  fullName: "Hetzner Dedicated",    chip: "Shared", brand: "amd"   },
}

type Lineup = keyof typeof LINEUP_META
type Series = string
type SortKey =
  | "default"
  | "price-asc" | "price-desc"
  | "ram-asc" | "ram-desc"
  | "storage-asc" | "storage-desc"
  | "cpu-asc" | "cpu-desc"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBandwidth(plan: VpsPlanSpec): string {
  if (!plan.bandwidth) return "Unmetered"
  return `${plan.bandwidth.amount} ${plan.bandwidth.unit}`
}

// ─── PlanCard ─────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: VpsPlanSpec }) {
  const lineup = plan.lineup ? LINEUP_META[plan.lineup] ?? null : null
  const series = plan.series ? SERIES_META[plan.series] ?? null : null
  const outOfStock = plan.stock === "out_of_stock"
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card/30 backdrop-blur-sm transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5",
        plan.popular
          ? "border-primary/40 hover:border-primary/60"
          : "border-border/50 hover:border-border",
        outOfStock && "opacity-60",
      )}
    >
      {/* Popular ribbon */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20">
          <Star className="w-3 h-3" />
          Most Popular
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1.5">
            <p className="font-mono text-base font-bold tracking-tight">
              {plan.sku ?? plan.id}
            </p>
            {plan.cpuModel && (
              <p className="text-xs text-muted-foreground">{plan.cpuModel}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <Price amount={plan.priceGBP} prices={plan.prices} className="text-2xl font-bold tabular-nums" />
            <p className="text-xs text-muted-foreground">/month</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {lineup && (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", lineup.color)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", lineup.dot)} />
              {lineup.label}
            </span>
          )}
          {series && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/50 text-muted-foreground bg-muted/30">
              {series.label} · {series.chip}
            </span>
          )}
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-destructive/30 text-destructive bg-destructive/10">
              Out of Stock
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Cpu className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{plan.cpu} vCPU</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Server className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{plan.ramGB} GB</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{plan.storageGB} GB</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Network className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{formatBandwidth(plan)}</span>
          </div>
        </div>

        {/* Included features */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[
            { icon: Shield, text: "DDoS Protection" },
            { icon: Zap, text: "KVM" },
            { icon: Server, text: "Full Root" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon className="w-3 h-3 text-primary" />
              {text}
            </span>
          ))}
        </div>

        {/* Server info */}
        <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{infoOpen ? "Hide" : "View"} Server Info</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", infoOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2 border-t border-border/40 mt-3">
            <PlanInfoRow
              label="Setup Fee"
              value={plan.setupFeeGBP > 0 ? <Price amount={plan.setupFeeGBP} prices={plan.setupFees} /> : "None"}
            />
            {series && <PlanInfoRow label="Hardware Series" value={series.fullName} />}
            {plan.uplink && (
              <PlanInfoRow label="Uplink" value={`${plan.uplink.amount} ${plan.uplink.unit}`} />
            )}
            {plan.ddos && (
              <PlanInfoRow
                label="DDoS Layers"
                value={`L${plan.ddos.layers.join("/")}${plan.ddos.autoOn ? " · Always-on" : ""}`}
              />
            )}
            {plan.location && <PlanInfoRow label="Location" value={plan.location} />}
            {plan.databases != null && <PlanInfoRow label="Databases" value={`${plan.databases}x MySQL`} />}
            {plan.backups && <PlanInfoRow label="Backups" value="Automatic" />}
          </CollapsibleContent>
        </Collapsible>

        {/* CTA */}
        <Button
          size="sm"
          variant={outOfStock ? "outline" : "default"}
          className="w-full gap-2 rounded-lg mt-auto"
          disabled={outOfStock}
          asChild={!outOfStock}
        >
          {outOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <a href={plan.url} target="_blank" rel="noopener noreferrer">
              Order Now <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

interface VpsHubProps {
  plans: VpsPlanSpec[]
}

export function VpsHub({ plans }: VpsHubProps) {
  const [search, setSearch] = useState("")
  const [lineup, setLineup] = useState<Lineup | "ALL">("ALL")
  const [series, setSeries] = useState<Series | "ALL">("ALL")
  const [hardware, setHardware] = useState<"amd" | "intel" | "arm" | "ALL">("ALL")
  const [ram, setRam] = useState<number | "ALL">("ALL")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sort, setSort] = useState<SortKey>("default")

  // Derive which lineups/series/RAM tiers actually exist in the plan list —
  // reliable even for plans whose names don't follow the LINEUP-SERIES-RAM
  // convention, since it's built from the live data, not assumed from it.
  const availableLineups = Array.from(new Set(plans.flatMap((p) => p.lineup ? [p.lineup] : []))) as Lineup[]
  const availableSeries = Array.from(new Set(plans.flatMap((p) => p.series ? [p.series] : []))) as Series[]
  const availableRam = Array.from(new Set(plans.map((p) => p.ramGB))).sort((a, b) => a - b)

  const filtered = (() => {
    let result = [...plans]
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          (p.sku ?? p.id).toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.cpuModel?.toLowerCase().includes(q),
      )
    }
    if (lineup !== "ALL") result = result.filter((p) => p.lineup === lineup)
    if (series !== "ALL") result = result.filter((p) => p.series === series)
    if (hardware !== "ALL") result = result.filter((p) => p.hardware === hardware)
    if (ram !== "ALL") result = result.filter((p) => p.ramGB === ram)
    const min = parseFloat(priceMin)
    const max = parseFloat(priceMax)
    if (!isNaN(min)) result = result.filter((p) => p.priceGBP >= min)
    if (!isNaN(max)) result = result.filter((p) => p.priceGBP <= max)
    if (sort === "price-asc") result.sort((a, b) => a.priceGBP - b.priceGBP)
    if (sort === "price-desc") result.sort((a, b) => b.priceGBP - a.priceGBP)
    if (sort === "ram-asc") result.sort((a, b) => a.ramGB - b.ramGB)
    if (sort === "ram-desc") result.sort((a, b) => b.ramGB - a.ramGB)
    if (sort === "storage-asc") result.sort((a, b) => a.storageGB - b.storageGB)
    if (sort === "storage-desc") result.sort((a, b) => b.storageGB - a.storageGB)
    if (sort === "cpu-asc") result.sort((a, b) => a.cpu - b.cpu)
    if (sort === "cpu-desc") result.sort((a, b) => b.cpu - a.cpu)
    return result
  })()

  const hasActiveFilters =
    lineup !== "ALL" || series !== "ALL" || hardware !== "ALL" || ram !== "ALL" ||
    priceMin !== "" || priceMax !== "" || search !== ""

  function clearFilters() {
    setSearch("")
    setLineup("ALL")
    setSeries("ALL")
    setHardware("ALL")
    setRam("ALL")
    setPriceMin("")
    setPriceMax("")
    setSort("default")
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_10%,black_40%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 70% 25%, hsl(var(--primary) / 0.08) 0%, transparent 100%)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 sm:pt-36 pb-24 sm:pb-32 space-y-12">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Server className="w-4 h-4" />
            <span>VPS & VDS Hosting</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Choose Your{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              VPS Plan
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enterprise KVM virtual servers across multiple hardware lineups. Full root access and DDoS protection on every plan.
          </p>
        </div>

        {/* ── Filter bar ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Search + Sort row */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU, specs, or CPU model…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card/30 border-border/50"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-48 bg-card/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort: Default</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="ram-asc">RAM: Low → High</SelectItem>
                <SelectItem value="ram-desc">RAM: High → Low</SelectItem>
                <SelectItem value="storage-asc">Storage: Low → High</SelectItem>
                <SelectItem value="storage-desc">Storage: High → Low</SelectItem>
                <SelectItem value="cpu-asc">CPU Cores: Low → High</SelectItem>
                <SelectItem value="cpu-desc">CPU Cores: High → Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Min £"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-24 bg-card/30 border-border/50"
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Max £"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-24 bg-card/30 border-border/50"
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* RAM tier — derived from live plan data, always reliable regardless of naming */}
            <button
              type="button"
              onClick={() => setRam("ALL")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                ram === "ALL"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              All RAM
            </button>
            {availableRam.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRam(ram === r ? "ALL" : r)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  ram === r
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {r} GB
              </button>
            ))}

            <span className="w-px h-4 bg-border/50 mx-1" />

            {/* Hardware brand */}
            {(["ALL", "amd", "intel", "arm"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHardware(h)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  hardware === h
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {h === "ALL" ? "All Hardware" : h === "amd" ? "AMD" : h === "intel" ? "Intel" : "ARM"}
              </button>
            ))}

            <span className="w-px h-4 bg-border/50 mx-1" />

            {/* Lineup chips */}
            {(Object.entries(LINEUP_META) as [Lineup, typeof LINEUP_META[Lineup]][]).map(([key, meta]) => (
              availableLineups.includes(key) ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLineup(lineup === key ? "ALL" : key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all",
                    lineup === key
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dot)} />
                  {meta.label}
                </button>
              ) : null
            ))}

            <span className="w-px h-4 bg-border/50 mx-1" />

            {/* Series chips — only show series that exist in the plans */}
            {availableSeries.map((s) => {
              const meta = SERIES_META[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeries(series === s ? "ALL" : s)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all",
                    series === s
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {meta ? `${meta.label} · ${meta.chip}` : s}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Plan grid ────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-destructive/20 rounded-2xl bg-card/20">
              <PackageX className="w-10 h-10 text-destructive/60" />
              <p className="font-medium">No VPS plans in stock right now</p>
              <p className="text-sm text-muted-foreground">Check back soon, or get in touch for a custom configuration.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-border/40 rounded-2xl bg-card/20">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium">No plans match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Showing {filtered.length} of {plans.length} plans
              </p>
              <div className="grid items-start sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Custom plans CTA ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold">Need a custom configuration?</p>
                <p className="text-sm text-muted-foreground">
                  Looking for a specific RAM, storage, or CPU spec not listed above? Get in touch and we'll put together a plan that fits.
                </p>
              </div>
              <Button size="sm" className="gap-2 rounded-full shrink-0" asChild>
                <Link href="/contact">Contact Us <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
