"use client"

import { useState } from "react"
import { useLocale } from "@/packages/core/hooks/use-locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Check, ChevronDown, Globe, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import * as Flags from "country-flag-icons/react/3x2"
import type { Locale } from "@/packages/i18n/config"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"

// Map locale codes to country codes for flags
const localeFlagComponents: Record<Locale, React.ComponentType<{ className?: string }>> = {
  'en': Flags.GB,
  'af-ZA': Flags.ZA,
  'ar-SA': Flags.SA,
  'ca-ES': Flags.ES,
  'cs-CZ': Flags.CZ,
  'da-DK': Flags.DK,
  'de-DE': Flags.DE,
  'el-GR': Flags.GR,
  'es-ES': Flags.ES,
  'fi-FI': Flags.FI,
  'fr-FR': Flags.FR,
  'he-IL': Flags.IL,
  'hu-HU': Flags.HU,
  'it-IT': Flags.IT,
  'ja-JP': Flags.JP,
  'ko-KR': Flags.KR,
  'nl-NL': Flags.NL,
  'no-NO': Flags.NO,
  'pl-PL': Flags.PL,
  'pt-BR': Flags.BR,
  'pt-PT': Flags.PT,
  'ro-RO': Flags.RO,
  'ru-RU': Flags.RU,
  'sr-SP': Flags.RS,
  'sv-SE': Flags.SE,
  'tr-TR': Flags.TR,
  'uk-UA': Flags.UA,
  'vi-VN': Flags.VN,
  'zh-CN': Flags.CN,
  'zh-TW': Flags.TW,
}

function FlagIcon({ loc, className: flagClassName }: { loc: Locale; className?: string }) {
  const FlagComponent = localeFlagComponents[loc]
  return FlagComponent ? <FlagComponent className={flagClassName} /> : null
}

// Group locales by region for better organization
const localeRegions: Record<string, Locale[]> = {
  'Popular': ['en', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR'],
  'Europe': ['nl-NL', 'it-IT', 'pl-PL', 'cs-CZ', 'da-DK', 'fi-FI', 'el-GR', 'hu-HU', 'no-NO', 'pt-PT', 'ro-RO', 'ru-RU', 'sr-SP', 'sv-SE', 'uk-UA', 'ca-ES'],
  'Asia': ['ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'vi-VN', 'ar-SA', 'he-IL', 'tr-TR'],
  'Africa': ['af-ZA'],
}

interface LanguageSelectorProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

export function LanguageSelector({ 
  className, 
  variant = "outline", 
  size = "sm",
  showLabel = false,
}: LanguageSelectorProps) {
  const { locale, setLocale, locales, localeNames } = useLocale()
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  // Filter locales based on search
  const filteredLocales = search
    ? locales.filter(loc => 
        localeNames[loc].toLowerCase().includes(search.toLowerCase()) ||
        loc.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-1.5", showLabel ? "px-3" : "px-2", className)}>
          <FlagIcon loc={locale} className="h-4 w-5 rounded-sm object-cover" />
          {showLabel && <span className="hidden sm:inline text-xs">{localeNames[locale]}</span>}
          <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform", open && "rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {filteredLocales ? (
            // Search results
            <div className="p-1">
              {filteredLocales.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No languages found
                </div>
              ) : (
                filteredLocales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => {
                      setLocale(loc)
                      setSearch("")
                      setOpen(false)
                    }}
                    className="flex items-center justify-between cursor-pointer rounded-md"
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagIcon loc={loc} className="h-4 w-5 rounded-sm object-cover" />
                      <span className="font-medium">{localeNames[loc]}</span>
                    </span>
                    {locale === loc && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          ) : (
            // Grouped by region
            <div className="p-1">
              {Object.entries(localeRegions).map(([region, regionLocales]) => {
                const availableLocales = regionLocales.filter(loc => locales.includes(loc))
                if (availableLocales.length === 0) return null
                
                return (
                  <div key={region}>
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
                      {region}
                    </DropdownMenuLabel>
                    {availableLocales.map((loc) => (
                      <DropdownMenuItem
                        key={loc}
                        onClick={() => {
                          setLocale(loc)
                          setOpen(false)
                        }}
                        className="flex items-center justify-between cursor-pointer rounded-md mx-1"
                      >
                        <span className="flex items-center gap-2.5">
                          <FlagIcon loc={loc} className="h-4 w-5 rounded-sm object-cover" />
                          <span>{localeNames[loc]}</span>
                        </span>
                        {locale === loc && <Check className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        
        {/* Footer with current selection + contribute links */}
        <div className="border-t p-2 bg-muted/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>Current: <span className="font-medium text-foreground">{localeNames[locale]}</span></span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Want to help translate?{" "}
            <a
              href="https://crowdin.com/project/nodebyte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Crowdin
            </a>
            {" · "}
            <a
              href="https://github.com/NodeByteHosting/translations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
