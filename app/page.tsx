"use client"

import { useEffect } from "react"
import { Hero } from "@/packages/ui/components/Layouts/Home/hero"
import { Features } from "@/packages/ui/components/Layouts/Home/features"
import { About } from "@/packages/ui/components/Layouts/Home/about"
import { Services } from "@/packages/ui/components/Layouts/Home/services"
import { FAQ } from "@/packages/ui/components/Layouts/Home/faq"

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
    <>
      <Hero />
      <About />
      <Features />
      <Services />
      <FAQ />
    </>
  )
}