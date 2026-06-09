"use client"

import { useEffect } from "react"

export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.substring(1)
    const timer = setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return null
}
