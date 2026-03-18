import { WifiOff, RefreshCw, Home, MessageCircle } from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Logo } from "@/packages/ui/components/logo"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "You're Offline",
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
            <WifiOff className="h-24 w-24 text-primary relative z-10" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">You&apos;re offline</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          It looks like you&apos;ve lost your internet connection. Check your connection and try again.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="rounded-full gap-2 bg-primary hover:bg-primary/90 font-semibold"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
            <Link href="/">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm p-6">
          <p className="text-sm text-muted-foreground">
            Some pages may still be available from cache. You can browse previously visited pages while offline.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Need help? Reach out via our{" "}
            <a href="https://discord.gg/nodebyte" className="underline hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              Discord server
            </a>{" "}
            once you&apos;re back online.
          </p>
        </Card>
      </div>
    </main>
  )
}
