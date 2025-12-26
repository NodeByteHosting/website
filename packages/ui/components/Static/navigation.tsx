"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/packages/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/packages/ui/components/ui/dropdown-menu"
import { Server, Gamepad2, Blocks, ExternalLink, MessageCircle, ChevronRight, ChevronDown, Book, Building2, Mail, Users, Sparkles, User, LogIn, Shield } from "lucide-react"
import { ThemeToggle } from "@/packages/ui/components/theme-toggle"
import { CurrencySelector } from "@/packages/ui/components/ui/price"
import { LanguageSelector } from "@/packages/ui/components/ui/language-selector"
import { Logo } from "@/packages/ui/components/logo"
import { UserMenu } from "@/packages/auth/components/user-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function Navigation() {
  const t = useTranslations()
  const mountedRef = useRef(false)
  
  const company = [
    {
      title: t("company.contact.title"),
      href: "/contact",
      description: t("company.contact.description"),
      icon: Mail,
    },
    {
      title: t("company.about.title"),
      href: "/about",
      description: t("company.about.description"),
      icon: Users,
    },
  ]

  const services = [
    {
      title: t("services.minecraft.title"),
      href: "/games/minecraft",
      description: t("services.minecraft.description"),
      icon: Blocks,
    },
    {
      title: t("services.rust.title"),
      href: "/games/rust",
      description: t("services.rust.description"),
      icon: Gamepad2,
    },
    {
      title: t("services.hytale.title"),
      href: "/games/hytale",
      description: t("services.hytale.description"),
      icon: Gamepad2,
    },
    {
      title: t("services.all.title"),
      href: "/games",
      description: t("services.all.description"),
      icon: Server,
    },
  ]

  const resources = [
    {
      title: t("resources.clientArea.title"),
      href: "https://billing.nodebyte.host/login",
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
  ]

  const extras = [
    {
      title: t("extras.kb.title"),
      href: "/kb",
      description: t("extras.kb.description"),
      icon: Book,
    },
    {
      title: t("extras.changelog.title"),
      href: "/changelog",
      description: t("extras.changelog.description"),
      icon: Sparkles,
    },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [extrasOpen, setExtrasOpen] = useState(false)
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const [mobileExtrasOpen, setMobileExtrasOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    mountedRef.current = true
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setMobileCompanyOpen(false)
    setMobileServicesOpen(false)
    setMobileResourcesOpen(false)
    setMobileExtrasOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Toggle mobile dropdowns - only one open at a time
  const closeMobileDropdowns = () => {
    setMobileCompanyOpen(false)
    setMobileServicesOpen(false)
    setMobileResourcesOpen(false)
    setMobileExtrasOpen(false)
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

  const toggleMobileExtras = () => {
    const newState = !mobileExtrasOpen
    closeMobileDropdowns()
    setMobileExtrasOpen(newState)
  }

  return (
    <>
      <nav
        suppressHydrationWarning
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
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
              <DropdownMenu open={companyOpen} onOpenChange={setCompanyOpen}>
                <div 
                  onMouseEnter={() => setCompanyOpen(true)}
                  onMouseLeave={() => setCompanyOpen(false)}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.company")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        companyOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] p-2" sideOffset={8}>
                    {company.map((item) => (
                      <DropdownMenuItem key={item.title} asChild className="p-0 focus:bg-transparent">
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{item.title}</span>
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
              <DropdownMenu open={servicesOpen} onOpenChange={setServicesOpen}>
                <div 
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.services")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        servicesOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[320px] p-2" sideOffset={8}>
                    {services.map((service) => (
                      <DropdownMenuItem key={service.title} asChild className="p-0 focus:bg-transparent">
                        <Link
                          href={service.href}
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <service.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{service.title}</span>
                            </div>
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
              <DropdownMenu open={resourcesOpen} onOpenChange={setResourcesOpen}>
                <div 
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.resources")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        resourcesOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[320px] p-2" sideOffset={8}>
                    {resources.map((resource) => (
                      <DropdownMenuItem key={resource.title} asChild className="p-0 focus:bg-transparent">
                        <a
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <resource.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{resource.title}</span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {resource.description}
                            </p>
                          </div>
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>

              {/* Extras Dropdown */}
              <DropdownMenu open={extrasOpen} onOpenChange={setExtrasOpen}>
                <div 
                  onMouseEnter={() => setExtrasOpen(true)}
                  onMouseLeave={() => setExtrasOpen(false)}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50">
                      {t("nav.extras")}
                      <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform duration-200",
                        extrasOpen && "rotate-180"
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] p-2" sideOffset={8}>
                    {extras.map((item) => (
                      <DropdownMenuItem key={item.title} asChild className="p-0 focus:bg-transparent">
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors group cursor-pointer w-full"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{item.title}</span>
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
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2">
                <LanguageSelector />
                <CurrencySelector />
                <ThemeToggle />
                <UserMenu 
                  translations={{
                    myAccount: t("auth.userMenu.myAccount"),
                    viewPanel: t("auth.userMenu.viewPanel"),
                    admin: t("auth.userMenu.admin"),
                    logout: t("auth.userMenu.logout"),
                    signIn: t("auth.userMenu.signIn"),
                  }}
                />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 gap-2 rounded-full px-4"
                  asChild
                >
                  <Link href="https://discord.gg/wN58bTzzpW" target="_blank">
                    <MessageCircle className="h-4 w-4" />
                    {t("nav.discord")}
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
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
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
                onClick={toggleMobileCompany}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{t("nav.company")}</span>
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
                onClick={toggleMobileServices}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{t("nav.services")}</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  mobileServicesOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                mobileServicesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
                onClick={toggleMobileResources}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{t("nav.resources")}</span>
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
                  {resources.map((resource) => (
                    <a
                      key={resource.title}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <resource.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{resource.title}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Extras Dropdown */}
            <div className="mb-6">
              <button
                onClick={toggleMobileExtras}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">{t("nav.extras")}</span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  mobileExtrasOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                mobileExtrasOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-2 pr-1 py-2 space-y-1">
                  {extras.map((item) => (
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

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* User Account Section */}
            <MobileUserSection translations={{
              myAccount: t("auth.userMenu.myAccount"),
              viewPanel: t("auth.userMenu.viewPanel"),
              admin: t("auth.userMenu.admin"),
              logout: t("auth.userMenu.logout"),
              signIn: t("auth.userMenu.signIn"),
              register: t("auth.login.createAccount"),
            }} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Settings Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                {t("nav.settings")}
              </h4>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{t("nav.language")}</span>
                <LanguageSelector />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{t("nav.currency")}</span>
                <CurrencySelector />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">{t("nav.theme")}</span>
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
                <Link href="https://discord.gg/wN58bTzzpW" target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                  <MessageCircle className="h-5 w-5" />
                  {t("nav.joinDiscord")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Mobile user section component
function MobileUserSection({ 
  translations, 
  onClose 
}: { 
  translations: { 
    myAccount: string
    viewPanel: string
    admin: string
    logout: string
    signIn: string
    register: string
  }
  onClose: () => void
}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="p-3 rounded-xl bg-muted/30 animate-pulse">
        <div className="h-12 bg-muted rounded-lg" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
          Account
        </h4>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full h-12 rounded-xl" onClick={onClose}>
            <Link href="/auth/login">
              <LogIn className="mr-2 h-5 w-5" />
              {translations.signIn}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 rounded-xl" onClick={onClose}>
            <Link href="/auth/register">
              <User className="mr-2 h-5 w-5" />
              {translations.register}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const initials = `${session.user.firstName?.[0] || ""}${session.user.lastName?.[0] || ""}`.toUpperCase() || 
    session.user.username?.[0]?.toUpperCase() || "U"

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
        Account
      </h4>
      <div className="p-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {initials}
            </div>
            {session.user.isAdmin && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                <User className="h-3 w-3 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start h-10" onClick={onClose}>
            <a href="https://panel.nodebyte.host" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {translations.viewPanel}
            </a>
          </Button>
          {session.user.isAdmin && (
            <Button asChild variant="outline" className="w-full justify-start h-10" onClick={onClose}>
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                {translations.admin}
              </Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              onClose()
              import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/" }))
            }}
          >
            <LogIn className="mr-2 h-4 w-4 rotate-180" />
            {translations.logout}
          </Button>
        </div>
      </div>
    </div>
  )
}
