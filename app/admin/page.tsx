"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useApiQuery, useApiMutation } from "@/packages/core"
import {
  Users,
  Server,
  HardDrive,
  Database,
  Layers,
  Egg,
  Variable,
  MapPin,
  Network,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { Progress } from "@/packages/ui/components/ui/progress"
import { useToast } from "@/packages/ui/components/ui/use-toast"

interface SyncStats {
  success: boolean
  status: {
    lastSync: string | null
    isSyncing: boolean
  } | null
  counts: {
    users: number
    migratedUsers: number
    servers: number
    nodes: number
    locations: number
    allocations: number
    nests: number
    eggs: number
    eggVariables: number
    serverDatabases: number
  }
  availableTargets: string[]
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  loading?: boolean
}

function StatCard({ title, value, icon: Icon, description, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
          <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
          {description && <Skeleton className="h-3 w-20 sm:w-32" />}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{title}</CardTitle>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="text-xl sm:text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const [syncProgress, setSyncProgress] = useState(0)
  const [currentSyncTarget, setCurrentSyncTarget] = useState<string | null>(null)

  // Fetch sync stats using React Query
  const { data: statsResponse, isLoading: loading, refetch } = useApiQuery<SyncStats>("/api/admin/sync")

  const stats = statsResponse ?? null
  const error = statsResponse?.error ?? null

  // Start sync mutation
  const syncMutation = useApiMutation<
    { success: boolean; error?: string },
    { target: string }
  >("POST", "/api/admin/sync", {
    onSuccess: (data) => {
      setSyncProgress(100)
      if (!data.success) {
        toast({
          title: t("sync.error"),
          description: data.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("sync.started"),
          description: t("sync.running"),
        })
        // Refetch stats after a delay
        setTimeout(() => refetch(), 2000)
      }
    },
    onError: (error) => {
      toast({
        title: t("sync.error"),
        description: error.message,
        variant: "destructive",
      })
    },
    onSettled: () => {
      setSyncProgress(0)
      setCurrentSyncTarget(null)
    },
  })

  const runSync = (target: string = "all") => {
    setSyncProgress(0)
    setCurrentSyncTarget(target)

    // Simulate progress stages for better UX
    const progressInterval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 500)

    syncMutation.mutate({ target })
  }

  const isSyncing = syncMutation.isPending

  const formatLastSync = (value: any) => {
    if (!value) return t("sync.never")
    
    // If it's an object with startedAt property, use that
    let dateString = typeof value === "object" && value.startedAt ? value.startedAt : value
    
    // If dateString is still not a string, return never
    if (typeof dateString !== "string") return t("sync.never")
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t("sync.never")
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    } catch {
      return t("sync.never")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchStats()}
            variant="outline"
            size="sm"
            disabled={loading || isSyncing}
          >
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t("actions.refresh")}</span>
          </Button>
          <Button
            onClick={() => runSync("all")}
            size="sm"
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{isSyncing ? t("sync.syncing") : t("sync.runFull")}</span>
            <span className="sm:hidden">{isSyncing ? t("sync.syncing") : "Sync"}</span>
          </Button>
        </div>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("sync.inProgress")}
            </CardTitle>
            <CardDescription>
              {t("sync.syncingTarget", { target: currentSyncTarget })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={syncProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(syncProgress)}% {t("sync.complete")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              {t("error.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Sync Status */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.status?.isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {t("sync.status")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={stats.status?.isSyncing ? "secondary" : "default"}>
                {stats.status?.isSyncing ? t("sync.syncing") : t("sync.idle")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("sync.lastSync")}: {formatLastSync(stats.status?.lastSync || null)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stats.users")}
          value={stats?.counts.users || 0}
          icon={Users}
          description={t("stats.migratedCount", { count: stats?.counts.migratedUsers || 0 })}
          loading={loading}
        />
        <StatCard
          title={t("stats.servers")}
          value={stats?.counts.servers || 0}
          icon={Server}
          loading={loading}
        />
        <StatCard
          title={t("stats.nodes")}
          value={stats?.counts.nodes || 0}
          icon={HardDrive}
          loading={loading}
        />
        <StatCard
          title={t("stats.locations")}
          value={stats?.counts.locations || 0}
          icon={MapPin}
          loading={loading}
        />
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title={t("stats.allocations")}
          value={stats?.counts.allocations || 0}
          icon={Network}
          loading={loading}
        />
        <StatCard
          title={t("stats.nests")}
          value={stats?.counts.nests || 0}
          icon={Layers}
          loading={loading}
        />
        <StatCard
          title={t("stats.eggs")}
          value={stats?.counts.eggs || 0}
          icon={Egg}
          loading={loading}
        />
        <StatCard
          title={t("stats.eggVariables")}
          value={stats?.counts.eggVariables || 0}
          icon={Variable}
          loading={loading}
        />
        <StatCard
          title={t("stats.databases")}
          value={stats?.counts.serverDatabases || 0}
          icon={Database}
          loading={loading}
        />
      </div>

      {/* Quick Sync Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("sync.quickActions")}</CardTitle>
          <CardDescription>{t("sync.quickActionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats?.availableTargets
              .filter((target) => target !== "all")
              .map((target) => (
                <Button
                  key={target}
                  variant="outline"
                  size="sm"
                  onClick={() => runSync(target)}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing && currentSyncTarget === target ? "animate-spin" : ""}`} />
                  {t(`sync.targets.${target}`)}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
