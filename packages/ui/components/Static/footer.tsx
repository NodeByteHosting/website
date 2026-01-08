"use client"

import React, { useEffect, useState } from "react"
import { SiDiscord, SiTrustpilot } from "react-icons/si"
import { Github, Twitter, Mail, ExternalLink, Server, FileText, Scale, Headphones, AlertTriangle, Wrench, CheckCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/packages/ui/components/logo"
import { useTranslations } from "next-intl"

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
                { href: "https://twitter.com/NodeByteHosting", icon: Twitter, label: "Twitter" },
                { href: "https://github.com/NodeByteHosting", icon: Github, label: "GitHub" },
                { href: "https://discord.gg/wN58bTzzpW", icon: SiDiscord, label: "Discord" },
                { href: "https://uk.trustpilot.com/review/nodebyte.host", icon: SiTrustpilot, label: "Trustpilot" },
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
            
            <div className="pt-4">
              <TrustpilotWidget />
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
                { href: "https://billing.nodebyte.host/store/minecraft-server-hosting", label: t("footer.services.minecraftHosting") },
                { href: "https://billing.nodebyte.host/store/rust-hosting", label: t("footer.services.rustHosting") },
                { href: "https://panel.nodebyte.host/", label: t("footer.services.gamePanel") },
                { href: "https://billing.nodebyte.host/login", label: t("footer.services.clientArea") },
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

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {t("nav.resources")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "https://discord.gg/wN58bTzzpW", label: t("footer.resources.discordServer") },
                { href: "https://nodebytestat.us/", label: t("footer.resources.serviceStatus") },
                { href: "/kb", label: t("footer.resources.knowledgeBase") },
                { href: "https://uk.trustpilot.com/review/nodebyte.host", label: t("footer.resources.trustPilot") },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith("http") && (
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                    )}
                  </a>
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

function TrustpilotWidget() {
  const [rating, setRating] = useState<number | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/trustpilot')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        setRating(typeof data.rating === 'number' ? data.rating : null)
        setCount(typeof data.reviewCount === 'number' ? data.reviewCount : null)
      } catch (err) {
        if (!mounted) return
        setError(String(err))
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const displayRating = rating ?? 4.1
  const displayCount = count ?? 5

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <SiTrustpilot className="w-5 h-5 text-[#00b67a]" />
        <span className="text-sm font-semibold">Trustpilot</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = Math.round(displayRating) >= i
            return (
              <div
                key={i}
                className={cn(
                  "w-5 h-5 flex items-center justify-center",
                  filled ? "bg-[#00b67a]" : "bg-muted"
                )}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M12 .587l3.668 7.431L24 9.753l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.601 0 9.753l8.332-1.735z" />
                </svg>
              </div>
            )
          })}
        </div>
        <span className="text-sm font-medium">
          {loading ? '—' : displayRating.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">
          ({loading ? '...' : `${displayCount} reviews`})
        </span>
      </div>

      <a
        href="https://uk.trustpilot.com/review/nodebyte.host"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        Read our reviews
        <ExternalLink className="w-3 h-3" />
      </a>

      {error && <div className="text-xs text-destructive">Failed to load reviews</div>}
    </div>
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
