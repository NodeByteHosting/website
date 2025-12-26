"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  Play,
  Users,
  Server,
  HardDrive,
  MapPin,
  Network,
  Layers,
  Database,
  Terminal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Progress } from "@/packages/ui/components/ui/progress"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"
import { useToast } from "@/packages/ui/components/ui/use-toast"
import { cn } from "@/packages/core/lib/utils"

interface SyncLog {
  id: string
  time: Date
  message: string
  type: "info" | "success" | "error" | "progress"
  target?: string
}

interface SyncTarget {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "idle" | "running" | "success" | "error"
}

const initialTargets: SyncTarget[] = [
  { id: "locations", name: "Locations", description: "Data center locations", icon: MapPin, status: "idle" },
  { id: "nodes", name: "Nodes", description: "Server nodes", icon: HardDrive, status: "idle" },
  { id: "allocations", name: "Allocations", description: "IP & port allocations", icon: Network, status: "idle" },
  { id: "nests", name: "Nests & Eggs", description: "Game configurations", icon: Layers, status: "idle" },
  { id: "servers", name: "Servers", description: "Server instances", icon: Server, status: "idle" },
  { id: "databases", name: "Databases", description: "Server databases", icon: Database, status: "idle" },
  { id: "users", name: "Users", description: "User accounts", icon: Users, status: "idle" },
]

