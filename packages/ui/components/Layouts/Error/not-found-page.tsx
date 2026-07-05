"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Home, ArrowLeft, Search, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Logo } from "@/packages/ui/components/logo"

export function NotFoundPage() {
  const t = useTranslations()

  const quickLinks = [
    { href: "/", label: t("notFound.links.home"), icon: Home },
    { href: "/games", label: t("notFound.links.games"), icon: Search },
    { href: "/vps", label: t("notFound.links.vps"), icon: Search },
    { href: "/contact", label: t("notFound.links.contact"), icon: MessageCircle },
  ]

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Background glow */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 30%, hsl(var(--primary) / 0.12) 0%, transparent 100%), radial-gradient(ellipse 50% 40% at 70% 70%, hsl(var(--accent) / 0.1) 0%, transparent 100%)" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Logo size={80} className="mx-auto mb-6 opacity-50" />
          <div className="text-[150px] sm:text-[200px] font-bold leading-none bg-linear-to-r from-primary/20 to-accent/20 bg-clip-text text-transparent select-none">
            404
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {t("notFound.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {t("notFound.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="rounded-full gap-2" asChild>
            <Link href="/">
              <Home className="w-5 h-5" />
              {t("notFound.goHome")}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            {t("notFound.goBack")}
          </Button>
        </div>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm p-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("notFound.quickLinks")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
