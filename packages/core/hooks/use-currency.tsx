"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import {
  type CurrencyCode,
  currencies,
  currencyList,
  formatPrice,
  getDefaultCurrency,
  CURRENCY_STORAGE_KEY,
} from "@/lib/currency"

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  convert: (amountGBP: number) => number
  format: (amount: number) => string
  convertAndFormat: (amountGBP: number) => string
  currencies: typeof currencies
  currencyList: typeof currencyList
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

// Build a rates lookup from the static currency definitions as initial fallback
function buildFallbackRates(): Record<CurrencyCode, number> {
  return Object.fromEntries(
    Object.entries(currencies).map(([code, c]) => [code, c.rate])
  ) as Record<CurrencyCode, number>
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP")
  const [mounted, setMounted] = useState(false)
  const [liveRates, setLiveRates] = useState<Record<CurrencyCode, number>>(buildFallbackRates)

  // Initialize currency from localStorage or browser locale, and fetch live rates
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null
    if (stored && currencies[stored]) {
      setCurrencyState(stored)
    } else {
      setCurrencyState(getDefaultCurrency())
    }

    // Fetch live exchange rates — falls back to cached or static if unavailable
    const RATES_CACHE_KEY = "nb_currency_rates"
    const RATES_CACHE_TTL = 3600_000 // 1 hour in ms

    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY)
      if (cached) {
        const { rates, ts } = JSON.parse(cached) as { rates: Record<string, number>; ts: number }
        if (Date.now() - ts < RATES_CACHE_TTL) {
          setLiveRates((prev) => {
            const updated = { ...prev }
            for (const [code, rate] of Object.entries(rates)) {
              if (code in updated) updated[code as CurrencyCode] = rate
            }
            return updated
          })
          return // skip network fetch — cache is fresh
        }
      }
    } catch {
      // corrupted cache entry — ignore and fall through to fetch
    }

    fetch("/api/currency/rates")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (data.rates) {
          try {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now() }))
          } catch {
            // localStorage quota exceeded — ignore
          }
          setLiveRates((prev) => {
            const updated = { ...prev }
            for (const [code, rate] of Object.entries(data.rates!)) {
              if (code in updated) updated[code as CurrencyCode] = rate
            }
            return updated
          })
        }
      })
      .catch(() => {
        // Silently fall back to static rates already in state
      })
  }, [])

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
  }, [])

  const convert = useCallback(
    (amountGBP: number) => Math.round(amountGBP * liveRates[currency] * 100) / 100,
    [currency, liveRates]
  )

  const format = useCallback(
    (amount: number) => formatPrice(amount, currency),
    [currency]
  )

  const convertAndFormatFn = useCallback(
    (amountGBP: number) => formatPrice(Math.round(amountGBP * liveRates[currency] * 100) / 100, currency),
    [currency, liveRates]
  )

  // Prevent hydration mismatch by returning GBP during SSR
  const value: CurrencyContextValue = {
    currency: mounted ? currency : "GBP",
    setCurrency,
    convert,
    format: mounted ? format : (amount) => formatPrice(amount, "GBP"),
    convertAndFormat: mounted ? convertAndFormatFn : (amount) => formatPrice(amount, "GBP"),
    currencies,
    currencyList,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