export default function SyncPage() {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const [targets, setTargets] = useState<SyncTarget[]>(initialTargets)
  const [isRunning, setIsRunning] = useState(false)
  const [currentTarget, setCurrentTarget] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [logs, setLogs] = useState<SyncLog[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const addLog = useCallback((message: string, type: SyncLog["type"] = "info", target?: string) => {
    const log: SyncLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      time: new Date(),
      message,
      type,
      target,
    }
    setLogs((prev) => [...prev, log].slice(-100))
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/admin/sync")
      const data = await response.json()
      if (data.success && data.status?.lastSync) {
        setLastSyncTime(new Date(data.status.lastSync))
      }
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    }
  }

  // Poll server sync logs while a sync is running to show live progress/messages
  const serverPollRef = useRef<number | null>(null)
  const lastServerLogId = useRef<string | null>(null)

  useEffect(() => {
    if (!isRunning) {
      if (serverPollRef.current) {
        clearInterval(serverPollRef.current)
        serverPollRef.current = null
      }
      return
    }

    const poll = async () => {
      try {
        const res = await fetch('/api/admin/sync/logs?limit=5')
        const data = await res.json()
        if (data.success && Array.isArray(data.logs) && data.logs.length > 0) {
          const latest = data.logs[0]
          // Update progress if available
          const itemsTotal = latest.itemsTotal || 0
          const itemsSynced = latest.itemsSynced || 0
          if (itemsTotal > 0) {
            setProgress(Math.round((itemsSynced / itemsTotal) * 100))
          }

          // Add message if there's a new server-side message
          const lastMessage = latest.metadata?.lastMessage
          if (latest.id !== lastServerLogId.current && lastMessage) {
            addLog(lastMessage, 'progress')
            lastServerLogId.current = latest.id
          }
        }
      } catch (e) {
        console.error('Failed to poll sync logs', e)
      }
    }

    // initial fetch
    poll()
    serverPollRef.current = window.setInterval(poll, 2000)

    return () => {
      if (serverPollRef.current) clearInterval(serverPollRef.current)
      serverPollRef.current = null
    }
  }, [isRunning])

  const requestCancel = async () => {
    try {
      const res = await fetch('/api/admin/sync/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        addLog('Cancellation requested', 'info')
        toast({ title: 'Cancellation requested' })
      } else {
        addLog(`Cancel failed: ${data.error}`, 'error')
        toast({ title: 'Cancel failed', variant: 'destructive' })
      }
    } catch (e) {
      addLog('Cancel failed: network error', 'error')
      toast({ title: 'Cancel failed', variant: 'destructive' })
    }
  }

  const scrollToLogsMobile = () => {
    // smooth scroll to logs area for mobile users
    logsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const updateTargetStatus = (targetId: string, status: SyncTarget["status"]) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, status } : t)))
  }

  const resetTargets = () => {
    setTargets(initialTargets.map((t) => ({ ...t, status: "idle" })))
  }

  const runSingleSync = async (targetId: string) => {
    if (isRunning) return

    setIsRunning(true)
    setCurrentTarget(targetId)
    updateTargetStatus(targetId, "running")
    
    const target = targets.find((t) => t.id === targetId)
    addLog(`Starting sync: ${target?.name}...`, "info", targetId)

    try {
      const response = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: targetId }),
      })

      const data = await response.json()

      if (data.success) {
        updateTargetStatus(targetId, "success")
        const result = data.result?.[targetId]
        if (result) {
          addLog(`✓ ${target?.name}: ${formatResult(result)}`, "success", targetId)
        } else {
          addLog(`✓ ${target?.name} synced successfully`, "success", targetId)
        }
        toast({ title: `${target?.name} synced` })
      } else {
        updateTargetStatus(targetId, "error")
        addLog(`✗ ${target?.name} failed: ${data.error}`, "error", targetId)
        toast({ title: `${target?.name} sync failed`, variant: "destructive" })
      }
    } catch (error) {
      updateTargetStatus(targetId, "error")
      addLog(`✗ ${target?.name} failed: Network error`, "error", targetId)
      toast({ title: `${target?.name} sync failed`, variant: "destructive" })
    } finally {
      setIsRunning(false)
      setCurrentTarget(null)
    }
  }

  const runFullSync = async () => {
    if (isRunning) return

    setIsRunning(true)
    setProgress(0)
    resetTargets()
    setLogs([])

    addLog("═══ Starting Full Sync ═══", "info")
    addLog("Connecting to Pterodactyl panel...", "progress")

    const syncOrder = ["locations", "nodes", "allocations", "nests", "servers", "databases", "users"]
    let completedCount = 0

    for (const targetId of syncOrder) {
      setCurrentTarget(targetId)
      updateTargetStatus(targetId, "running")
      
      const target = targets.find((t) => t.id === targetId)
      addLog(`Syncing ${target?.name}...`, "progress", targetId)
      setProgress(Math.round((completedCount / syncOrder.length) * 100))

      try {
        const response = await fetch("/api/admin/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: targetId }),
        })

        const data = await response.json()

        if (data.success) {
          updateTargetStatus(targetId, "success")
          const result = data.result?.[targetId]
          if (result) {
            addLog(`  ✓ ${formatResult(result)}`, "success", targetId)
          } else {
            addLog(`  ✓ Completed`, "success", targetId)
          }
        } else {
          updateTargetStatus(targetId, "error")
          addLog(`  ✗ Failed: ${data.error}`, "error", targetId)
        }
      } catch (error) {
        updateTargetStatus(targetId, "error")
        addLog(`  ✗ Network error`, "error", targetId)
      }

      completedCount++
      
      // Small delay between syncs for visual feedback
      await new Promise((r) => setTimeout(r, 300))
    }

    setProgress(100)
    setLastSyncTime(new Date())
    addLog("═══ Full Sync Complete ═══", "success")
    toast({ title: "Full sync completed" })

    setIsRunning(false)
    setCurrentTarget(null)
  }

  const formatResult = (result: Record<string, unknown>): string => {
    const parts: string[] = []
    if (typeof result.created === "number") parts.push(`${result.created} created`)
    if (typeof result.updated === "number") parts.push(`${result.updated} updated`)
    if (typeof result.synced === "number") parts.push(`${result.synced} synced`)
    if (typeof result.count === "number") parts.push(`${result.count} total`)
    return parts.length > 0 ? parts.join(", ") : "Synced"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sync Management</h1>
          <p className="text-sm text-muted-foreground">
            Synchronize data from your Pterodactyl panel
          </p>
        </div>
        <Button 
          onClick={runFullSync} 
          disabled={isRunning} 
          size="lg"
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
              <span className="sm:hidden">Sync</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Run Full Sync</span>
              <span className="sm:hidden">Sync All</span>
            </>
          )}
        </Button>
        {isRunning && (
          <div className="ml-3 flex flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={requestCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={scrollToLogsMobile} className="sm:hidden">
              View Logs
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Sync Targets */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress Bar (when running) */}
          {isRunning && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {currentTarget && (
                      <span>Syncing {targets.find((t) => t.id === currentTarget)?.name}...</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Sync Targets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sync Targets</CardTitle>
              <CardDescription>Click any target to sync individually</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => runSingleSync(target.id)}
                  disabled={isRunning}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    "hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed",
                    target.status === "running" && "border-primary bg-primary/5",
                    target.status === "success" && "border-green-500/50 bg-green-500/5",
                    target.status === "error" && "border-destructive/50 bg-destructive/5"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md",
                    target.status === "idle" && "bg-muted",
                    target.status === "running" && "bg-primary/10",
                    target.status === "success" && "bg-green-500/10",
                    target.status === "error" && "bg-destructive/10"
                  )}>
                    {target.status === "running" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : target.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : target.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <target.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{target.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{target.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Last Sync Info */}
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Full Sync</p>
                  <p className="text-xs text-muted-foreground">{formatDate(lastSyncTime)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchStatus} disabled={isRunning}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Logs */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Live Logs</CardTitle>
                </div>
                {isRunning && (
                  <Badge variant="outline" className="gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] lg:h-[500px]">
                <div className="p-4 pt-0 space-y-1 font-mono text-xs">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Run a sync to see logs here
                    </p>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className={cn(
                          "py-1 border-l-2 pl-2",
                          log.type === "success" && "border-green-500 text-green-600 dark:text-green-400",
                          log.type === "error" && "border-destructive text-destructive",
                          log.type === "progress" && "border-blue-500 text-blue-600 dark:text-blue-400",
                          log.type === "info" && "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        <span className="opacity-50">[{formatTime(log.time)}]</span>{" "}
                        {log.message}
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
