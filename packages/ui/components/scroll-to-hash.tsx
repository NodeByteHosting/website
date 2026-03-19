"use client"

import { useEffect } from "react"

export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [])

  return null
}
