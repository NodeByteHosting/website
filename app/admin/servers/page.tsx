"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Server,
  Search,
  RefreshCw,
  HardDrive,
  Cpu,
  Database,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Play,
  Square,
  Pause,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { Progress } from "@/packages/ui/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/packages/ui/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui/components/ui/tooltip"
import { useToast } from "@/packages/ui/components/ui/use-toast"
import { cn } from "@/packages/core/lib/utils"

interface ServerData {
  id: string
  pterodactylId: number
  uuid: string
  name: string
  description: string | null
  status: string
  isSuspended: boolean
  owner: {
    id: string
    username: string
    email: string
  }
  node: {
    id: number
    name: string
  }
  egg: {
    id: number
    name: string
  }
  properties: Array<{
    key: string
    value: string
  }>
  createdAt: string
  allocations: Array<{
    ip: string
    port: number
    isAssigned: boolean
  }>
}

interface ServerMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

type FilterStatus = "all" | "running" | "offline" | "suspended" | "installing"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
  RUNNING: { label: "Running", variant: "default", icon: Play },
  OFFLINE: { label: "Offline", variant: "secondary", icon: Square },
  STARTING: { label: "Starting", variant: "outline", icon: Activity },
  STOPPING: { label: "Stopping", variant: "outline", icon: Pause },
  INSTALLING: { label: "Installing", variant: "outline", icon: Loader2 },
  INSTALL_FAILED: { label: "Install Failed", variant: "destructive", icon: XCircle },
  SUSPENDED: { label: "Suspended", variant: "destructive", icon: AlertTriangle },
  RESTORING_BACKUP: { label: "Restoring", variant: "outline", icon: RefreshCw },
}

export default function ServersPage() {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const [servers, setServers] = useState<ServerData[]>([])
  const [meta, setMeta] = useState<ServerMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchServers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        filter: filterStatus,
        ...(debouncedSearch && { search: debouncedSearch }),
      })

      const response = await fetch(`/api/admin/servers?${params}`)
      const data = await response.json()

      if (data.success) {
        setServers(data.data)
        setMeta(data.meta)
      } else {
        toast({
          title: t("error.title"),
          description: data.error || "Failed to fetch servers",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: "Failed to connect to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [currentPage, perPage, filterStatus, debouncedSearch, t, toast])

  useEffect(() => {
    fetchServers()
  }, [fetchServers])

  const formatBytes = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`
    }
    return `${mb} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusConfig = (status: string, suspended: boolean) => {
    if (suspended) return statusConfig.SUSPENDED
    return statusConfig[status] || { label: status, variant: "outline" as const, icon: Activity }
  }

  // Calculate stats
  const stats = {
    total: meta?.total || 0,
    running: servers.filter((s) => s.status === "RUNNING" && !s.isSuspended).length,
    offline: servers.filter((s) => s.status === "OFFLINE" && !s.isSuspended).length,
    suspended: servers.filter((s) => s.isSuspended).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("servers.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("servers.description")}
          </p>
        </div>
        <Button
          onClick={() => fetchServers(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          {t("actions.refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("servers.stats.total")}</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("servers.stats.running")}</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-500">{stats.running}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("servers.stats.offline")}</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.offline}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("servers.stats.suspended")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-destructive">{stats.suspended}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("servers.filters.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("servers.filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as FilterStatus); setCurrentPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("servers.filters.all")}</SelectItem>
                  <SelectItem value="running">{t("servers.filters.running")}</SelectItem>
                  <SelectItem value="offline">{t("servers.filters.offline")}</SelectItem>
                  <SelectItem value="suspended">{t("servers.filters.suspended")}</SelectItem>
                  <SelectItem value="installing">{t("servers.filters.installing")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("servers.table.server")}</TableHead>
                  <TableHead>{t("servers.table.status")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("servers.table.owner")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("servers.table.resources")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("servers.table.node")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("servers.table.created")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : servers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Server className="h-8 w-8" />
                        <p>{t("servers.empty.title")}</p>
                        {debouncedSearch && (
                          <p className="text-sm">{t("servers.empty.searchHint")}</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  servers.map((server) => {
                    const statusCfg = getStatusConfig(server.status, server.isSuspended)
                    const StatusIcon = statusCfg.icon
                    const primaryAllocation = server.allocations?.find((a) => a.isAssigned)
                    
                    // Extract resource properties
                    const getProperty = (key: string) => {
                      const prop = server.properties?.find(p => p.key === key)
                      return prop?.value ? parseInt(prop.value, 10) : null
                    }
                    const memory = getProperty("memory")
                    const disk = getProperty("disk")
                    const cpu = getProperty("cpu")
                    
                    return (
                      <TableRow key={server.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Server className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{server.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {primaryAllocation ? (
                                  `${primaryAllocation.ip}:${primaryAllocation.port}`
                                ) : (
                                  <span className="italic">No allocation</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusCfg.variant} className="gap-1">
                            <StatusIcon className={cn(
                              "h-3 w-3",
                              server.status === "INSTALLING" && "animate-spin"
                            )} />
                            {t(`servers.status.${server.status.toLowerCase()}`) || statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <div className="text-sm">{server.owner.username}</div>
                            <div className="text-xs text-muted-foreground">{server.owner.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1 text-xs">
                            <TooltipProvider>
                              {memory !== null && (
                                <div className="flex items-center gap-2">
                                  <HardDrive className="h-3 w-3 text-muted-foreground" />
                                  <Tooltip>
                                    <TooltipTrigger className="cursor-default">
                                      <span>{formatBytes(memory)}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{t("servers.resources.memory")}</TooltipContent>
                                  </Tooltip>
                                </div>
                              )}
                              {disk !== null && (
                                <div className="flex items-center gap-2">
                                  <Database className="h-3 w-3 text-muted-foreground" />
                                  <Tooltip>
                                    <TooltipTrigger className="cursor-default">
                                      <span>{formatBytes(disk)}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{t("servers.resources.disk")}</TooltipContent>
                                  </Tooltip>
                                </div>
                              )}
                              {cpu !== null && (
                                <div className="flex items-center gap-2">
                                  <Cpu className="h-3 w-3 text-muted-foreground" />
                                  <Tooltip>
                                    <TooltipTrigger className="cursor-default">
                                      <span>{cpu}%</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{t("servers.resources.cpu")}</TooltipContent>
                                  </Tooltip>
                                </div>
                              )}
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Badge variant="outline">{server.node.name}</Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(server.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {t("servers.pagination.showing", {
                  from: (currentPage - 1) * perPage + 1,
                  to: Math.min(currentPage * perPage, meta.total),
                  total: meta.total,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("servers.pagination.previous")}
                </Button>
                <div className="flex items-center gap-1 text-sm">
                  <span>{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{meta.totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                >
                  {t("servers.pagination.next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
