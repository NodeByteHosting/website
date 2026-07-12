"use client"

import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Handshake, Award, ArrowRight, ExternalLink, MessageCircle, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { PARTNERS, type PartnerEntry, type PartnerTier } from "@/packages/core/constants/partners"

function PartnerCard({ entry }: { entry: PartnerEntry }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
        "hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
      )}
    >
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full p-6 gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden">
            <Image src={entry.logo} alt={entry.name} fill className="object-contain p-2" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold truncate">{entry.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
      </a>
    </Card>
  )
}

function EmptyTierCard({ label, applyHref }: { label: string; applyHref: string }) {
  return (
    <Card className="border-dashed border-border/50 bg-card/20 p-8 text-center">
      <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary/60" />
      <p className="text-muted-foreground mb-4">
        No {label} yet — want to be the first?
      </p>
      <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
        <Link href={applyHref}>
          Apply Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </Card>
  )
}

function TierSection({
  tier,
  title,
  badge,
  icon: Icon,
  entries,
  emptyLabel,
}: {
  tier: PartnerTier
  title: string
  badge: string
  icon: typeof Handshake
  entries: PartnerEntry[]
  emptyLabel: string
}) {
  const filtered = entries.filter((e) => e.tier === tier)

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Icon className="w-4 h-4" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filtered.map((entry) => (
              <PartnerCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <EmptyTierCard label={emptyLabel} applyHref="/kb/partners/apply" />
          </div>
        )}
      </div>
    </section>
  )
}

export function PartnersPage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 30%, hsl(var(--primary) / 0.12) 0%, transparent 100%), radial-gradient(ellipse 50% 40% at 70% 70%, hsl(var(--accent) / 0.1) 0%, transparent 100%)" }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Handshake className="w-4 h-4" />
              <span>{t("partnersPage.badge")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("partnersPage.hero.title")}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("partnersPage.hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("partnersPage.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button size="lg" className="rounded-full gap-2" asChild>
                <Link href="/kb/partners/apply">
                  {t("partnersPage.hero.becomeAPartner")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/kb/partners/introduction">
                  {t("partnersPage.hero.viewProgram")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TierSection
        tier="sponsor"
        title={t("partnersPage.sponsors.title")}
        badge={t("partnersPage.sponsors.badge")}
        icon={Award}
        entries={PARTNERS}
        emptyLabel={t("partnersPage.sponsors.emptyLabel")}
      />

      <TierSection
        tier="partner"
        title={t("partnersPage.partners.title")}
        badge={t("partnersPage.partners.badge")}
        icon={Handshake}
        entries={PARTNERS}
        emptyLabel={t("partnersPage.partners.emptyLabel")}
      />

      {/* CTA */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-accent/2 to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="max-w-4xl mx-auto border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-linear-to-r from-primary via-accent to-primary" />
            <div className="p-8 sm:p-12 text-center">
              <Handshake className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("partnersPage.cta.title")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">{t("partnersPage.cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full gap-2" asChild>
                  <Link href="/kb/partners">
                    {t("partnersPage.cta.readDocs")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
                  <Link href="/contact">
                    <MessageCircle className="w-5 h-5" />
                    {t("partnersPage.cta.contactUs")}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
