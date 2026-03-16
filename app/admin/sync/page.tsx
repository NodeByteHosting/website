"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import { useApiQuery, useApiMutation } from "@/packages/core"
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

  // Fetch sync status using React Query
  const { data: statusResponse, refetch: refetchStatus } = useApiQuery<{
    success: boolean
    status: { lastSync: string | null; isSyncing: boolean }
    counts: Record<string, number>
    availableTargets: string[]
  }>("/api/admin/sync")

  // Start sync mutation (for single target)
  const singleSyncMutation = useApiMutation<
    { success: boolean; result?: Record<string, any>; error?: string },
    { target: string }
  >("POST", "/api/admin/sync", {
    onSuccess: (data) => {
      if (data.success) {
        refetchStatus()
      }
    },
  })

  // Start full sync mutation
  const fullSyncMutation = useApiMutation<
    { success: boolean; error?: string },
    { type: string }
  >("POST", "/api/admin/sync", {
    onSuccess: (data) => {
      if (data.success) {
        refetchStatus()
      }
    },
  })

  // Cancel sync mutation
  const cancelMutation = useApiMutation<
    { success: boolean; error?: string },
    void
  >("POST", "/api/admin/sync/cancel", {
    onSuccess: (data) => {
      if (data.success) {
        refetchStatus()
      }
    },
  })

  // Initialize sync status on mount
  useEffect(() => {
    if (statusResponse?.status?.lastSync) {
      setLastSyncTime(new Date(statusResponse.status.lastSync))
    }
  }, [statusResponse])

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

  // Poll server sync logs for single sync operations (not used during fullSync)
  const serverPollRef = useRef<number | null>(null)
  const lastServerLogId = useRef<string | null>(null)

  // Fetch sync logs using React Query (disabled by default, enabled during polling)
  const { data: logsResponse, refetch: refetchLogs } = useApiQuery<{
    success: boolean
    logs: any[]
  }>("/api/admin/sync/logs", { limit: "5" }, { enabled: false })


  useEffect(() => {
    // Skip polling if a full sync SSE stream is active (eventSourceRef handles it)
    if (!isRunning || eventSourceRef.current !== null) {
      if (serverPollRef.current) {
        clearInterval(serverPollRef.current)
        serverPollRef.current = null
      }
      return
    }

    const poll = async () => {
      try {
        const data = await refetchLogs()
        if (data.data?.success && Array.isArray(data.data.logs) && data.data.logs.length > 0) {
          const latest = data.data.logs[0]
          
          // Parse metadata if it's a string
          let metadata = latest.metadata
          if (typeof metadata === 'string') {
            try {
              metadata = JSON.parse(metadata)
            } catch {
              metadata = {}
            }
          }

          // Update progress from metadata with detailed info
          const itemsTotal = metadata?.itemsTotal || latest.itemsTotal || 0
          const itemsProcessed = metadata?.itemsProcessed || latest.itemsSynced || 0
          
          if (itemsTotal > 0) {
            setProgress(Math.round((itemsProcessed / itemsTotal) * 100))
          }

          // Add message if there's a new server-side message with detailed progress
          const lastMessage = metadata?.lastMessage
          if (latest.id !== lastServerLogId.current && lastMessage) {
            // Enhanced message with progress details
            let displayMessage = lastMessage
            if (itemsProcessed > 0 && itemsTotal > 0) {
              const percentage = Math.round((itemsProcessed / itemsTotal) * 100)
              displayMessage = `${lastMessage} [${itemsProcessed}/${itemsTotal} - ${percentage}%]`
            }
            addLog(displayMessage, 'progress')
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
  }, [isRunning, refetchLogs, addLog])

  const requestCancel = () => {
    cancelMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          addLog('Cancellation requested', 'info')
          toast({ title: 'Cancellation requested' })
        } else {
          addLog(`Cancel failed: ${data.error}`, 'error')
          toast({ title: 'Cancel failed', variant: 'destructive' })
        }
      },
      onError: (error) => {
        addLog('Cancel failed: network error', 'error')
        toast({ title: 'Cancel failed', variant: 'destructive' })
      },
    })
  }

  const scrollToLogsMobile = () => {
    // smooth scroll to logs area for mobile users
    logsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  useEffect(() => {
    refetchStatus()
  }, [refetchStatus])

  const updateTargetStatus = (targetId: string, status: SyncTarget["status"]) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, status } : t)))
  }

  const resetTargets = () => {
    setTargets(initialTargets.map((t) => ({ ...t, status: "idle" })))
  }

  const runSingleSync = (targetId: string) => {
    if (isRunning) return

    setIsRunning(true)
    setCurrentTarget(targetId)
    updateTargetStatus(targetId, "running")

    const target = targets.find((t) => t.id === targetId)
    addLog(`Starting sync: ${target?.name}...`, "info", targetId)

    singleSyncMutation.mutate(
      { type: targetId } as any,
      {
        onSuccess: (data) => {
          if (!data.success) {
            updateTargetStatus(targetId, "error")
            addLog(`✗ ${target?.name} failed: ${data.error}`, "error", targetId)
            toast({ title: `${target?.name} sync failed`, variant: "destructive" })
            setIsRunning(false)
            setCurrentTarget(null)
            return
          }

          const syncLogId = (data as any).sync_log_id
          addLog(`✓ Enqueued — streaming progress...`, "progress", targetId)

          const apiBase = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"
          const token = (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "") || ""
          const sseUrl = `${apiBase}/api/admin/sync/stream/${syncLogId}?token=${encodeURIComponent(token)}`

          const es = new EventSource(sseUrl)
          eventSourceRef.current = es

          const stopSingleStream = () => {
            es.close()
            if (eventSourceRef.current === es) eventSourceRef.current = null
            setIsRunning(false)
            setCurrentTarget(null)
            refetchStatus()
          }

          es.addEventListener("update", (e: MessageEvent) => {
            try {
              const payload = JSON.parse(e.data)
              const meta = payload.metadata || {}
              const lastMessage: string = meta.lastMessage || ""
              if (lastMessage) addLog(lastMessage, "progress", targetId)
            } catch {}
          })

          es.addEventListener("done", (e: MessageEvent) => {
            try {
              const payload = JSON.parse(e.data)
              if (payload.status === "COMPLETED") {
                updateTargetStatus(targetId, "success")
                addLog(`✓ ${target?.name} synced successfully`, "success", targetId)
                toast({ title: `${target?.name} synced` })
              } else if (payload.status === "FAILED") {
                updateTargetStatus(targetId, "error")
                const errMsg = payload.metadata?.error || payload.metadata?.failed_step || "Unknown error"
                addLog(`✗ ${target?.name} failed: ${errMsg}`, "error", targetId)
                toast({ title: `${target?.name} sync failed`, variant: "destructive" })
              }
            } catch {}
            stopSingleStream()
          })

          es.onerror = () => {
            updateTargetStatus(targetId, "error")
            addLog(`✗ ${target?.name}: stream connection lost`, "error", targetId)
            toast({ title: `${target?.name} sync failed`, variant: "destructive" })
            stopSingleStream()
          }
        },
        onError: (error) => {
          updateTargetStatus(targetId, "error")
          addLog(`✗ ${target?.name} failed: Network error`, "error", targetId)
          toast({ title: `${target?.name} sync failed`, variant: "destructive" })
          setIsRunning(false)
          setCurrentTarget(null)
        },
      }
    )
  }

  // EventSource ref for SSE streaming — closed on unmount and on terminal sync state
  const eventSourceRef = useRef<EventSource | null>(null)
  useEffect(() => () => { eventSourceRef.current?.close() }, [])

  const runFullSync = () => {
    if (isRunning) return

    setIsRunning(true)
    setProgress(0)
    resetTargets()
    setLogs([])

    addLog("═══ Starting Full Sync ═══", "info")
    addLog("Connecting to Pterodactyl panel...", "progress")

    fullSyncMutation.mutate(
      { type: "full" },
      {
        onSuccess: (data) => {
          if (!data.success) {
            addLog(`✗ Sync failed: ${data.error}`, "error")
            toast({ title: "Sync failed", variant: "destructive" })
            setIsRunning(false)
            return
          }

          const syncLogId = (data as any).sync_log_id
          addLog("✓ Sync enqueued — streaming live updates...", "progress")

          // Connect directly to the backend SSE endpoint.
          // EventSource cannot send Authorization headers, so the JWT is passed
          // as a query param and validated server-side.
          const apiBase = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"
          const token = (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "") || ""
          const sseUrl = `${apiBase}/api/admin/sync/stream/${syncLogId}?token=${encodeURIComponent(token)}`

          const es = new EventSource(sseUrl)
          eventSourceRef.current = es

          const syncOrder = ["locations", "nodes", "allocations", "nests", "servers", "databases", "users"]
          let hasStarted = false
          let lastStep = ""

          let intentionallyClosed = false
          const stopStream = (finalStatus?: string) => {
            intentionallyClosed = true
            es.close()
            eventSourceRef.current = null
            setIsRunning(false)
            if (finalStatus !== "CANCELLED") refetchStatus()
          }

          es.addEventListener("connected", () => {
            addLog("✓ Live sync stream connected", "progress")
          })

          es.addEventListener("update", (e: MessageEvent) => {
            try {
              const payload = JSON.parse(e.data)
              const meta = payload.metadata || {}
              const status: string = payload.status

              if (!hasStarted && status === "RUNNING") {
                hasStarted = true
                addLog("✓ Backend sync started — processing data...", "progress")
              }

              if (status === "RUNNING") {
                // Use the real step-based progress written by the worker
                // (0 → starting, 15 → nodes, 30 → allocations, 45 → nests,
                //  60 → servers, 75 → users, 85 → databases, 100 → done)
                const metaProgress = typeof meta.progress === "number" ? meta.progress : 50
                setProgress(metaProgress)

                const step: string = meta.step || ""
                if (step && step !== "starting" && step !== lastStep) {
                  lastStep = step
                  const stepIdx = syncOrder.indexOf(step)
                  if (stepIdx >= 0) {
                    syncOrder.forEach((s, i) => {
                      if (i < stepIdx) updateTargetStatus(s, "success")
                      else if (i === stepIdx) updateTargetStatus(s, "running")
                    })
                  }
                }

                const lastMessage: string = meta.lastMessage || ""
                if (lastMessage) {
                  const itemsTotal: number = meta.itemsTotal || 0
                  const itemsProcessed: number = meta.itemsProcessed || 0
                  let displayMessage = lastMessage
                  if (step && itemsTotal > 0 && itemsProcessed > 0) {
                    const pct = Math.round((itemsProcessed / itemsTotal) * 100)
                    displayMessage = `${step}: ${lastMessage} [${itemsProcessed}/${itemsTotal} – ${pct}%]`
                  } else if (step) {
                    displayMessage = `${step}: ${lastMessage}`
                  }
                  addLog(displayMessage, "progress", step || undefined)
                }
              }
            } catch (err) {
              console.error("SSE parse error", err)
            }
          })

          es.addEventListener("done", (e: MessageEvent) => {
            try {
              const payload = JSON.parse(e.data)
              const status: string = payload.status
              const meta = payload.metadata || {}

              if (status === "COMPLETED") {
                setProgress(100)
                syncOrder.forEach((s) => updateTargetStatus(s, "success"))
                addLog("═══ Full Sync Complete ═══", "success")
                setLastSyncTime(new Date())
                toast({ title: "Full sync completed" })
              } else if (status === "FAILED") {
                const failedStep: string = meta.failed_step || meta.step || ""
                if (failedStep) updateTargetStatus(failedStep, "error")
                addLog(`✗ Sync failed: ${meta.error || "Unknown error"}`, "error")
                toast({ title: "Sync failed", variant: "destructive" })
              } else if (status === "CANCELLED") {
                addLog("⚠️ Sync cancelled", "info")
              }
              stopStream(status)
            } catch {}
          })

          es.onerror = () => {
            if (intentionallyClosed) return
            addLog("✗ Streaming connection lost", "error")
            stopStream()
            toast({ title: "Connection lost", variant: "destructive" })
          }
        },
        onError: (error) => {
          addLog(`✗ Network error: ${error.message}`, "error")
          toast({ title: "Sync failed", variant: "destructive" })
          setIsRunning(false)
        },
      }
    )
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
              <Button variant="ghost" size="sm" onClick={refetchStatus} disabled={isRunning}>
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
