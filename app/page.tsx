"use client"

import { useEffect } from "react"
import { Hero } from "@/components/Layouts/Home/hero"
import { Features } from "@/components/Layouts/Home/features"
import { About } from "@/components/Layouts/Home/about"
import { Download } from "@/components/Layouts/Home/games"
import { FAQ } from "@/components/Layouts/Home/faq"
import { Footer } from "@/components/Static/footer"
import { Navigation } from "@/components/Static/navigation"

export default function Home() {
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        // Remove the # symbol
        const id = hash.substring(1)
        // Scroll to the element after a short delay to ensure the page is fully loaded
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navigation />
      <Hero />
      <Features />
      <FAQ />
      <About />
      <Download />
      <Footer />
    </main>
  )
}