"use client"

import { useState, useEffect, createContext, useContext, useSyncExternalStore, type ReactNode } from "react"
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

function buildFallbackRates(): Record<CurrencyCode, number> {
  return Object.fromEntries(
    Object.entries(currencies).map(([code, c]) => [code, c.rate])
  ) as Record<CurrencyCode, number>
}

function getInitialCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return "GBP"
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null
    if (stored && currencies[stored]) return stored
  } catch {}
  return getDefaultCurrency()
}

const RATES_CACHE_KEY = "nb_currency_rates"
const RATES_CACHE_TTL = 3600_000

function buildLiveRatesFromCache(): Record<CurrencyCode, number> {
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY)
    if (cached) {
      const { rates, ts } = JSON.parse(cached) as { rates: Record<string, number>; ts: number }
      if (Date.now() - ts < RATES_CACHE_TTL) {
        const merged = buildFallbackRates()
        for (const [code, rate] of Object.entries(rates)) {
          if (code in merged) merged[code as CurrencyCode] = rate
        }
        return merged
      }
    }
  } catch {}
  return buildFallbackRates()
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency)
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [liveRates, setLiveRates] = useState<Record<CurrencyCode, number>>(buildLiveRatesFromCache)

  // Fetch live exchange rates
  useEffect(() => {
    fetch("/api/currency/rates")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (data.rates) {
          try {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now() }))
          } catch {}
          setLiveRates((prev) => {
            const updated = { ...prev }
            for (const [code, rate] of Object.entries(data.rates!)) {
              if (code in updated) updated[code as CurrencyCode] = rate
            }
            return updated
          })
        }
      })
      .catch(() => {})
  }, [])

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    try { localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency) } catch {}
  }

  const convert = (amountGBP: number) => Math.round(amountGBP * liveRates[currency] * 100) / 100

  const format = (amount: number) => formatPrice(amount, currency)

  const convertAndFormatFn = (amountGBP: number) =>
    formatPrice(Math.round(amountGBP * liveRates[currency] * 100) / 100, currency)

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
