"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { conversions } from "@/packages/core/lib/gtag"

/**
 * Fires the Google Ads page-view conversion on every client-side route change.
 * Must be rendered inside the root layout (client boundary).
 */
export function GoogleAdsPageView() {
  const pathname = usePathname()

  useEffect(() => {
    conversions.pageView()
  }, [pathname])

  return null
}
