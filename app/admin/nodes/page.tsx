"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  HardDrive,
  Search,
  RefreshCw,
  MapPin,
  Server,
  Network,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
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
import { cn } from "@/packages/core/lib/utils"
import { useAdminNodes, useToggleNodeMaintenance } from "@/packages/core"
import { useAuth } from "@/packages/auth"

interface NodeData {
  id: number
  uuid: string
  name: string
  description: string
  fqdn: string
  scheme: string
  behindProxy: boolean
  isPublic: boolean
  isMaintenanceMode: boolean
  memory: number
  memoryOverallocate: number
  disk: number
  diskOverallocate: number
  daemonListenPort: number
  daemonSftpPort: number
  locationId: number
  locationCode: string
  serverCount: number
  allocationCount: number
  createdAt: string
  updatedAt: string
}

type MaintenanceFilter = "all" | "yes" | "no"

const formatBytes = (mb: number) => {
  if (mb === 0) return "Unlimited"
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

export default function NodesPage() {
  const t = useTranslations("admin")
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [maintenanceFilter, setMaintenanceFilter] = useState<MaintenanceFilter>("all")
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: response, isLoading, refetch } = useAdminNodes({
    page: currentPage,
    perPage,
    search: debouncedSearch || undefined,
    maintenance: maintenanceFilter === "all" ? undefined : maintenanceFilter === "yes",
  }, { enabled: !!user })

  const toggleMaintenance = useToggleNodeMaintenance()

  const nodesData = response as any
  const nodes: NodeData[] = nodesData?.nodes || []
  const meta = nodesData?.pagination || null

  const stats = {
    total: meta?.total || 0,
    maintenance: nodes.filter((n) => n.isMaintenanceMode).length,
    totalServers: nodes.reduce((sum, n) => sum + n.serverCount, 0),
    totalAllocations: nodes.reduce((sum, n) => sum + n.allocationCount, 0),
  }

  const handleToggleMaintenance = async (node: NodeData) => {
    setTogglingId(node.id)
    try {
      await toggleMaintenance.mutateAsync({ nodeId: node.id })
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <HardDrive className="h-6 w-6 sm:h-8 sm:w-8" />
            Nodes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage Pterodactyl nodes and their allocations</p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline" size="sm">
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          {t("actions.refresh")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.total}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold text-yellow-500">{stats.maintenance}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.totalServers}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocations</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.totalAllocations}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or FQDN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={maintenanceFilter} onValueChange={(v) => { setMaintenanceFilter(v as MaintenanceFilter); setCurrentPage(1) }}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nodes</SelectItem>
                  <SelectItem value="yes">In Maintenance</SelectItem>
                  <SelectItem value="no">Online</SelectItem>
                </SelectContent>
              </Select>
              <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setCurrentPage(1) }}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Resources</TableHead>
                  <TableHead className="hidden lg:table-cell">Servers</TableHead>
                  <TableHead className="hidden xl:table-cell">Ports</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : nodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <HardDrive className="h-8 w-8" />
                        <p>No nodes found</p>
                        {debouncedSearch && <p className="text-sm">Try a different search term</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  nodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <HardDrive className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{node.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{node.fqdn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex flex-col gap-1">
                            {node.isMaintenanceMode ? (
                              <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-400">
                                <AlertTriangle className="h-3 w-3" />
                                Maintenance
                              </Badge>
                            ) : (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Online
                              </Badge>
                            )}
                            {!node.isPublic && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="text-xs">Private</Badge>
                                </TooltipTrigger>
                                <TooltipContent>This node is not visible to users</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{node.locationCode || `Location #${node.locationId}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div>
                            <span className="text-muted-foreground">RAM: </span>
                            <span className="font-medium">{formatBytes(node.memory)}</span>
                            {node.memoryOverallocate > 0 && (
                              <span className="text-muted-foreground"> +{node.memoryOverallocate}%</span>
                            )}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Disk: </span>
                            <span className="font-medium">{formatBytes(node.disk)}</span>
                            {node.diskOverallocate > 0 && (
                              <span className="text-muted-foreground"> +{node.diskOverallocate}%</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div>
                            <span className="text-muted-foreground">Servers: </span>
                            <span className="font-medium">{node.serverCount}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Allocs: </span>
                            <span className="font-medium">{node.allocationCount}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div>
                            <span className="text-muted-foreground">Daemon: </span>
                            <span className="font-mono">{node.scheme}://{node.fqdn}:{node.daemonListenPort}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">SFTP: </span>
                            <span className="font-mono">{node.fqdn}:{node.daemonSftpPort}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleMaintenance(node)}
                          disabled={togglingId === node.id}
                          className={cn(
                            node.isMaintenanceMode
                              ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                              : "border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                          )}
                        >
                          {togglingId === node.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : node.isMaintenanceMode ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {node.isMaintenanceMode ? "Go Online" : "Maintenance"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * perPage + 1}&ndash;{Math.min(currentPage * perPage, meta.total)} of {meta.total} nodes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1 text-sm">
                  <span>{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{meta.totalPages}</span>
                </div>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                >
                  Next
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
