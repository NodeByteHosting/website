"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/packages/ui/components/Static/navigation"
import { Footer } from "@/packages/ui/components/Static/footer"
import { useEffect, useState } from "react"

interface LayoutChromeProps {
  children: React.ReactNode
}

/**
 * Client component that handles showing/hiding the navigation and footer
 * based on the current route. This needs to be a client component to properly
 * react to client-side navigation changes.
 */
export function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Hide navigation and footer on admin and dashboard routes
  const hideChrome = pathname.startsWith("/admin") || pathname.startsWith("/dashboard")

  // Only render Navigation/Footer after hydration to prevent mismatch
  return (
    <>
      {!hideChrome && mounted && <Navigation />}
      <main className="relative min-h-screen overflow-hidden">
        {children}
      </main>
      {!hideChrome && mounted && <Footer />}
    </>
  )
}

