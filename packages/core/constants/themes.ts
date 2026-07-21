/**
 * Single source of truth for every theme the site offers — used by the
 * theme picker (packages/ui/components/theme-toggle.tsx) and the brand/press
 * kit page (/brand). Each entry: value (next-themes key), label, bg swatch,
 * accent swatch. Keep in sync with the actual CSS variable blocks in
 * app/globals.css.
 */
export const THEMES = {
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

export type ThemeEntry = { value: string; label: string; bg: string; accent: string }

export const THEME_SECTIONS: { key: keyof typeof THEMES; label: string }[] = [
  { key: "catppuccin", label: "Catppuccin" },
  { key: "popular",    label: "Popular"    },
  { key: "palette",    label: "Palette"    },
  { key: "seasonal",   label: "Seasonal"   },
]

export const ALL_THEME_ENTRIES: ThemeEntry[] = Object.values(THEMES).flat()
