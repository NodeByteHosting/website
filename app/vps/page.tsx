import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { GamePrice } from "@/packages/ui/components/ui/game-price"
import { Server, ArrowRight, Check, Cpu, Zap, PackageX } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("vpsPage.title"),
    description: t("vpsPage.description"),
  }
}

export default async function VpsPage() {
  const t = await getTranslations()

  const vpsOptions = [
    {
      name: "AMD VPS",
      slug: "amd",
      description: t("vps.amd.description"),
      icon: Cpu,
      tag: t("vps.amd.tag"),
      tagColor: "bg-primary text-primary-foreground",
      gradient: "from-red-500/20 via-orange-500/10 to-primary/5",
      iconBg: "bg-red-500/10 text-red-500",
      features: [
        t("vps.amd.features.0"),
        t("vps.amd.features.1"),
        t("vps.amd.features.2"),
        t("vps.amd.features.3"),
      ],
      startingPriceGBP: 4.50,
      inStock: true,
    },
    {
      name: "Intel VPS",
      slug: "intel",
      description: t("vps.intel.description"),
      icon: Cpu,
      tag: t("vps.intel.tag"),
      tagColor: "bg-accent text-accent-foreground",
      gradient: "from-blue-500/20 via-cyan-500/10 to-accent/5",
      iconBg: "bg-blue-500/10 text-blue-500",
      features: [
        t("vps.intel.features.0"),
        t("vps.intel.features.1"),
        t("vps.intel.features.2"),
        t("vps.intel.features.3"),
      ],
      startingPriceGBP: 4.50,
      inStock: false,
    },
  ]

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-24 sm:pb-32">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Server className="w-4 h-4" />
            <span>{t("vps.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("vps.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("vps.titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("vps.description")}
          </p>
        </div>

        {/* VPS Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {vpsOptions.map((vps) => (
            <Card
              key={vps.name}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "hover:border-primary/30 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "flex flex-col h-full",
                !vps.inStock && "opacity-80"
              )}
            >
              {/* Gradient Header */}
              <div className={cn(
                "relative h-48 overflow-hidden bg-linear-to-br",
                vps.gradient
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-24 h-24 rounded-2xl flex items-center justify-center",
                    vps.iconBg,
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <vps.icon className="w-12 h-12" />
                  </div>
                </div>

                {/* Tag / OOS badge */}
                {vps.inStock ? (
                  <div className={cn(
                    "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium",
                    vps.tagColor
                  )}>
                    {vps.tag}
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/90 text-destructive-foreground">
                    <PackageX className="w-3 h-3" />
                    {t("vps.outOfStock")}
                  </div>
                )}

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-card/80 to-transparent" />
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Title & Price */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold">{vps.name}</h2>
                  {vps.inStock ? (
                    <GamePrice
                      amountGBP={vps.startingPriceGBP}
                      label={t("vpsPage.startingAt")}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground italic mt-1">{t("vps.outOfStock")}</span>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">{vps.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {vps.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className="w-full gap-2 rounded-lg mt-auto"
                  variant={vps.inStock ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/vps/${vps.slug}`}>
                    {vps.inStock ? t("vps.learnMore") : "View Details"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Features highlight */}
        <div className="mt-20 grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Zap, title: t("vps.highlights.deploy.title"), desc: t("vps.highlights.deploy.description") },
            { icon: Server, title: t("vps.highlights.control.title"), desc: t("vps.highlights.control.description") },
            { icon: Cpu, title: t("vps.highlights.hardware.title"), desc: t("vps.highlights.hardware.description") },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            {t("vps.customSolution")}{" "}
            <Link href="/contact" className="text-primary hover:underline">
              {t("vps.contactUs")}
            </Link>{" "}
            {t("vps.forCustom")}
          </p>
        </div>
      </div>
    </section>
  )
}
