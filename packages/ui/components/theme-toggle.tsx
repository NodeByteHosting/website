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

// ─── Theme registry ──────────────────────────────────────────────────────────
// Each entry: value (next-themes key), label, bg swatch, accent swatch

const THEMES = {
  catppuccin: [
    { value: "catppuccin-mocha",     label: "Mocha",     bg: "#1e1e2e", accent: "#cba6f7" },
    { value: "catppuccin-macchiato", label: "Macchiato", bg: "#24273a", accent: "#c6a0f6" },
    { value: "catppuccin-frappe",    label: "Frappé",    bg: "#303446", accent: "#ca9ee6" },
    { value: "catppuccin-latte",     label: "Latte",     bg: "#eff1f5", accent: "#8839ef" },
  ],
  popular: [
    { value: "dracula",     label: "Dracula",     bg: "#282a36", accent: "#bd93f9" },
    { value: "nord",        label: "Nord",        bg: "#2e3440", accent: "#88c0d0" },
    { value: "gruvbox",     label: "Gruvbox",     bg: "#282828", accent: "#d79921" },
    { value: "solarized",   label: "Solarized",   bg: "#002b36", accent: "#268bd2" },
    { value: "tokyo-night", label: "Tokyo Night", bg: "#1a1b26", accent: "#7aa2f7" },
    { value: "one-dark",    label: "One Dark",    bg: "#282c34", accent: "#61afef" },
    { value: "rose-pine",   label: "Rosé Pine",   bg: "#191724", accent: "#c4a7e7" },
    { value: "kanagawa",    label: "Kanagawa",    bg: "#1f1f28", accent: "#e46876" },
    { value: "everforest",  label: "Everforest",  bg: "#2d353b", accent: "#a7c080" },
    { value: "monokai",     label: "Monokai",     bg: "#272822", accent: "#a6e22e" },
  ],
  palette: [
    { value: "slate",    label: "Slate",    bg: "#1e293b", accent: "#38bdf8" },
    { value: "ocean",    label: "Ocean",    bg: "#0c4a6e", accent: "#22d3ee" },
    { value: "midnight", label: "Midnight", bg: "#0f172a", accent: "#6366f1" },
    { value: "teal",     label: "Teal",     bg: "#134e4a", accent: "#14b8a6" },
    { value: "lavender", label: "Lavender", bg: "#2e1065", accent: "#a855f7" },
    { value: "violet",   label: "Violet",   bg: "#4c1d95", accent: "#8b5cf6" },
    { value: "rose",     label: "Rose",     bg: "#4c0519", accent: "#fb7185" },
    { value: "amber",    label: "Amber",    bg: "#78350f", accent: "#f59e0b" },
    { value: "desert",   label: "Desert",   bg: "#451a03", accent: "#c2410c" },
    { value: "forest",   label: "Forest",   bg: "#14532d", accent: "#22c55e" },
    { value: "emerald",  label: "Emerald",  bg: "#064e3b", accent: "#10b981" },
    { value: "crimson",  label: "Crimson",  bg: "#1a0a0f", accent: "#dc2626" },
    { value: "cobalt",   label: "Cobalt",   bg: "#0a1628", accent: "#3b82f6" },
    { value: "sakura",   label: "Sakura",   bg: "#1a0f14", accent: "#f472b6" },
    { value: "copper",   label: "Copper",   bg: "#1c1208", accent: "#b45309" },
    { value: "abyss",    label: "Abyss",    bg: "#000c1a", accent: "#0ea5e9" },
  ],
  seasonal: [
    // ── Winter / Holidays ──
    { value: "christmas",   label: "Christmas",   bg: "#0d1f0f", accent: "#c4122e" },
    { value: "newyear",     label: "New Year",    bg: "#0a0808", accent: "#ffd166" },
    { value: "winter",      label: "Winter",      bg: "#0d1b2a", accent: "#93c5fd" },
    // ── Spring ──
    { value: "stpatricks",  label: "St. Pat's",   bg: "#052e16", accent: "#4ade80" },
    { value: "easter",      label: "Easter",      bg: "#fdf4ff", accent: "#c084fc" },
    { value: "spring",      label: "Spring",      bg: "#fafff7", accent: "#86efac" },
    // ── Summer ──
    { value: "summer",      label: "Summer",      bg: "#0c1f3a", accent: "#facc15" },
    { value: "fourthjuly",  label: "4th July",    bg: "#030712", accent: "#f87171" },
    // ── Autumn ──
    { value: "halloween",   label: "Halloween",   bg: "#0d0208", accent: "#f97316" },
    { value: "autumn",      label: "Autumn",      bg: "#1c0f00", accent: "#ea580c" },
    { value: "thanksgiving",label: "Thanks.",     bg: "#1a0f00", accent: "#d97706" },
    // ── Other ──
    { value: "valentines",  label: "Valentine's", bg: "#1a0007", accent: "#f43f5e" },
    { value: "stranger",    label: "Stranger",    bg: "#0a0a0a", accent: "#ff2d55" },
  ],
} as const

type ThemeEntry = { value: string; label: string; bg: string; accent: string }

const SECTIONS: { key: keyof typeof THEMES; label: string }[] = [
  { key: "catppuccin", label: "Catppuccin" },
  { key: "popular",    label: "Popular"    },
  { key: "palette",    label: "Palette"    },
  { key: "seasonal",   label: "Seasonal"   },
]

const ALL_ENTRIES: ThemeEntry[] = Object.values(THEMES).flat()

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
        <DropdownMenuContent align="end" sideOffset={8} className="w-88 p-0 overflow-hidden">

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
          <div className="px-3 py-3 space-y-4 max-h-[58vh] overflow-y-auto">
            {SECTIONS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  {label}
                </p>
                <div className="grid grid-cols-5 gap-0.5">
                  {(THEMES[key] as ThemeEntry[]).map((entry) => (
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

