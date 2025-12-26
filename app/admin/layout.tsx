"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Server,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2,
  Menu,
  Home,
  LogOut,
} from "lucide-react"
import { cn } from "@/packages/core/lib/utils"
import { Button } from "@/packages/ui/components/ui/button"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"
import { Separator } from "@/packages/ui/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/packages/ui/components/ui/sheet"
import { LanguageSelector } from "@/packages/ui/components/ui/language-selector"
import { UserMenu } from "@/packages/auth/components/user-menu"
import { ThemeToggle } from "@/packages/ui/components/theme-toggle"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("admin")
  const tAuth = useTranslations("auth")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Redirect if not authenticated or not system admin
  if (!session?.user?.isSystemAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unauthorized access</p>
          <Button onClick={() => router.push("/")}>Return home</Button>
        </div>
      </div>
    )
  }

  const navItems: NavItem[] = [
    { title: t("nav.dashboard"), href: "/admin", icon: LayoutDashboard },
    { title: t("nav.users"), href: "/admin/users", icon: Users },
    { title: t("nav.servers"), href: "/admin/servers", icon: Server },
    { title: t("nav.sync"), href: "/admin/sync", icon: RefreshCw },
    { title: t("nav.syncLogs"), href: "/admin/sync/logs", icon: RefreshCw },
    { title: t("nav.settings"), href: "/admin/settings", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(item.href)
        return mobile ? (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
            <Button
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span>{item.title}</span>
            </Button>
          </Link>
        ) : (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link href={item.href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                {item.title}
              </TooltipContent>
            )}
          </Tooltip>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("title")}
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 p-4">
                <NavContent mobile />
                
                {/* Back to Site */}
                <Separator className="my-4" />
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-3" />
                    {t("nav.backToSite")}
                  </Button>
                </Link>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{t("status.online")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">{t("title")}</span>
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
          "fixed left-0 top-0 z-40 hidden h-screen border-r bg-card transition-all duration-300 lg:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">{t("title")}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={cn("h-8 w-8", collapsed && "mx-auto")}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <TooltipProvider delayDuration={0}>
              <NavContent />
              
              {/* Back to Site */}
              <Separator className="my-4" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Home className={cn("h-4 w-4", !collapsed && "mr-2")} />
                      {!collapsed && <span>{t("nav.backToSite")}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {t("nav.backToSite")}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3">
            {!collapsed ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{t("status.online")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
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
                    {session?.user?.firstName || session?.user?.username}
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
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          "pt-14 lg:pt-0", // Account for mobile header
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
