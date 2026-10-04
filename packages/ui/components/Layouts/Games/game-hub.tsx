"use client"

import { useState } from "react"
import {
  Server,
  Search,
  MemoryStick,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Zap,
  X,
  ArrowRight,
  Gamepad2,
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
import { PlanCard as PlanCardShell } from "@/packages/ui/components/ui/plan-card"
import { PlanInfoRow } from "@/packages/ui/components/ui/plan-info-row"
import Link from "next/link"
import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import { Price } from "@/packages/ui/components/ui/price"
import { SUPPORTED_GAMES } from "@/packages/core/constants/supported-games"

type SortKey = "default" | "asc" | "desc"

function formatBandwidth(plan: GamePlanSpec): string {
  if (!plan.bandwidth) return "Unmetered"
  return `${plan.bandwidth.amount} ${plan.bandwidth.unit}`
}

function PlanCard({ plan }: { plan: GamePlanSpec }) {
  return (
    <PlanCardShell
      name={plan.name ?? plan.id}
      subtitle={plan.description}
      priceGBP={plan.priceGBP}
      prices={plan.prices}
      popular={plan.popular}
      outOfStock={plan.stock === "out_of_stock"}
      url={plan.url}
      specs={[
        ...(plan.cpu ? [{ icon: Cpu, value: `${plan.cpu}`, label: plan.cpu === 1 ? "vCPU" : "vCPUs" }] : []),
        { icon: MemoryStick, value: `${plan.ramGB} GB`, label: plan.ramType ? `${plan.ramType} RAM` : "RAM" },
        { icon: HardDrive, value: `${plan.storageGB} GB`, label: plan.storageLabel ?? "Storage" },
        { icon: Network, value: formatBandwidth(plan), label: "Bandwidth" },
      ]}
      features={[
        { icon: Shield, text: "DDoS Protection" },
        { icon: Zap, text: "Instant Setup" },
        { icon: Server, text: "Control Panel" },
      ]}
      info={
        <>
          <PlanInfoRow
            label="Setup Fee"
            value={plan.setupFeeGBP > 0 ? <Price amount={plan.setupFeeGBP} prices={plan.setupFees} /> : "None"}
          />
          {plan.cpuModel && <PlanInfoRow label="CPU Model" value={plan.cpuModel} />}
          {plan.uplink && <PlanInfoRow label="Uplink" value={`${plan.uplink.amount} ${plan.uplink.unit}`} />}
          {plan.location && <PlanInfoRow label="Locations" value={plan.location} />}
          {plan.databases != null && <PlanInfoRow label="Databases" value={`${plan.databases}x MySQL`} />}
          {plan.backups && <PlanInfoRow label="Backups" value="Automatic" />}
        </>
      }
    />
  )
}

interface GameHubProps {
  plans: GamePlanSpec[]
}

export function GameHub({ plans }: GameHubProps) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortKey>("asc")

  const filtered = (() => {
    let result = [...plans]
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          (p.name ?? p.id).toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      )
    }
    if (sort === "asc") result.sort((a, b) => a.priceGBP - b.priceGBP)
    if (sort === "desc") result.sort((a, b) => b.priceGBP - a.priceGBP)
    return result
  })()

  const hasActiveFilters = search !== ""

  function clearFilters() {
    setSearch("")
    setSort("asc")
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 text-foreground/2 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_10%,black_40%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 70% 25%, hsl(var(--primary) / 0.08) 0%, transparent 100%)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 sm:pt-36 pb-24 sm:pb-32 space-y-12">

        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Gamepad2 className="w-4 h-4" />
            <span>Game Server Hosting</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Choose Your{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Game Server
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            One set of plans for every game we support. Pick a tier below, then choose which game to deploy at checkout.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {SUPPORTED_GAMES.map((game) => (
              <span
                key={game}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border/50 bg-muted/30 text-muted-foreground"
              >
                {game}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by plan name…"
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

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-destructive/20 rounded-2xl bg-card/20">
              <PackageX className="w-10 h-10 text-destructive/60" />
              <p className="font-medium">No game server plans in stock right now</p>
              <p className="text-sm text-muted-foreground">Check back soon, or get in touch for a custom configuration.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-border/40 rounded-2xl bg-card/20">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium">No plans match your search</p>
              <p className="text-sm text-muted-foreground">Try adjusting or clearing your search.</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Showing {filtered.length} of {plans.length} plan{plans.length !== 1 ? "s" : ""}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold">Don't see the game you're after?</p>
                <p className="text-sm text-muted-foreground">
                  Let us know what you're looking to run and we'll help get it set up.
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
