"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Button } from "@/packages/ui/components/ui/button"
import { Sun, Moon, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const allThemes = {
  featured: [
    { value: "dark", label: "Dark", icon: Moon, color: "#0a0a0a", description: "Dark theme for low-light environments" },
    { value: "slate", label: "Slate", icon: Palette, color: "#1e293b", description: "Cool slate color palette" },
    { value: "ocean", label: "Ocean", icon: Palette, color: "#0c4a6e", description: "Calming ocean blue tones" },
  ],
  base: [
    { value: "light", label: "Light", icon: Sun, color: "#ffffff", description: "Light theme for daytime" },
    { value: "system", label: "System", icon: Palette, color: "linear-gradient(135deg, #ffffff 50%, #0a0a0a 50%)", description: "Follow system preference" },
  ],
  cool: [
    { value: "midnight", label: "Midnight", color: "#0f172a" },
    { value: "teal", label: "Teal", color: "#134e4a" },
  ],
  warm: [
    { value: "rose", label: "Rose", color: "#4c0519" },
    { value: "amber", label: "Amber", color: "#78350f" },
    { value: "desert", label: "Desert", color: "#451a03" },
  ],
  nature: [
    { value: "forest", label: "Forest", color: "#14532d" },
    { value: "emerald", label: "Emerald", color: "#064e3b" },
    { value: "lavender", label: "Lavender", color: "#2e1065" },
    { value: "violet", label: "Violet", color: "#4c1d95" },
  ],
  special: [
    { value: "stranger", label: "Stranger", color: "#ff2d55" },
    { value: "christmas", label: "Christmas", color: "#c4122e" },
    { value: "newyear", label: "NewYear", color: "#ffd166" },
  ],
}

interface ThemeOption {
  value: string
  label: string
  color: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

function ThemeColorSwatch({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-5 h-5 rounded-lg ring-2 ring-offset-2 ring-offset-background transition-all",
        isSelected ? "ring-primary scale-110 shadow-lg" : "ring-transparent hover:ring-primary/50"
      )}
      style={{ background: color }}
    />
  )
}

function ThemeCard({
  theme,
  isSelected,
  onClick,
}: {
  theme: ThemeOption
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = theme.icon
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all text-left group",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/20"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon className="w-5 h-5 text-primary" />
          ) : (
            <ThemeColorSwatch color={theme.color} isSelected={isSelected} />
          )}
          <div>
            <p className="font-semibold text-sm">{theme.label}</p>
            {theme.description && (
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            )}
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />}
      </div>
      {!Icon && (
        <div
          className="w-full h-2 rounded-full"
          style={{ background: theme.color }}
        />
      )}
    </button>
  )
}

function ThemeGridItem({
  theme,
  isSelected,
  onClick,
}: {
  theme: ThemeOption
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={theme.label}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-lg transition-all group",
        isSelected
          ? "bg-primary/10 ring-2 ring-primary"
          : "hover:bg-accent/20"
      )}
    >
      <ThemeColorSwatch color={theme.color} isSelected={isSelected} />
      <span className="text-xs font-medium text-center">{theme.label}</span>
    </button>
  )
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0">
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  const selected = theme ?? "system"
  const display = selected === "system" ? resolvedTheme : selected

  const Icon = display === "light" ? Sun : display === "dark" ? Moon : Palette

  const handleThemeChange = (v: string) => {
    try {
      const allThemeValues = [
        ...allThemes.featured.map(t => t.value),
        ...allThemes.base.map(t => t.value),
        ...allThemes.cool.map(t => t.value),
        ...allThemes.warm.map(t => t.value),
        ...allThemes.nature.map(t => t.value),
        ...allThemes.special.map(t => t.value),
      ]
      const html = typeof document !== "undefined" ? document.documentElement : null
      if (html) allThemeValues.forEach(c => html.classList.remove(c))
      document.cookie = `theme=${encodeURIComponent(v)};path=/;max-age=${60 * 60 * 24 * 365}`
      localStorage.setItem("theme", v)
    } catch (e) {}
    setTheme(v)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-accent/80 transition-colors"
          aria-label={t("theme.toggle")}
        >
          <Icon className="h-[1.2rem] w-[1.2rem] transition-transform hover:rotate-12" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-4"
        sideOffset={8}
      >
        {/* Featured Themes (Top 3) */}
        <div className="space-y-3 mb-4">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("theme.appearance")}
          </DropdownMenuLabel>
          {allThemes.featured.map((themeOption) => (
            <ThemeCard
              key={themeOption.value}
              theme={themeOption}
              isSelected={selected === themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
            />
          ))}
        </div>

        <DropdownMenuSeparator className="my-4" />

        {/* Base Themes */}
        <div className="space-y-3 mb-4">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Basic
          </DropdownMenuLabel>
          <div className="grid grid-cols-2 gap-2">
            {allThemes.base.map((themeOption) => (
              <ThemeGridItem
                key={themeOption.value}
                theme={themeOption}
                isSelected={selected === themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
              />
            ))}
          </div>
        </div>

        {/* Cool Tones */}
        <div className="space-y-3 mb-4">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("theme.coolTones")}
          </DropdownMenuLabel>
          <div className="grid grid-cols-4 gap-2">
            {allThemes.cool.map((themeOption) => (
              <ThemeGridItem
                key={themeOption.value}
                theme={themeOption}
                isSelected={selected === themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
              />
            ))}
          </div>
        </div>

        {/* Warm Tones */}
        <div className="space-y-3 mb-4">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("theme.warmTones")}
          </DropdownMenuLabel>
          <div className="grid grid-cols-4 gap-2">
            {allThemes.warm.map((themeOption) => (
              <ThemeGridItem
                key={themeOption.value}
                theme={themeOption}
                isSelected={selected === themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
              />
            ))}
          </div>
        </div>

        {/* Nature Themes */}
        <div className="space-y-3 mb-4">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("theme.nature")}
          </DropdownMenuLabel>
          <div className="grid grid-cols-4 gap-2">
            {allThemes.nature.map((themeOption) => (
              <ThemeGridItem
                key={themeOption.value}
                theme={themeOption}
                isSelected={selected === themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
              />
            ))}
          </div>
        </div>

        {/* Special Themes */}
        <div className="space-y-3">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Special
          </DropdownMenuLabel>
          <div className="grid grid-cols-3 gap-2">
            {allThemes.special.map((themeOption) => (
              <ThemeGridItem
                key={themeOption.value}
                theme={themeOption}
                isSelected={selected === themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
