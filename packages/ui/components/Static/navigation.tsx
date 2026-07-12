"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/packages/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Server, Gamepad2, ExternalLink, ChevronRight, ChevronDown, Book, Mail, Users, Sparkles, Cpu, Network, Handshake } from "lucide-react"
import { ThemeToggle } from "@/packages/ui/components/theme-toggle"
import { CurrencySelector } from "@/packages/ui/components/ui/price"
import { LanguageSelector } from "@/packages/ui/components/ui/language-selector"
import { Logo } from "@/packages/ui/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LINKS } from "@/packages/core/constants/links"
import { SiDiscord } from "react-icons/si"

export function Navigation() {
  const t = useTranslations()
  const mountedRef = useRef(false)
  
  const company = [
    {
      title: t("company.about.title"),
      href: "/about",
      description: t("company.about.description"),
      icon: Users,
    },
    {
      title: t("company.network.title"),
      href: "/nodes",
      description: t("company.network.description"),
      icon: Network,
    },
    {
      title: t("company.partners.title"),
      href: "/partners",
      description: t("company.partners.description"),
      icon: Handshake,
    },
    {
      title: t("company.contact.title"),
      href: "/contact",
      description: t("company.contact.description"),
      icon: Mail,
    },
    {
      title: t("company.github.title"),
      href: "https://github.com/nodebyte",
      description: t("company.github.description"),
      icon: ExternalLink,
      external: true,
    },
  ]

  const services = [
    {
      title: t("services.gameServers.title"),
      href: "/games",
      description: t("services.gameServers.description"),
      icon: Gamepad2,
    },
    {
      title: t("services.allVps.title"),
      href: "/vps",
      description: t("services.allVps.description"),
      icon: Server,
    },
    {
      title: t("services.dedicated.title"),
      href: "/dedicated",
      description: t("services.dedicated.description"),
      icon: Cpu,
    },
  ]

  const resources = [
    {
      title: t("resources.clientArea.title"),
      href: LINKS.billing.login,
      description: t("resources.clientArea.description"),
      icon: Server,
      external: true,
    },
    {
      title: t("resources.gamePanel.title"),
      href: "https://panel.nodebyte.host/",
      description: t("resources.gamePanel.description"),
      icon: Gamepad2,
      external: true,
    },
    {
      title: t("resources.vpsPanel.title"),
      href: "https://vps.nodebyte.host/",
      description: t("resources.vpsPanel.description"),
      icon: Cpu,
      external: true,
    },
    {
      title: t("resources.kb.title"),
      href: "/kb",
      description: t("resources.kb.description"),
      icon: Book,
      external: false
    },
    {
      title: t("resources.changelog.title"),
      href: "/changelog",
      description: t("resources.changelog.description"),
      icon: Sparkles,
      external: false
    },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const navLabels = {
    company: t("nav.company"),
    services: t("nav.services"),
    resources: t("nav.resources"),
    discord: t("nav.discord"),
    settings: t("nav.settings"),
    language: t("nav.language"),
    currency: t("nav.currency"),
    theme: t("nav.theme"),
    joinDiscord: t("nav.joinDiscord"),
  }

  useEffect(() => {
    mountedRef.current = true
  }, [])

  // Debounced hover helpers for desktop nav dropdowns.
  // The dropdown content renders in a Radix portal (outside the wrapper div in the DOM),
  // so onMouseLeave fires when the mouse moves toward the content. A short delay before
  // closing lets the mouse travel to the portal content and cancel the close.
  const openDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>, closeOthers?: () => void) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    closeOthers?.()
    setter(true)
  }

  const closeDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    closeTimerRef.current = setTimeout(() => setter(false), 150)
  }

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => setIsMobileMenuOpen(false))
  }, [pathname])

  // Prevent body scroll when mobile menu is open.
  // We toggle a class rather than directly mutating body.style.overflow so we
  // don't conflict with Radix UI's own scroll-lock (react-remove-scroll).
  useEffect(() => {
    const cls = "overflow-hidden"
    if (isMobileMenuOpen) {
      document.documentElement.classList.add(cls)
    } else {
      document.documentElement.classList.remove(cls)
    }
    return () => {
      document.documentElement.classList.remove(cls)
    }
  }, [isMobileMenuOpen])

  // Toggle mobile dropdowns - only one open at a time
  const closeMobileDropdowns = () => {
    setMobileCompanyOpen(false)
    setMobileServicesOpen(false)
    setMobileResourcesOpen(false)
  }

  const toggleMobileCompany = () => {
    const newState = !mobileCompanyOpen
    closeMobileDropdowns()
    setMobileCompanyOpen(newState)
  }

  const toggleMobileServices = () => {
    const newState = !mobileServicesOpen
    closeMobileDropdowns()
    setMobileServicesOpen(newState)
  }

  const toggleMobileResources = () => {
    const newState = !mobileResourcesOpen
    closeMobileDropdowns()
    setMobileResourcesOpen(newState)
  }

  return (
    <>
      <nav
        suppressHydrationWarning
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-linear-to-b from-background/80 to-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <Logo 
                  size={40} 
                  className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                  NodeByte
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                  Hosting
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Company Dropdown */}
              <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen} modal={false}>
                <div 
                  onMouseEnter={() => openDropdown(setCompanyOpen, () => { setServicesOpen(false); setResourcesOpen(false) })}
                  onMouseLeave={() => closeDropdown(setCompanyOpen)}
                >
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.company")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        companyOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[280px] p-2"
                    sideOffset={8}
                    onMouseEnter={cancelClose}
                    onMouseLeave={() => closeDropdown(setCompanyOpen)}
                  >
                    {company.map((item) => (
                      <DropdownMenuItem key={item.title} asChild className="p-0 focus:bg-transparent">
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/60 group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-foreground">{item.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>

              {/* Services Dropdown */}
              <DropdownMenu open={servicesOpen} onOpenChange={setServicesOpen} modal={false}>
                <div 
                  onMouseEnter={() => openDropdown(setServicesOpen, () => { setCompanyOpen(false); setResourcesOpen(false) })}
                  onMouseLeave={() => closeDropdown(setServicesOpen)}
                >
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.services")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        servicesOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[280px] p-2"
                    sideOffset={8}
                    onMouseEnter={cancelClose}
                    onMouseLeave={() => closeDropdown(setServicesOpen)}
                  >
                    {services.map((service) => (
                      <DropdownMenuItem key={service.title} asChild className="p-0 focus:bg-transparent">
                        <Link
                          href={service.href}
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/60 group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <service.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-foreground">{service.title}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>

              {/* Resources Dropdown */}
              <DropdownMenu open={resourcesOpen} onOpenChange={setResourcesOpen} modal={false}>
                <div 
                  onMouseEnter={() => openDropdown(setResourcesOpen, () => { setCompanyOpen(false); setServicesOpen(false) })}
                  onMouseLeave={() => closeDropdown(setResourcesOpen)}
                >
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.resources")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        resourcesOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[320px] p-2"
                    sideOffset={8}
                    onMouseEnter={cancelClose}
                    onMouseLeave={() => closeDropdown(setResourcesOpen)}
                  >
                    {resources.map((resource) => {
                      const innerContent = (
                        <>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <resource.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-foreground">{resource.title}</span>
                              {resource.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {resource.description}
                            </p>
                          </div>
                        </>
                      )
                      
                      return (
                        <DropdownMenuItem key={resource.title} asChild className="p-0 focus:bg-transparent">
                          {resource.external ? (
                            <a
                              href={resource.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/60 group cursor-pointer w-full"
                            >
                              {innerContent}
                            </a>
                          ) : (
                            <Link
                              href={resource.href}
                              className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/60 group cursor-pointer w-full"
                            >
                              {innerContent}
                            </Link>
                          )}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>

            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2">
                <LanguageSelector />
                <CurrencySelector />
                <ThemeToggle />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 gap-2 rounded-full px-4"
                  asChild
                >
                  <Link href={LINKS.discord} target="_blank">
                    <SiDiscord className="h-4 w-4" />
                    {navLabels.discord}
                  </Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-5 h-5">
                  <span
                    className={cn(
                      "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                      isMobileMenuOpen ? "top-2 rotate-45" : "top-1"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-2 block h-0.5 w-5 bg-current transition-all duration-300",
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                      isMobileMenuOpen ? "top-2 -rotate-45" : "top-3"
                    )}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMobileMenuOpen(false) }}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bottom-0 z-50 bg-background lg:hidden transition-all duration-300 ease-out",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="h-full overflow-y-auto overscroll-contain">
          <div className="container mx-auto px-4 py-6 pb-24">
            {/* Company Dropdown */}
            <div className="mb-2">
              <button
                type="button"
                onClick={toggleMobileCompany}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{navLabels.company}</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  mobileCompanyOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                mobileCompanyOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-2 pr-1 py-2 space-y-1">
                  {company.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.title}</div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Dropdown */}
            <div className="mb-2">
              <button
                type="button"
                onClick={toggleMobileServices}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{navLabels.services}</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  mobileServicesOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                mobileServicesOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-2 pr-1 py-2 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <service.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{service.title}</div>
                        <p className="text-xs text-muted-foreground truncate">
                          {service.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="mb-2">
              <button
                type="button"
                onClick={toggleMobileResources}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{navLabels.resources}</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  mobileResourcesOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                mobileResourcesOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-2 pr-1 py-2 space-y-1">
                  {resources.map((resource) => {
                    const inner = (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <resource.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{resource.title}</span>
                            {resource.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {resource.description}
                          </p>
                        </div>
                      </>
                    )
                    const sharedClass = "flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                    return resource.external ? (
                      <a
                        key={resource.title}
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sharedClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        key={resource.title}
                        href={resource.href}
                        className={sharedClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {inner}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Settings Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                {navLabels.settings}
              </h4>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{navLabels.language}</span>
                <LanguageSelector />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{navLabels.currency}</span>
                <CurrencySelector />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{navLabels.theme}</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Discord CTA */}
            <div className="mt-6">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 gap-2 rounded-xl"
                asChild
              >
                <Link href={LINKS.discord} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                  <SiDiscord className="h-5 w-5" />
                  {navLabels.joinDiscord}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
