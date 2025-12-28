"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  Server,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Power,
  RotateCcw,
  Square,
  Terminal,
  FileCode,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Plus,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { Progress } from "@/packages/ui/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/packages/ui/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"

interface ServerData {
  id: string
  uuid: string
  name: string
  description: string | null
  status: string
  game: string
  node: string
  ip: string
  port: number
  resources: {
    memory: { used: number; limit: number }
    cpu: { used: number; limit: number }
    disk: { used: number; limit: number }
  }
  createdAt: string
}

interface ServerMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

function ServerSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ServerCard({ server }: { server: ServerData }) {
  const t = useTranslations("dashboard.servers")

  const statusConfig = {
    running: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Power, label: t("status.running") },
    online: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Power, label: t("status.online") },
    offline: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: Power, label: t("status.offline") },
    starting: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: RefreshCw, label: t("status.starting") },
    stopping: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Square, label: t("status.stopping") },
    suspended: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertTriangle, label: t("status.suspended") },
    installing: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Loader2, label: t("status.installing") },
  }

  const status = statusConfig[server.status.toLowerCase() as keyof typeof statusConfig] || statusConfig.offline
  const StatusIcon = status.icon

  const memoryPercent = server.resources.memory.limit > 0 
    ? Math.round((server.resources.memory.used / server.resources.memory.limit) * 100) 
    : 0
  const cpuPercent = server.resources.cpu.limit > 0 
    ? Math.round((server.resources.cpu.used / server.resources.cpu.limit) * 100) 
    : 0
  const diskPercent = server.resources.disk.limit > 0 
    ? Math.round((server.resources.disk.used / server.resources.disk.limit) * 100) 
    : 0

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {server.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{server.game}</span>
              <span>•</span>
              <span>{server.node}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={status.color}>
              <StatusIcon className={`h-3 w-3 mr-1 ${server.status.toLowerCase() === "starting" || server.status.toLowerCase() === "installing" ? "animate-spin" : ""}`} />
              {status.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={`https://panel.nodebyte.host/server/${server.uuid}`} target="_blank" rel="noopener noreferrer">
                    <Terminal className="mr-2 h-4 w-4" />
                    {t("actions.console")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`https://panel.nodebyte.host/server/${server.uuid}/files`} target="_blank" rel="noopener noreferrer">
                    <FileCode className="mr-2 h-4 w-4" />
                    {t("actions.files")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`https://panel.nodebyte.host/server/${server.uuid}/databases`} target="_blank" rel="noopener noreferrer">
                    <Database className="mr-2 h-4 w-4" />
                    {t("actions.databases")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`https://panel.nodebyte.host/server/${server.uuid}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t("actions.openPanel")}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Connection Info */}
        <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2 mb-4">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          <code className="font-mono text-xs">
            {server.ip}:{server.port}
          </code>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <MemoryStick className="h-3 w-3" />
                {t("resources.memory")}
              </span>
              <span className="font-medium">{memoryPercent}%</span>
            </div>
            <Progress value={memoryPercent} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground">
              {formatBytes(server.resources.memory.used * 1024 * 1024)} / {formatBytes(server.resources.memory.limit * 1024 * 1024)}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                {t("resources.cpu")}
              </span>
              <span className="font-medium">{cpuPercent}%</span>
            </div>
            <Progress value={cpuPercent} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground">
              {server.resources.cpu.used}% / {server.resources.cpu.limit}%
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {t("resources.disk")}
              </span>
              <span className="font-medium">{diskPercent}%</span>
            </div>
            <Progress value={diskPercent} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground">
              {formatBytes(server.resources.disk.used * 1024 * 1024)} / {formatBytes(server.resources.disk.limit * 1024 * 1024)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ServersPage() {
  const { data: session } = useSession()
  const t = useTranslations("dashboard.servers")
  const [servers, setServers] = useState<ServerData[]>([])
  const [meta, setMeta] = useState<ServerMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  const fetchServers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "12",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      })
      const response = await fetch(`/api/dashboard/servers?${params}`)
      const data = await response.json()
      if (data.success) {
        setServers(data.data)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error("Failed to fetch servers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [page, statusFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchServers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/games">
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.newServer")}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("filters.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                <SelectItem value="running">{t("status.running")}</SelectItem>
                <SelectItem value="offline">{t("status.offline")}</SelectItem>
                <SelectItem value="starting">{t("status.starting")}</SelectItem>
                <SelectItem value="suspended">{t("status.suspended")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchServers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {t("actions.refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <ServerSkeleton key={i} />
          ))}
        </div>
      ) : servers.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("pagination.showing", { from: (page - 1) * meta.perPage + 1, to: Math.min(page * meta.perPage, meta.total), total: meta.total })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("pagination.previous")}
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {page} / {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= meta.totalPages}
                >
                  {t("pagination.next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Server className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t("empty.title")}</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {t("empty.description")}
            </p>
            <Button asChild>
              <Link href="/games">
                <Plus className="mr-2 h-4 w-4" />
                {t("empty.action")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
