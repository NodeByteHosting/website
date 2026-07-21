"use client"

import Link from "next/link"
import {
  Palette,
  Download,
  ArrowRight,
  Type,
  MessageSquare,
  Ban,
  Ruler,
  Move,
  Sparkles,
} from "lucide-react"
import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Logo } from "@/packages/ui/components/logo"
import { ColorSwatch } from "@/packages/ui/components/Layouts/Brand/color-swatch"
import { THEMES, THEME_SECTIONS } from "@/packages/core/constants/themes"
import { LINKS } from "@/packages/core/constants/links"

const NAV_SECTIONS = [
  { id: "logo", label: "Logo" },
  { id: "background", label: "Background" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "voice", label: "Name & Voice" },
]

const CORE_COLORS = {
  light: {
    background: "oklch(0.98 0.01 260)",
    foreground: "oklch(0.12 0.01 260)",
    primary: "oklch(0.28 0.12 230)",
    accent: "oklch(0.65 0.15 200)",
  },
  dark: {
    background: "oklch(0.155 0.03 235)",
    foreground: "oklch(0.97 0.02 230)",
    primary: "oklch(0.45 0.12 235)",
    accent: "oklch(0.55 0.12 200)",
  },
}

const LOGO_DOS_DONTS = [
  { icon: Ruler, text: "Keep clear space around the mark equal to at least the height of the \"N\"." },
  { icon: Move, text: "Don't stretch, skew, or rotate the logo." },
  { icon: Ban, text: "Don't recolor the mark or apply drop shadows/outlines/gradients to it." },
  { icon: Sparkles, text: "On nodebyte.host the mark auto-adapts to the active theme — outside the site, use the static SVG/PNG as-is." },
]

function ThemeColorCard({ entry }: { entry: { value: string; label: string; bg: string; accent: string } }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
      <span className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-black/10 shadow-sm">
        <span className="absolute inset-0" style={{ background: entry.bg }} />
        <span className="absolute bottom-0 left-0 right-0 h-[38%]" style={{ background: entry.accent }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{entry.label}</p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(entry.bg).catch(() => {})}
            className="hover:text-foreground transition-colors"
            title={`Copy ${entry.bg}`}
          >
            {entry.bg}
          </button>
          <span className="opacity-40">/</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(entry.accent).catch(() => {})}
            className="hover:text-foreground transition-colors"
            title={`Copy ${entry.accent}`}
          >
            {entry.accent}
          </button>
        </div>
      </div>
    </div>
  )
}

export function BrandPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Palette className="w-4 h-4" />
            <span>Brand & Press Kit</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            NodeByte{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Brand Guidelines
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Logo files, color palettes, and usage guidelines for partners, press, and anyone writing about NodeByte Hosting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3.5 py-1.5 rounded-full text-sm border border-border/50 bg-card/30 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <section id="logo" className="py-16 sm:py-20 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Logo</h2>
            <p className="text-muted-foreground">
              The mark automatically re-colors to match whichever of our themes is active try the theme switcher in the nav.
            </p>
          </div>

          <Card className="p-10 sm:p-16 flex items-center justify-center bg-card/30 backdrop-blur-sm border-border/50">
            <Logo size={120} />
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2 rounded-lg">
              <a href="/logo.svg" download>
                <Download className="w-4 h-4" /> Download SVG
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2 rounded-lg">
              <a href="/logo.png" download>
                <Download className="w-4 h-4" /> Download PNG
              </a>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {LOGO_DOS_DONTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20">
                <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Background Template ─────────────────────────────────────────── */}
      <section id="background" className="py-16 sm:py-20 scroll-mt-20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Background Template</h2>
            <p className="text-muted-foreground">
              The same backdrop we use for our own social preview images radial glows, top accent bar, and a faint logo watermark with no headline baked in. Drop your own text or logo on top.
            </p>
          </div>

          <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- generated PNG, not a Next-optimizable static asset */}
            <img
              src="/brand/background"
              alt="Branded background template, 1200 by 630 pixels"
              width={1200}
              height={630}
              className="w-full h-auto"
            />
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="gap-2 rounded-lg">
              <a href="/brand/background" download="nodebyte-background.png">
                <Download className="w-4 h-4" /> Download Background (1200×630)
              </a>
            </Button>
            <span className="text-xs text-muted-foreground">PNG · matches our OG/social image style</span>
          </div>
        </div>
      </section>

      {/* ── Colors ───────────────────────────────────────────────────────── */}
      <section id="colors" className="py-16 sm:py-20 scroll-mt-20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Colors</h2>
            <p className="text-muted-foreground">
              Our core palette is light + dark. Click any swatch to copy its value.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {(["light", "dark"] as const).map((mode) => (
              <div key={mode} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {mode === "light" ? "Light Theme" : "Dark Theme"}
                </p>
                <div className="grid gap-2">
                  {Object.entries(CORE_COLORS[mode]).map(([key, value]) => (
                    <ColorSwatch key={key} label={key} value={value} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extended Palette
              </p>
              <p className="text-sm text-muted-foreground">
                nodebyte.host ships {Object.values(THEMES).flat().length} selectable themes. Background / accent hex shown below each.
              </p>
            </div>
            {THEME_SECTIONS.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {THEMES[key].map((entry) => (
                    <ThemeColorCard key={entry.value} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────────────────────── */}
      <section id="typography" className="py-16 sm:py-20 scroll-mt-20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Typography</h2>
            <p className="text-muted-foreground">Geist for interface text, Geist Mono for code and technical values.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3 bg-card/30 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Type className="w-4 h-4 text-primary" /> Geist — headings & body
              </div>
              <p className="font-sans text-3xl font-bold">Aa Bb Cc 123</p>
              <p className="font-sans text-muted-foreground">The quick brown fox jumps over the lazy dog.</p>
            </Card>
            <Card className="p-6 space-y-3 bg-card/30 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Type className="w-4 h-4 text-primary" /> Geist Mono — code & data
              </div>
              <p className="font-mono text-3xl font-bold">Aa Bb Cc 123</p>
              <p className="font-mono text-muted-foreground">The quick brown fox jumps over the lazy dog.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Name & Voice ─────────────────────────────────────────────────── */}
      <section id="voice" className="py-16 sm:py-20 scroll-mt-20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Name & Voice</h2>
            <p className="text-muted-foreground">How we refer to ourselves in writing.</p>
          </div>

          <Card className="divide-y divide-border/40 bg-card/30 backdrop-blur-sm border-border/50">
            {[
              { label: "Full name", value: "NodeByte Hosting" },
              { label: "Short wordmark", value: "NodeByte" },
              { label: "Legal entity", value: "NodeByte LTD (Company No. 15432941)" },
              { label: "Tagline", value: "Built for Humans. Powered by Bytes." },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </Card>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20">
            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Have a partnership, press, or media request? Reach out through our{" "}
              <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-5">
          <p className="text-muted-foreground">Looking to partner with NodeByte, not just grab assets?</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2 rounded-full">
              <Link href="/partners">
                View Partnership Program <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-full">
              <a href={LINKS.discord} target="_blank" rel="noopener noreferrer">Join Discord</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
