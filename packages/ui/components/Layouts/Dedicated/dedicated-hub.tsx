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
  X,
  ArrowRight,
  ChevronDown,
  Star,
  Lock,
  PackageX,
} from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
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
import type { DedicatedPlanSpec } from "@/packages/core/types/servers/dedicated"
import { Price } from "@/packages/ui/components/ui/price"

type SortKey = "default" | "asc" | "desc"

function formatBandwidth(plan: DedicatedPlanSpec): string {
  if (!plan.bandwidth) return "Unmetered"
  return `${plan.bandwidth.amount} ${plan.bandwidth.unit}`
}

function formatStorage(plan: DedicatedPlanSpec): string {
  if (plan.storageDescription) return plan.storageDescription
  if (plan.storageGB) {
    return plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`
  }
  return "—"
}

// ─── PlanCard ─────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: DedicatedPlanSpec }) {
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
            <p className="font-mono text-base font-bold tracking-tight uppercase">
              {plan.id.replace(/-/g, " ")}
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

        {/* Hardware badge */}
        <div className="flex flex-wrap gap-1.5">
          {plan.hardware && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase",
                plan.hardware === "amd"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20",
              )}
            >
              {plan.hardware}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-amber-500/20 text-amber-400 bg-amber-500/10">
            Bare Metal
          </span>
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-destructive/30 text-destructive bg-destructive/10">
              Out of Stock
            </span>
          )}
        </div>

        <div className="border-t border-border/40" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Cpu className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">
              {plan.cores != null ? `${plan.cores} Cores` : plan.cpuModel ?? "Dedicated CPU"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Server className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{plan.ramGB} GB RAM</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2 truncate">
            <HardDrive className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">{formatStorage(plan)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Network className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{formatBandwidth(plan)}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[
            { icon: Shield, text: "DDoS Protection" },
            { icon: Lock, text: "IPMI Access" },
            { icon: Zap, text: "Full Dedicated" },
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
            {plan.uplink && (
              <PlanInfoRow label="Uplink" value={`${plan.uplink.amount} ${plan.uplink.unit}`} />
            )}
            {plan.location && <PlanInfoRow label="Location" value={plan.location} />}
            {plan.databases != null && <PlanInfoRow label="Databases" value={`${plan.databases}x MySQL`} />}
            {plan.backups && <PlanInfoRow label="Backups" value="Automatic" />}
          </CollapsibleContent>
        </Collapsible>

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

interface DedicatedHubProps {
  plans: DedicatedPlanSpec[]
}

export function DedicatedHub({ plans }: DedicatedHubProps) {
  const [search, setSearch] = useState("")
  const [hardware, setHardware] = useState<"amd" | "intel" | "ALL">("ALL")
  const [sort, setSort] = useState<SortKey>("default")

  const filtered = (() => {
    let result = [...plans]
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.cpuModel?.toLowerCase().includes(q),
      )
    }
    if (hardware !== "ALL") result = result.filter((p) => p.hardware === hardware)
    if (sort === "asc") result.sort((a, b) => a.priceGBP - b.priceGBP)
    if (sort === "desc") result.sort((a, b) => b.priceGBP - a.priceGBP)
    return result
  })()

  const hasActiveFilters = hardware !== "ALL" || search !== ""

  function clearFilters() {
    setSearch("")
    setHardware("ALL")
    setSort("default")
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 text-foreground/2 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_10%,black_40%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 70% 25%, hsl(var(--primary) / 0.08) 0%, transparent 100%)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 sm:pt-36 pb-24 sm:pb-32 space-y-12">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Server className="w-4 h-4" />
            <span>Dedicated &amp; Bare Metal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Dedicated{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Server Hosting
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Physical bare-metal servers with zero resource contention. Fully dedicated CPU cores, enterprise storage, and IPMI out-of-band access on every plan.
          </p>

          {/* Key differentiators */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Cpu, text: "100% Dedicated Cores" },
              { icon: Lock, text: "IPMI / Out-of-Band" },
              { icon: Shield, text: "DDoS Protection" },
              { icon: Zap, text: "No Noisy Neighbours" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter bar ───────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by server name or CPU model…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card/30 border-border/50"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-44 bg-card/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort: Default</SelectItem>
                <SelectItem value="asc">Price: Low → High</SelectItem>
                <SelectItem value="desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Hardware filter */}
            <div className="flex gap-1.5">
              {(["ALL", "amd", "intel"] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHardware(h)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    hardware === h
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {h === "ALL" ? "All Hardware" : h.toUpperCase()}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* ── Plan grid ────────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-destructive/20 rounded-2xl bg-card/20">
              <PackageX className="w-10 h-10 text-destructive/60" />
              <p className="font-medium">No dedicated servers in stock right now</p>
              <p className="text-sm text-muted-foreground">Check back soon, or get in touch for a custom configuration.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-border/40 rounded-2xl bg-card/20">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium">No servers match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Showing {filtered.length} of {plans.length} server{plans.length !== 1 ? "s" : ""}
              </p>
              <div className="grid items-start sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Custom / Enterprise CTA ───────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold">Need a custom or enterprise configuration?</p>
                <p className="text-sm text-muted-foreground">
                  Looking for a specific CPU, higher RAM, custom RAID, or multiple servers? Get in touch and we'll build a solution that fits.
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
