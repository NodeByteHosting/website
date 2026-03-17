"use client"

import { useAuth } from "@/packages/auth"
import { useAdminLocations, useTriggerSync, useSyncStatus } from "@/packages/core"
import { MapPin, RefreshCw, HardDrive, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/packages/ui/components/ui/table"
import { cn } from "@/packages/core/lib/utils"

interface Location {
  id: number
  shortCode: string
  description: string
  nodeCount: number
}

export default function LocationsPage() {
  const { user } = useAuth()

  const { data: locResponse, isLoading, refetch } = useAdminLocations({ enabled: !!user })
  const triggerSync = useTriggerSync()
  const { data: syncStatus } = useSyncStatus()

  const locData = locResponse as any
  const locations: Location[] = locData?.locations || []

  const syncRunning = (syncStatus as any)?.status === "RUNNING"

  const handleSync = () => {
    triggerSync.mutate(
      { type: "locations" },
      { onSuccess: () => setTimeout(() => refetch(), 2000) }
    )
  }

  const totalNodes = locations.reduce((sum, l) => sum + l.nodeCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
            Locations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Data centre locations synced from the Pterodactyl panel
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={handleSync}
            disabled={triggerSync.isPending || syncRunning}
            size="sm"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", (triggerSync.isPending || syncRunning) && "animate-spin")} />
            {syncRunning ? "Syncing…" : "Sync Locations"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{locations.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalNodes}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Nodes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MapPin className="h-8 w-8" />
                      <p>No locations found — run a sync to populate</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Hash className="h-3 w-3" />
                        {loc.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {loc.shortCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {loc.description || <span className="text-muted-foreground text-xs italic">No description</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{loc.nodeCount}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
