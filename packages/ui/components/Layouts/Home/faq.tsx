"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search, HelpCircle, MessageCircle } from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

export function FAQ() {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [query, setQuery] = useState("")

  const faqs = [
    {
      question: t("faq.items.provision.question"),
      answer: t("faq.items.provision.answer"),
    },
    {
      question: t("faq.items.ddos.question"),
      answer: t("faq.items.ddos.answer"),
    },
    {
      question: t("faq.items.locations.question"),
      answer: t("faq.items.locations.answer"),
    },
    {
      question: t("faq.items.mods.question"),
      answer: t("faq.items.mods.answer"),
    },
    {
      question: t("faq.items.uptime.question"),
      answer: t("faq.items.uptime.answer"),
    },
    {
      question: t("faq.items.trial.question"),
      answer: t("faq.items.trial.answer"),
      link: {
        href: LINKS.billing.freeTrial,
        label: t("faq.items.trial.trialLink"),
      },
    },
  ]

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs
    const q = query.toLowerCase()
    return faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
  }, [query, faqs])

  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/[0.02] to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <HelpCircle className="w-4 h-4" />
            <span>{t("faq.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("faq.title")}{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("faq.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("faq.description")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-card/30",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {t("faq.noResults")}
              </div>
            )}

            {filtered.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden",
                    "transition-all duration-300",
                    isOpen && "border-primary/30 bg-card/50"
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                    aria-expanded={isOpen}
                  >
                    <span className={cn(
                      "font-medium transition-colors",
                      isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                      {faq.link && (
                        <Button
                          variant="link"
                          className="px-0 ml-1 text-primary font-medium"
                          asChild
                        >
                          <Link href={faq.link.href} target="_blank" rel="noopener noreferrer">
                            {faq.link.label} →
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm text-center">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("faq.stillHaveQuestions")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("faq.cantFind")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="rounded-full" asChild>
                <Link href="/contact">{t("faq.contactSupport")}</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href={LINKS.discord} target="_blank">
                  {t("faq.joinDiscord")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
