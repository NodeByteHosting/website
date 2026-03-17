"use client"

import { Button } from "@/packages/ui/components/ui/button"
import { Card } from "@/packages/ui/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/packages/ui/components/ui/accordion"
import { HelpCircle, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

interface FAQItem {
  question: string
  answer: string
}

interface GameFAQProps {
  gameName: string
  faqs: FAQItem[]
}

export function GameFAQ({ gameName, faqs }: GameFAQProps) {
  const t = useTranslations()
  
  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <HelpCircle className="w-4 h-4" />
            <span>{t("gamePage.faq.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {gameName}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("gamePage.faq.title")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("gamePage.faq.description", { game: gameName })}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  "border border-border/50 rounded-xl overflow-hidden",
                  "bg-card/30 backdrop-blur-sm",
                  "data-[state=open]:border-primary/30",
                  "transition-colors duration-200"
                )}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors text-left">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <Card className="max-w-3xl mx-auto border-border/50 bg-card/30 backdrop-blur-sm p-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">{t("gamePage.faq.stillHaveQuestions")}</h3>
            <p className="text-muted-foreground">
              {t("gamePage.faq.supportAvailable")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gap-2 rounded-full" asChild>
                <Link href={LINKS.discord} target="_blank">
                  <MessageCircle className="w-4 h-4" />
                  {t("gamePage.faq.askOnDiscord")}
                </Link>
              </Button>
              <Button variant="outline" className="gap-2 rounded-full" asChild>
                <Link href="/contact">
                  <Mail className="w-4 h-4" />
                  {t("gamePage.faq.contactSupport")}
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
