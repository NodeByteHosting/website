"use client"

import { useState } from "react"
import { useCurrency } from "@/packages/core/hooks/use-currency"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Button } from "@/packages/ui/components/ui/button"
import { ChevronDown, Check, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

// Import flag components
import { GB, US, EU, CA, AU } from "country-flag-icons/react/3x2"
import type { ElementType } from "react"

// Currency to flag component mapping
const currencyFlags: Record<string, ElementType> = {
  GBP: GB,
  USD: US,
  EUR: EU,
  CAD: CA,
  AUD: AU,
}

interface PriceProps {
  /** Price in GBP (base currency) — used as fallback when the selected currency has no native billing price */
  amount: number
  /** Native billing prices per currency code from the billing panel, e.g. { GBP: 4, EUR: 4.59, USD: 5.37 } */
  prices?: Record<string, number>
  className?: string
  showOriginal?: boolean
}

/**
 * Display a price that automatically converts to the user's selected currency.
 * When `prices` is provided, uses the billing panel's exact price for the selected
 * currency instead of applying an exchange rate to the GBP amount.
 */
export function Price({ amount, prices, className, showOriginal = false }: PriceProps) {
  const { convertAndFormat, format, currency } = useCurrency()

  const displayed = prices?.[currency] !== undefined
    ? format(prices[currency])
    : convertAndFormat(amount)

  return (
    <span className={className}>
      {displayed}
      {showOriginal && currency !== "GBP" && (
        <span className="text-muted-foreground text-sm ml-1">(£{amount})</span>
      )}
    </span>
  )
}

interface CurrencySelectorProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

/**
 * Dropdown to select preferred currency
 */
export function CurrencySelector({ 
  className, 
  variant = "outline", 
  size = "sm",
  showLabel = false,
}: CurrencySelectorProps) {
  const { currency, setCurrency, currencyList, currencies } = useCurrency()
  const [open, setOpen] = useState(false)
  const current = currencies[currency]
  const CurrentFlag = currencyFlags[currency]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-1.5", showLabel ? "px-3" : "px-2", className)}>
          <CurrentFlag className="h-4 w-5 rounded-sm object-cover" />
          <span className="font-medium">{current.symbol}</span>
          {showLabel && <span className="hidden sm:inline text-xs">{current.code}</span>}
          <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform", open && "rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
          Select Currency
        </DropdownMenuLabel>
        {currencyList.map((curr) => {
          const FlagIcon = currencyFlags[curr.code]
          return (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => {
                setCurrency(curr.code)
                setOpen(false)
              }}
              className={cn(
                "group flex items-center justify-between cursor-pointer rounded-md mx-1 mb-0.5",
                currency === curr.code && "bg-accent text-accent-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <FlagIcon className="h-4 w-5 rounded-sm object-cover" />
                <div className="flex flex-col">
                  <span className={cn("font-medium", currency === curr.code && "text-accent-foreground")}>{curr.name}</span>
                  <span className={cn("text-xs transition-colors", currency === curr.code ? "text-accent-foreground/70" : "text-muted-foreground group-hover:text-accent-foreground/70 group-focus:text-accent-foreground/70")}>{curr.symbol} {curr.code}</span>
                </div>
              </span>
              {currency === curr.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
        
        {/* Footer */}
        <div className="border-t mt-1 pt-2 px-2 pb-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5" />
            <span>Prices shown in <span className="font-medium text-foreground">{current.code}</span></span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
