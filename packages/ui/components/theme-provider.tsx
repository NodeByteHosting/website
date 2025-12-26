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
      themes={["light", "dark", "slate", "midnight", "rose", "crimson", "forest", "emerald", "desert", "amber", "ocean", "teal", "lavender", "violet", "stranger", "christmas", "newyear", "system"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
