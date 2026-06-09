"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { locales, localeNames, localeFlags, defaultLocale, LOCALE_COOKIE, type Locale } from "@/packages/i18n/config"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  locales: typeof locales
  localeNames: typeof localeNames
  localeFlags: typeof localeFlags
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(initialLocale?: Locale): Locale {
  if (typeof window === 'undefined') return initialLocale || defaultLocale
  try {
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split('=')[1] as Locale | undefined
    if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale
  } catch {}
  return initialLocale || defaultLocale
}

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale(initialLocale))

  const setLocale = (newLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    setLocaleState(newLocale)
    window.location.reload()
  }

  const value: LocaleContextValue = {
    locale,
    setLocale,
    locales,
    localeNames,
    localeFlags,
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}

