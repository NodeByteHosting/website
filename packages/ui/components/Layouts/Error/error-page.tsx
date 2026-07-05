"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { RefreshCw, Home, AlertTriangle, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Logo } from "@/packages/ui/components/logo"
import { LINKS } from "@/packages/core/constants/links"

interface ErrorPageProps {
  error?: Error & { digest?: string }
  reset?: () => void
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-background to-background" />
      
      {/* Background glow */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 30%, hsl(var(--destructive) / 0.1) 0%, transparent 100%), radial-gradient(ellipse 50% 40% at 70% 70%, hsl(var(--destructive) / 0.06) 0%, transparent 100%)" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {t("errorPage.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-md mx-auto">
          {t("errorPage.description")}
        </p>
        
        {error?.digest && (
          <p className="text-sm text-muted-foreground mb-8">
            {t("errorPage.errorCode")}: <code className="px-2 py-1 rounded bg-muted font-mono text-xs">{error.digest}</code>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {reset && (
            <Button size="lg" className="rounded-full gap-2" onClick={reset}>
              <RefreshCw className="w-5 h-5" />
              {t("errorPage.tryAgain")}
            </Button>
          )}
          <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              {t("errorPage.goHome")}
            </Link>
          </Button>
        </div>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm p-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("errorPage.needHelp")}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t("errorPage.helpDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2 rounded-full" asChild>
              <Link href={LINKS.discord} target="_blank">
                <MessageCircle className="w-4 h-4" />
                {t("errorPage.joinDiscord")}
              </Link>
            </Button>
            <Button variant="outline" className="gap-2 rounded-full" asChild>
              <Link href="/contact">
                {t("errorPage.contactSupport")}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
