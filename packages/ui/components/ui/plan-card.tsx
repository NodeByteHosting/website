"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown, Star, type LucideIcon } from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/packages/ui/components/ui/collapsible"
import { Price } from "@/packages/ui/components/ui/price"
import { cn } from "@/lib/utils"

export type PlanSpec = {
  icon: LucideIcon
  value: string
  label: string
}

export type PlanFeature = {
  icon: LucideIcon
  text: string
}

type PlanCardProps = {
  name: string
  subtitle?: string | null
  priceGBP: number
  prices: Record<string, number>
  popular?: boolean
  outOfStock?: boolean
  url: string
  badges?: React.ReactNode
  specs: PlanSpec[]
  features?: PlanFeature[]
  extra?: React.ReactNode
  info?: React.ReactNode
  infoLabel?: string
}

export function PlanCard({
  name,
  subtitle,
  priceGBP,
  prices,
  popular = false,
  outOfStock = false,
  url,
  badges,
  specs,
  features = [],
  extra,
  info,
  infoLabel = "Server Info",
}: PlanCardProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card/30 backdrop-blur-sm transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5",
        popular ? "border-primary/40 hover:border-primary/60" : "border-border/50 hover:border-border",
        outOfStock && "opacity-60",
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20 whitespace-nowrap">
          <Star className="w-3 h-3" />
          Most Popular
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-mono text-base font-bold tracking-tight uppercase truncate" title={name}>
              {name}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-8" title={subtitle ?? undefined}>
              {subtitle}
            </p>
          </div>
          <div className="text-right shrink-0">
            <Price amount={priceGBP} prices={prices} className="text-2xl font-bold tabular-nums" />
            <p className="text-xs text-muted-foreground">/month</p>
          </div>
        </div>

        {(badges || outOfStock) && (
          <div className="flex flex-wrap gap-1.5">
            {badges}
            {outOfStock && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-destructive/30 text-destructive bg-destructive/10">
                Out of Stock
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {specs.map((spec, index) => (
            <div
              key={`${spec.label}-${index}`}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-border/40 bg-muted/20 px-3 py-2 min-w-0",
                specs.length % 2 === 1 && index === specs.length - 1 && "col-span-2",
              )}
            >
              <spec.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate" title={spec.value}>
                  {spec.value}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight truncate" title={spec.label}>
                  {spec.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {features.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon className="w-3 h-3 text-primary" />
                {text}
              </span>
            ))}
          </div>
        )}

        {extra}

        <div className="mt-auto space-y-4">
          {info && (
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>
                    {infoOpen ? "Hide" : "View"} {infoLabel}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", infoOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-2 border-t border-border/40 mt-3">{info}</CollapsibleContent>
            </Collapsible>
          )}

          <Button
            size="sm"
            variant={outOfStock ? "outline" : "default"}
            className="w-full gap-2 rounded-lg"
            disabled={outOfStock}
            asChild={!outOfStock}
          >
            {outOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer">
                Order Now <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
