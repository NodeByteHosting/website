"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Network,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Server,
  HardDrive,
  Filter,
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
import { cn } from "@/packages/core/lib/utils"
import { useAdminAllocations, useAdminNodes } from "@/packages/core"
import { useAuth } from "@/packages/auth"

interface AllocationRow {
  id: number
  ip: string
  port: number
  alias: string | null
  isAssigned: boolean
  nodeId: number
  nodeName: string
  nodeFqdn: string
  serverId: string | null
  serverPterodactylId: number | null
  serverName: string | null
}

type AssignedFilter = "all" | "yes" | "no"

export default function AllocationsPage() {
  const t = useTranslations("admin")
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [assignedFilter, setAssignedFilter] = useState<AssignedFilter>("all")
  const [nodeFilter, setNodeFilter] = useState<string>("all")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: allocResponse, isLoading, refetch } = useAdminAllocations(
    {
      page: currentPage,
      perPage,
      assigned: assignedFilter !== "all" ? assignedFilter : undefined,
      nodeId: nodeFilter !== "all" ? nodeFilter : undefined,
      search: debouncedSearch || undefined,
    },
    { enabled: !!user }
  )

  const { data: nodesResponse } = useAdminNodes({ perPage: 200 }, { enabled: !!user })

  const allocData = allocResponse as any
  const allocations: AllocationRow[] = allocData?.allocations || []
  const meta = allocData?.pagination || null

  const nodesData = nodesResponse as any
  const nodes: { id: number; name: string }[] = nodesData?.nodes || []

  const stats = {
    total: meta?.total || 0,
    assigned: allocations.filter((a) => a.isAssigned).length,
    unassigned: allocations.filter((a) => !a.isAssigned).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network className="h-6 w-6 sm:h-8 sm:w-8" />
            Allocations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all port allocations across nodes
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline" size="sm">
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          {t("actions.refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocations</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.total}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold text-green-500">{stats.assigned}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.unassigned}</div>}
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
                placeholder="Search by IP address or alias…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Node filter */}
              <Select value={nodeFilter} onValueChange={(v) => { setNodeFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <HardDrive className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Nodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nodes</SelectItem>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={String(node.id)}>{node.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Assigned filter */}
              <Select value={assignedFilter} onValueChange={(v) => { setAssignedFilter(v as AssignedFilter); setCurrentPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Assigned</SelectItem>
                  <SelectItem value="no">Unassigned</SelectItem>
                </SelectContent>
              </Select>

              {/* Per-page */}
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
                  <TableHead>IP : Port</TableHead>
                  <TableHead className="hidden sm:table-cell">Alias</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Server</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : allocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Network className="h-8 w-8" />
                        <p>No allocations found</p>
                        {debouncedSearch && <p className="text-sm">Try a different search term</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allocations.map((alloc) => (
                    <TableRow key={alloc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                            <Network className="h-4 w-4" />
                          </div>
                          <div>
                            <code className="text-sm font-mono">
                              {alloc.ip}:{alloc.port}
                            </code>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {alloc.alias ? (
                          <span className="text-sm">{alloc.alias}</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="text-xs">{alloc.nodeName}</Badge>
                          <div className="text-xs text-muted-foreground mt-0.5">{alloc.nodeFqdn}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {alloc.isAssigned ? (
                          <Badge variant="default" className="gap-1 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Assigned
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <XCircle className="h-3 w-3" />
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {alloc.serverName ? (
                          <div className="flex items-center gap-2">
                            <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <div>
                              <div className="text-sm">{alloc.serverName}</div>
                              {alloc.serverPterodactylId && (
                                <div className="text-xs text-muted-foreground">#{alloc.serverPterodactylId}</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
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
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, meta.total)} of {meta.total}
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
