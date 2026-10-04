"use client"

import { useState } from "react"
import {
  Cloud,
  Search,
  HardDrive,
  Key,
  ArrowLeftRight,
  Zap,
  Shield,
  Archive,
  SlidersHorizontal,
  X,
  ArrowRight,
  ChevronDown,
  Check,
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
import { Collapsible, CollapsibleContent } from "@/packages/ui/components/ui/collapsible"
import { PlanCard as PlanCardShell, type PlanSpec } from "@/packages/ui/components/ui/plan-card"
import { PlanInfoRow } from "@/packages/ui/components/ui/plan-info-row"
import { FilterChipRow, FilterChip } from "@/packages/ui/components/ui/filter-chip"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ObjectStoragePlanSpec } from "@/packages/core/types/servers/object-storage"
import { Price } from "@/packages/ui/components/ui/price"

type SortKey = "default" | "price-asc" | "price-desc" | "storage-asc" | "storage-desc"

function formatStorage(gb: number): string {
  if (gb < 1000) return `${gb} GB`
  const tb = Math.round((gb / 1000) * 100) / 100
  return `${tb} TB`
}

function PlanCard({ plan }: { plan: ObjectStoragePlanSpec }) {
  const specs: PlanSpec[] = [
    { icon: HardDrive, value: formatStorage(plan.storageGB), label: plan.storageLabel ?? "Storage" },
  ]
  if (plan.accessKeys) specs.push({ icon: Key, value: plan.accessKeys, label: "Access Keys" })
  if (plan.egress) specs.push({ icon: ArrowLeftRight, value: plan.egress, label: "Egress" })
  if (plan.apiRequests) specs.push({ icon: Zap, value: plan.apiRequests, label: "API Requests" })
  if (plan.archivePolicy) specs.push({ icon: Archive, value: plan.archivePolicy, label: "Auto-Archive" })

  return (
    <PlanCardShell
      name={plan.name ?? plan.id.replace(/-/g, " ")}
      subtitle={plan.description}
      priceGBP={plan.priceGBP}
      prices={plan.prices}
      popular={plan.popular}
      outOfStock={plan.stock === "out_of_stock"}
      url={plan.url}
      specs={specs}
      infoLabel="Plan Info"
      extra={
        plan.features.length > 0 && (
          <ul className="space-y-1.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )
      }
      info={
        plan.setupFeeGBP > 0 && (
          <PlanInfoRow label="Setup Fee" value={<Price amount={plan.setupFeeGBP} prices={plan.setupFees} />} />
        )
      }
    />
  )
}

interface ObjectStorageHubProps {
  plans: ObjectStoragePlanSpec[]
}

export function ObjectStorageHub({ plans }: ObjectStorageHubProps) {
  const [search, setSearch] = useState("")
  const [storage, setStorage] = useState<number | "ALL">("ALL")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sort, setSort] = useState<SortKey>("price-asc")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const availableStorage = Array.from(new Set(plans.map((p) => p.storageGB))).sort((a, b) => a - b)

  const filtered = (() => {
    let result = [...plans]
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      )
    }
    if (storage !== "ALL") result = result.filter((p) => p.storageGB === storage)
    const min = parseFloat(priceMin)
    const max = parseFloat(priceMax)
    if (!isNaN(min)) result = result.filter((p) => p.priceGBP >= min)
    if (!isNaN(max)) result = result.filter((p) => p.priceGBP <= max)
    if (sort === "price-asc") result.sort((a, b) => a.priceGBP - b.priceGBP)
    if (sort === "price-desc") result.sort((a, b) => b.priceGBP - a.priceGBP)
    if (sort === "storage-asc") result.sort((a, b) => a.storageGB - b.storageGB)
    if (sort === "storage-desc") result.sort((a, b) => b.storageGB - a.storageGB)
    return result
  })()

  const activeFilterCount = [storage !== "ALL", priceMin !== "", priceMax !== ""].filter(Boolean).length
  const hasActiveFilters = activeFilterCount > 0 || search !== ""

  function clearFilters() {
    setSearch("")
    setStorage("ALL")
    setPriceMin("")
    setPriceMax("")
    setSort("price-asc")
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
            <Cloud className="w-4 h-4" />
            <span>S3-Compatible Storage</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Object{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Storage
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            S3 API compatible cloud storage with generous free egress and self-service access keys. Works with rclone, Cyberduck, AWS CLI, SDKs, and Docker.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Cloud, text: "S3 API Compatible" },
              { icon: Key, text: "Self-Service Credentials" },
              { icon: Shield, text: "99.99% Reliability" },
              { icon: ArrowLeftRight, text: "Free Egress Included" },
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

        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3 flex-wrap items-center">
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
              <SelectTrigger className="w-full sm:w-48 bg-card/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort: Default</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="storage-asc">Storage: Low → High</SelectItem>
                <SelectItem value="storage-desc">Storage: High → Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen((v) => !v)}
              className="gap-1.5 bg-card/30 border-border/50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-0.5 h-4 min-w-4 px-1 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", filtersOpen && "rotate-180")} />
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>

          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <div className="rounded-xl border border-border/50 bg-card/20 p-4 space-y-3">
                <FilterChipRow label="Price">
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="Min £"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-24 h-7 bg-card/30 border-border/50 text-xs"
                    />
                    <span className="text-muted-foreground text-sm">–</span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="Max £"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-24 h-7 bg-card/30 border-border/50 text-xs"
                    />
                  </div>
                </FilterChipRow>

                <FilterChipRow label="Storage">
                  <FilterChip active={storage === "ALL"} onClick={() => setStorage("ALL")}>All Sizes</FilterChip>
                  {availableStorage.map((s) => (
                    <FilterChip key={s} active={storage === s} onClick={() => setStorage(storage === s ? "ALL" : s)}>
                      {formatStorage(s)}
                    </FilterChip>
                  ))}
                </FilterChipRow>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="max-w-4xl mx-auto">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-destructive/20 rounded-2xl bg-card/20">
              <PackageX className="w-10 h-10 text-destructive/60" />
              <p className="font-medium">No object storage plans in stock right now</p>
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
                <p className="font-semibold">Need a custom storage configuration?</p>
                <p className="text-sm text-muted-foreground">
                  Looking for more storage, higher egress, or a dedicated bucket setup? Get in touch and we'll build a solution that fits.
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
