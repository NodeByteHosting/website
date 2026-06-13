"use client"

import type React from "react"
import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { 
  Mail, 
  Github, 
  MessageCircle, 
  Headphones, 
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Send,
  CheckCircle2
} from "lucide-react"
import { useToast } from "@/packages/core/hooks/use-toast"
import { SiDiscord, SiTrustpilot, SiX } from "react-icons/si"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

export function Contact() {
  const { toast } = useToast()
  const t = useTranslations()

  const supportChannels = [
    {
      title: t("contact.discord.title"),
      description: t("contact.discord.description"),
      icon: SiDiscord,
      href: LINKS.discord,
      cta: t("contact.discord.button"),
      color: "bg-[#5865F2]/10 text-[#5865F2]",
      hoverColor: "hover:bg-[#5865F2] hover:text-white",
      features: [
        t("contact.discord.features.0"),
        t("contact.discord.features.1"),
        t("contact.discord.features.2"),
      ],
    },
    {
      title: t("contact.github.title"),
      description: t("contact.github.description"),
      icon: Github,
      href: LINKS.githubDiscussions,
      cta: t("contact.github.button"),
      color: "bg-foreground/10 text-foreground",
      hoverColor: "hover:bg-foreground hover:text-background",
      features: [
        t("contact.github.features.0"),
        t("contact.github.features.1"),
        t("contact.github.features.2"),
      ],
    },
    {
      title: t("contact.ticket.title"),
      description: t("contact.ticket.description"),
      icon: Headphones,
      href: "https://billing.nodebyte.host/tickets/create",
      cta: t("contact.ticket.button"),
      color: "bg-accent/10 text-accent",
      hoverColor: "hover:bg-accent hover:text-accent-foreground",
      features: [
        t("contact.ticket.features.0"),
        t("contact.ticket.features.1"),
        t("contact.ticket.features.2"),
      ],
    },
  ]

  const emailContacts = [
    { label: t("contact.email.technical"), email: "techteam@nodebyte.host", description: t("contact.email.technicalDesc") },
    { label: t("contact.email.general"), email: "support@nodebyte.host", description: t("contact.email.generalDesc") },
    { label: t("contact.email.account"), email: "accounts@nodebyte.host", description: t("contact.email.accountDesc") },
    { label: t("contact.email.billing"), email: "billing@nodebyte.host", description: t("contact.email.billingDesc") },
  ]

  const socialLinks = [
    { name: "X (Twitter)", icon: SiX, href: LINKS.twitter, color: "hover:text-foreground" },
    { name: "GitHub", icon: Github, href: LINKS.github, color: "hover:text-foreground" },
    { name: "Discord", icon: SiDiscord, href: LINKS.discord, color: "hover:text-[#5865F2]" },
    { name: "Trustpilot", icon: SiTrustpilot, href: LINKS.trustpilot, color: "hover:text-[#00b67a]" },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("contact.copied"),
        description: t("contact.copiedDesc"),
      })
    }).catch(() => {
      toast({
        title: t("contact.copyFailed"),
        description: t("contact.copyFailedDesc"),
        variant: "destructive",
      })
    })
  }

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 pb-24 sm:pb-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Headphones className="w-4 h-4" />
            <span>{t("contact.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("contact.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("contact.titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        {/* Social Links & Warning - Now at top */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="font-bold mb-2">{t("contact.social.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("contact.social.description")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-colors",
                      social.color
                    )}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500 mb-1">{t("contact.warning.title")}</p>
                  <p className="text-muted-foreground">
                    {t("contact.warning.description")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {supportChannels.map((channel) => (
            <Card
              key={channel.title}
              className="group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-6 sm:p-8 flex flex-col h-full">
                <div className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors",
                  channel.color,
                  channel.hoverColor
                )}>
                  <channel.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{channel.title}</h3>
                <p className="text-muted-foreground mb-4">{channel.description}</p>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {channel.features.map((feature, i) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full gap-2 rounded-lg" asChild>
                  <a href={channel.href} target="_blank" rel="noopener noreferrer">
                    {channel.cta}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Email Contacts */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent mb-4">
              <Mail className="w-4 h-4" />
              <span>{t("contact.email.badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t("contact.email.title")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("contact.email.responseTime")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {emailContacts.map((contact) => (
              <Card
                key={contact.email}
                className="group border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() => copyToClipboard(contact.email)}
              >
                <div className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{contact.label}</h4>
                    <p className="text-primary text-sm truncate">{contact.email}</p>
                    <p className="text-xs text-muted-foreground">{contact.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}