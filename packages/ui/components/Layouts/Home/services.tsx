import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import { Layers, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { SERVICE_CATEGORIES } from "@/packages/core/constants/services"
import { Price } from "@/packages/ui/components/ui/price"

export function Services() {
  const t = useTranslations()

  const activeServices = SERVICE_CATEGORIES.filter((s) => s.enabled)

  return (
    <section id="services" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Layers className="w-4 h-4" />
            <span>{t("servicesHome.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("servicesHome.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("servicesHome.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("servicesHome.description")}
          </p>
        </div>

        {/* Service Hub Cards */}
        <div
          className={cn(
            "grid gap-8 max-w-4xl mx-auto",
            activeServices.length === 1
              ? "max-w-xl"
              : activeServices.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {activeServices.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "transition-all duration-300",
                "hover:shadow-2xl hover:shadow-primary/10",
                service.accentBorder,
                "flex flex-col",
              )}
            >
              {/* Card header — gradient visual */}
              <div
                className={cn(
                  "relative h-44 bg-linear-to-br overflow-hidden flex items-center justify-center",
                  service.gradient,
                )}
              >
                {/* Large faded background icon */}
                <service.icon className={cn("absolute w-48 h-48 opacity-[0.07]", service.iconColor)} />
                {/* Centred icon badge */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-background/10 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <service.icon className={cn("w-8 h-8", service.iconColor)} />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Title + starting price */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border/50 shrink-0 mt-0.5 inline-flex items-center gap-1">
                    {t("servicesHome.startingFrom")} <Price amount={service.startingPriceGBP} />/mo
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{service.description}</p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6 flex-1">
                  {service.highlights.map((highlight, i) => (
                    <li key={highlight} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className={cn("w-4 h-4 shrink-0", service.iconColor)} />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <Button className="w-full gap-2 rounded-lg" asChild>
                  <Link href={service.href}>
                    {t("servicesHome.browsePlans")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            {t("servicesHome.customSolution")}{" "}
            <Link href="/contact" className="text-primary hover:underline">
              {t("servicesHome.contactUs")}
            </Link>{" "}
            {t("servicesHome.forCustom")}
          </p>
        </div>
      </div>
    </section>
  )
}
