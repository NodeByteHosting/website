"use client"

import { Navigation } from "@/packages/ui/components/Static/navigation"
import { Footer } from "@/packages/ui/components/Static/footer"

interface LayoutChromeProps {
  children: React.ReactNode
}

/**
 * Client component that wraps pages with navigation and footer.
 */
export function LayoutChrome({ children }: LayoutChromeProps) {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden">
        {children}
      </main>
      <Footer />
    </>
  )
}

