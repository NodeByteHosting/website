"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Cloud, Star } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <Button size="sm" className="opacity-0 pointer-events-none">...</Button>

  // Determine selected theme string (what user explicitly chose)
  const selected = theme ?? "system"

  // For display icon use resolvedTheme when user chose 'system'
  const display = selected === "system" ? resolvedTheme : selected

  const Icon = display === "light" ? Sun : display === "dark" ? Moon : display === "slate" ? Cloud : display === "midnight" ? Star : display === "rose" ? Sun : display === "forest" ? Cloud : display === "desert" ? Monitor : display === "ocean" ? Star : Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Open theme menu">
          <Icon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={selected} onValueChange={(v: string) => {
          try {
            const known = ["light","dark","slate","midnight","rose","forest","desert","ocean"]
            const html = typeof document !== 'undefined' ? document.documentElement : null
            if (html) known.forEach(c => html.classList.remove(c))
            // persist to cookie and localStorage for SSR and later loads
            document.cookie = `theme=${encodeURIComponent(v)};path=/;max-age=${60*60*24*365}`
            localStorage.setItem('theme', v)
          } catch (e) {}
          setTheme(v)
        }}>
          <DropdownMenuRadioItem value="light">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Light</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--background)" }} />
              <span>Dark</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="midnight">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Midnight</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rose">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Rose</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="forest">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Forest</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desert">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Desert</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ocean">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "var(--card)" }} />
              <span>Ocean</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <div className="flex items-center">
              <span className="inline-block w-5 h-3 rounded mr-3 border" style={{ background: "transparent" }} />
              <span>System</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
