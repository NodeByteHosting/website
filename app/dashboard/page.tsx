"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useApiQuery } from "@/packages/core"
import { useAuth } from "@/packages/auth"
import {
  Server,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  Plus,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { Progress } from "@/packages/ui/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"

interface ServerStats {
  total: number
  online: number
  offline: number
  suspended: number
}

interface Server {
  id: string
  name: string
  status: string
  game: string
  node: string
  resources: {
    memory: { used: number; limit: number }
    cpu: { used: number; limit: number }
    disk: { used: number; limit: number }
  }
}

interface DashboardStats {
  servers: ServerStats
  recentServers: Server[]
  accountBalance: number
  openTickets: number
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: number; positive: boolean }
  loading?: boolean
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <span className={`text-xs flex items-center gap-0.5 ${trend.positive ? "text-green-500" : "text-red-500"}`}>
              <TrendingUp className={`h-3 w-3 ${!trend.positive && "rotate-180"}`} />
              {trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ServerCard({ server, loading }: { server?: Server; loading?: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-2 w-3/4 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!server) return null

  const statusColors = {
    running: "bg-green-500/10 text-green-500 border-green-500/20",
    online: "bg-green-500/10 text-green-500 border-green-500/20",
    offline: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    starting: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    stopping: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    suspended: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const statusColor = statusColors[server.status.toLowerCase() as keyof typeof statusColors] || statusColors.offline

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold group-hover:text-primary transition-colors">{server.name}</h4>
            <p className="text-sm text-muted-foreground">{server.game} • {server.node}</p>
          </div>
          <Badge variant="outline" className={statusColor}>
            {server.status}
          </Badge>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              Memory
            </span>
            <span>{server.resources.memory.limit > 0 ? Math.round((server.resources.memory.used / server.resources.memory.limit) * 100) : 0}%</span>
          </div>
          <Progress value={server.resources.memory.limit > 0 ? (server.resources.memory.used / server.resources.memory.limit) * 100 : 0} className="h-1.5" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              CPU
            </span>
            <span>{server.resources.cpu.limit > 0 ? Math.round((server.resources.cpu.used / server.resources.cpu.limit) * 100) : 0}%</span>
          </div>
          <Progress value={server.resources.cpu.limit > 0 ? (server.resources.cpu.used / server.resources.cpu.limit) * 100 : 0} className="h-1.5" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
            <a href={`https://panel.nodebyte.host/server/${server.id}`} target="_blank" rel="noopener noreferrer">
              Manage <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("dashboard")
  const [showWelcome, setShowWelcome] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?callbackUrl=/dashboard`)
    }
  }, [user, authLoading, router])

  // Fetch dashboard stats using React Query
  const { data: statsResponse, isLoading: loading } = useApiQuery<{ success: boolean; data: DashboardStats }>(
    "/api/v1/dashboard/stats",
    undefined,
    { enabled: !!user }
  )
  const stats = statsResponse?.data

  // Show welcome message if coming from magic link
  useEffect(() => {
    if (searchParams.get("login") === "magic-link") {
      setShowWelcome(true)
      // Clear the URL param
      window.history.replaceState({}, "", "/dashboard")
    }
  }, [searchParams])

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Should not reach here, but just in case
  if (!user) {
    return null
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t("greeting.morning")
    if (hour < 18) return t("greeting.afternoon")
    return t("greeting.evening")
  }

  return (
    <div className="space-y-8">
      {/* Welcome Alert for Magic Link */}
      {showWelcome && (
        <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">{t("welcome.title")}</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            {t("welcome.magicLinkSuccess")}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting()}, {user?.firstName || user?.username || "there"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://panel.nodebyte.host" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("actions.openPanel")}
            </a>
          </Button>
          <Button asChild>
            <Link href="/games">
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.newServer")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stats.totalServers")}
          value={stats?.servers.total ?? 0}
          description={`${stats?.servers.online ?? 0} ${t("stats.online")}`}
          icon={Server}
          loading={loading}
        />
        <StatCard
          title={t("stats.activeServers")}
          value={stats?.servers.online ?? 0}
          description={t("stats.activeDescription")}
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title={t("stats.accountBalance")}
          value={`$${(stats?.accountBalance ?? 0).toFixed(2)}`}
          description={t("stats.balanceDescription")}
          icon={Zap}
          loading={loading}
        />
        <StatCard
          title={t("stats.openTickets")}
          value={stats?.openTickets ?? 0}
          description={t("stats.ticketsDescription")}
          icon={AlertCircle}
          loading={loading}
        />
      </div>

      {/* Recent Servers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{t("recentServers.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("recentServers.description")}</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/servers">
              {t("recentServers.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <ServerCard key={i} loading />
            ))}
          </div>
        ) : stats?.recentServers && stats.recentServers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.recentServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Server className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("recentServers.empty.title")}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {t("recentServers.empty.description")}
              </p>
              <Button asChild>
                <Link href="/games">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("recentServers.empty.action")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("quickActions.title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/games/minecraft">
            <Card className="group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Server className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-semibold">{t("quickActions.minecraft")}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t("quickActions.minecraftDesc")}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/games/rust">
            <Card className="group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Server className="h-6 w-6 text-orange-500" />
                </div>
                <h4 className="font-semibold">{t("quickActions.rust")}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t("quickActions.rustDesc")}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/support">
            <Card className="group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold">{t("quickActions.support")}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t("quickActions.supportDesc")}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/kb">
            <Card className="group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HardDrive className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-semibold">{t("quickActions.knowledgeBase")}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t("quickActions.knowledgeBaseDesc")}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
