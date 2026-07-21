"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Button } from "@/packages/ui/components/ui/button"
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, THEME_SECTIONS as SECTIONS, ALL_THEME_ENTRIES as ALL_ENTRIES, type ThemeEntry } from "@/packages/core/constants/themes"

// ─── Swatch ──────────────────────────────────────────────────────────────────

function ThemeSwatch({ theme, isSelected, onClick }: {
  theme: ThemeEntry
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={theme.label}
      className={cn(
        "relative flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-150",
        isSelected
          ? "bg-primary/10 ring-2 ring-primary ring-offset-1 ring-offset-background"
          : "hover:bg-accent/30",
      )}
    >
      {/* Two-tone swatch: main bg top, accent strip bottom */}
      <span className="relative w-9 h-9 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/10 shrink-0">
        <span className="absolute inset-0" style={{ background: theme.bg }} />
        <span className="absolute bottom-0 left-0 right-0 h-[36%]" style={{ background: theme.accent }} />
        {isSelected && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
            <Check className="w-3.5 h-3.5 text-white drop-shadow" />
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium leading-tight text-center w-full truncate px-0.5">
        {theme.label}
      </span>
    </button>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const selected = theme ?? "system"
  const display = selected === "system" ? resolvedTheme : selected
  const TriggerIcon = mounted
    ? display === "light" ? Sun : display === "dark" ? Moon : Palette
    : Palette

  const currentEntry = ALL_ENTRIES.find((e) => e.value === selected)
  const currentLabel = selected === "light" ? "Light" : selected === "dark" ? "Dark" : selected === "system" ? "System" : currentEntry?.label ?? "System"

  const handleThemeChange = (v: string) => {
    try {
      const allValues = [...ALL_ENTRIES.map((e) => e.value), "light", "dark", "system"]
      const html = document.documentElement
      allValues.forEach((c) => html.classList.remove(c))
      document.cookie = `theme=${encodeURIComponent(v)};path=/;max-age=${60 * 60 * 24 * 365}`
      localStorage.setItem("theme", v)
    } catch {}
    setTheme(v)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full hover:bg-accent/80 transition-colors",
            !mounted && "opacity-0 pointer-events-none",
          )}
          aria-label={t("theme.toggle")}
        >
          <TriggerIcon className="h-[1.2rem] w-[1.2rem] transition-transform hover:rotate-12" />
        </Button>
      </DropdownMenuTrigger>

      {mounted && (
        <DropdownMenuContent align="end" sideOffset={8} className="w-88 p-0 overflow-hidden max-h-[85svh] flex flex-col">

          {/* ── Header ── */}
          <div className="px-4 pt-3.5 pb-3 border-b border-border/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold leading-none">Appearance</p>
              <p className="text-xs text-muted-foreground">{currentLabel}</p>
            </div>
            <Palette className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* ── Quick mode row ── */}
          <div className="px-3 py-3 flex gap-2">
            {(
              [
                { value: "light",  label: "Light",  Icon: Sun     },
                { value: "dark",   label: "Dark",   Icon: Moon    },
                { value: "system", label: "System", Icon: Monitor },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all duration-150",
                  selected === value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-border hover:bg-accent/30 hover:text-foreground",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* ── Theme sections ── */}
          <div className="px-3 py-3 space-y-4 flex-1 min-h-0 overflow-y-auto">
            {SECTIONS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  {label}
                </p>
                <div className="grid grid-cols-5 gap-0.5">
                  {(THEMES[key] as readonly ThemeEntry[]).map((entry) => (
                    <ThemeSwatch
                      key={entry.value}
                      theme={entry}
                      isSelected={selected === entry.value}
                      onClick={() => handleThemeChange(entry.value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

