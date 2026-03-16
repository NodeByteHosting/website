"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/packages/auth"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  LayoutDashboard,
  Server,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  Loader2,
  Home,
  Bell,
  Ticket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/packages/ui/components/ui/button"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/packages/ui/components/ui/sheet"
import { ThemeToggle } from "@/packages/ui/components/theme-toggle"
import { LanguageSelector } from "@/packages/ui/components/ui/language-selector"
import { UserMenu } from "@/packages/auth/components"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("dashboard")
  const tAuth = useTranslations("auth")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  const navItems: NavItem[] = [
    { title: t("nav.overview"), href: "/dashboard", icon: LayoutDashboard },
    { title: t("nav.servers"), href: "/dashboard/servers", icon: Server },
    { title: t("nav.billing"), href: "/dashboard/billing", icon: CreditCard },
    { title: t("nav.support"), href: "/dashboard/support", icon: Ticket },
    { title: t("nav.account"), href: "/dashboard/account", icon: User },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-3 py-4 border-b",
        collapsed && "justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <Server className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">NodeByte</span>
            <span className="text-[10px] text-muted-foreground">Dashboard</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.title}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-2 text-primary">({item.badge})</span>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Quick Links */}
        <nav className="space-y-1.5">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Home className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{t("nav.backToSite")}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {t("nav.backToSite")}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://panel.nodebyte.host"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Server className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{t("nav.gamePanel")}</span>}
                </a>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {t("nav.gamePanel")}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/kb"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <HelpCircle className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{t("nav.helpCenter")}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {t("nav.helpCenter")}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSelector />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <UserMenu
                translations={{
                  myAccount: tAuth("userMenu.myAccount"),
                  viewPanel: tAuth("userMenu.viewPanel"),
                  admin: tAuth("userMenu.admin"),
                  logout: tAuth("userMenu.logout"),
                  signIn: tAuth("userMenu.signIn"),
                }}
              />
              <span className="text-sm truncate">
                {user?.firstName || user?.username || user?.email}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            <UserMenu
              translations={{
                myAccount: tAuth("userMenu.myAccount"),
                viewPanel: tAuth("userMenu.viewPanel"),
                admin: tAuth("userMenu.admin"),
                logout: tAuth("userMenu.logout"),
                signIn: tAuth("userMenu.signIn"),
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Dashboard navigation links</SheetDescription>
              </VisuallyHidden>
              <NavContent />
            </SheetContent>
          </Sheet>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Server className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu
            translations={{
              myAccount: tAuth("userMenu.myAccount"),
              viewPanel: tAuth("userMenu.viewPanel"),
              admin: tAuth("userMenu.admin"),
              logout: tAuth("userMenu.logout"),
              signIn: tAuth("userMenu.signIn"),
            }}
          />
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <NavContent />
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          "pt-14 lg:pt-0", // Account for mobile header
        )}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
