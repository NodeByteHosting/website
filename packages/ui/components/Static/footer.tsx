"use client"

import React, { useEffect, useState } from "react"
import { SiDiscord, SiTrustpilot } from "react-icons/si"
import { Github, Twitter, Mail, ExternalLink, Server, FileText, Scale, Headphones, AlertTriangle, Wrench, CheckCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/packages/ui/components/logo"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"

export function Footer() {
  const t = useTranslations()
  const pathname = usePathname()

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      window.location.href = `/#${id}`
      return
    }
    
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative border-t border-border/50 bg-linear-to-b from-background to-background/80">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-primary/2 to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-border/50">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <Logo 
                  size={48} 
                  className="w-12 h-12 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">NodeByte</span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Hosting</span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {t("footer.tagline")}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[
                { href: LINKS.twitter, icon: Twitter, label: "Twitter" },
                { href: LINKS.github, icon: Github, label: "GitHub" },
                { href: LINKS.discord, icon: SiDiscord, label: "Discord" },
                { href: LINKS.trustpilot, icon: SiTrustpilot, label: "Trustpilot" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Trustpilot */}
          <div className="lg:justify-self-end space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{t("footer.getInTouch")}</h4>
              <a
                href="mailto:info@nodebyte.co.uk"
                className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group mr-8"
              >
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t("footer.emailUs")}</div>
                  <div className="text-xs text-muted-foreground">info@nodebyte.co.uk</div>
                </div>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Headphones className="w-4 h-4 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t("footer.support")}</div>
                  <div className="text-xs text-muted-foreground">{t("footer.contactTeam")}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              {t("nav.services")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/games", label: t("footer.services.gameServers") },
                { href: "/vps", label: t("footer.services.vpsServers") },
                { href: "https://panel.nodebyte.host", label: t("footer.services.gamePanel") },
                { href: "https://vps.nodebyte.host", label: t("footer.services.vpsPanel") },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {t("nav.resources")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: LINKS.discord, label: t("footer.resources.discordServer") },
                { href: "https://nodebytestat.us/", label: t("footer.resources.serviceStatus") },
                { href: "/kb", label: t("footer.resources.knowledgeBase") },
                { href: LINKS.billing.root, label: t("footer.resources.billingPanel") },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              {t("footer.legal")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "https://nodebyte.co.uk/legal/terms", label: t("footer.legalLinks.terms") },
                { href: "https://nodebyte.co.uk/legal/privacy", label: t("footer.legalLinks.privacy") },
                { href: "https://nodebyte.co.uk/legal/payment-policy", label: t("footer.legalLinks.refund") },
                { href: "https://nodebyte.co.uk/legal", label: t("footer.legalLinks.legalHub") },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">{t("nav.company")}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.contact")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.aboutNodeByte")}
                </Link>
              </li>
              <li>
                <a 
                  href="https://find-and-update.company-information.service.gov.uk/company/15432941"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                >
                  {t("footer.company.companyInfo")}
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <Link 
                  href="/changelog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.company.changes")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} NodeByte LTD. {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a 
                href="https://crowdin.com/project/nodebyte" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <img 
                  src="https://badges.crowdin.net/nodebyte/localized.svg" 
                  alt="Crowdin Localization" 
                  className="h-5"
                />
              </a>
              <span className="hidden sm:inline">•</span>
              <StatusIndicator />
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Company No. 15432941</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


type StatusType = "UP" | "HASISSUES" | "UNDERMAINTENANCE"

interface StatusData {
  status: StatusType
  url: string
  hasIncidents: boolean
  hasMaintenance: boolean
  incidents: Array<{
    id: string
    name: string
    status: string
    impact: string
    url: string
  }>
  maintenances: Array<{
    id: string
    name: string
    status: string
    url: string
  }>
  error?: string
}

function StatusIndicator() {
  const t = useTranslations()
  const [status, setStatus] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/instatus")
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        setStatus(data)
      } catch (err) {
        if (!mounted) return
        // Fallback to UP status on error
        setStatus({
          status: "UP",
          url: "https://nodebytestat.us",
          hasIncidents: false,
          hasMaintenance: false,
          incidents: [],
          maintenances: [],
        })
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const getStatusConfig = (statusType: StatusType) => {
    switch (statusType) {
      case "UP":
        return {
          color: "bg-green-500",
          textColor: "text-green-500",
          label: t("footer.statusLabels.operational"),
          icon: CheckCircle2,
        }
      case "HASISSUES":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          label: t("footer.statusLabels.degraded"),
          icon: AlertTriangle,
        }
      case "UNDERMAINTENANCE":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-500",
          label: t("footer.statusLabels.maintenance"),
          icon: Wrench,
        }
      default:
        return {
          color: "bg-green-500",
          textColor: "text-green-500",
          label: t("footer.statusLabels.operational"),
          icon: CheckCircle2,
        }
    }
  }

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
        <span className="text-muted-foreground">{t("common.loading")}</span>
      </span>
    )
  }

  const currentStatus = status?.status || "UP"
  const config = getStatusConfig(currentStatus)
  const StatusIcon = config.icon

  return (
    <a
      href={status?.url || "https://nodebytestat.us"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity group"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full animate-pulse", config.color)} />
      <span className={cn("transition-colors", config.textColor)}>
        {config.label}
      </span>
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </a>
  )
}
