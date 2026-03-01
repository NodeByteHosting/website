'use client'

import * as React from 'react'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark", "slate", "midnight", "rose", "crimson", "forest", "emerald", "desert", "amber", "ocean", "teal", "lavender", "violet", "stranger", "christmas", "newyear", "catppuccin-mocha", "catppuccin-macchiato", "catppuccin-frappe", "catppuccin-latte", "dracula", "nord", "gruvbox", "solarized", "tokyo-night", "one-dark", "rose-pine", "system"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
