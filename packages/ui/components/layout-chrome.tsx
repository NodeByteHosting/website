"use client"

import { Navigation } from "@/packages/ui/components/Static/navigation"
import { Footer } from "@/packages/ui/components/Static/footer"

interface LayoutChromeProps {
  children: React.ReactNode
  gamesNav?: { slug: string; name: string }[]
}

/**
 * Client component that wraps pages with navigation and footer.
 */
export function LayoutChrome({ children, gamesNav }: LayoutChromeProps) {
  return (
    <>
      <Navigation gamesNav={gamesNav} />
      <main className="relative min-h-screen overflow-hidden">
        {children}
      </main>
      <Footer />
    </>
  )
}

