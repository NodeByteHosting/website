"use client"

import { useEffect, useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { RefreshCw, Search, Settings2, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/packages/ui/components/ui/card"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"
import { Input } from "@/packages/ui/components/ui/input"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Label } from "@/packages/ui/components/ui/label"
import { Switch } from "@/packages/ui/components/ui/switch"

interface SyncLog {
  id: string
  type: string
  status: string
  itemsTotal?: number
  itemsSynced?: number
  itemsFailed?: number
  error?: string | null
  metadata?: any
  startedAt: string
  completedAt?: string | null
}

export default function SyncLogsPage() {
  const t = useTranslations("admin.syncLogs")
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [statusSummary, setStatusSummary] = useState<any>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>({})
  const [savingSettings, setSavingSettings] = useState(false)

  const fetchData = async (opts?: { append?: boolean; cursor?: string | null }) => {
    setLoading(true)
    try {
      const resStatus = await fetch("/api/admin/sync")
      const statusData = await resStatus.json()
      setStatusSummary(statusData.status || null)

      const url = new URL("/api/admin/sync/logs", location.origin)
      url.searchParams.set("limit", String(limit))
      if (opts?.cursor) url.searchParams.set("cursor", opts.cursor)

      const res = await fetch(url.toString())
      const data = await res.json()
      if (data.success && Array.isArray(data.logs)) {
        if (opts?.append) {
          setLogs((prev) => [...prev, ...data.logs])
        } else {
          setLogs(data.logs)
        }
        setNextCursor(data.nextCursor || null)
      } else {
        setLogs([])
        setNextCursor(null)
      }
    } catch (e) {
      console.error("Failed to load sync logs", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // fetch scheduler settings
    ;(async () => {
      try {
        const res = await fetch("/api/admin/sync/settings")
        const body = await res.json()
        if (body.success) setSettings(body.settings || {})
      } catch (e) {
        console.error("Failed to load sync settings", e)
      }
    })()
  }, [limit])

  const filtered = useMemo(() => {
    if (!query) return logs
    const q = query.toLowerCase()
    return logs.filter((l) => {
      const msg = (l.metadata?.lastMessage || l.error || l.type || "").toString().toLowerCase()
      return msg.includes(q) || l.type.toLowerCase().includes(q)
    })
  }, [logs, query])

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await fetch("/api/admin/sync/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auto_sync_enabled: settings.auto_sync_enabled === "true",
          sync_interval: settings.sync_interval,
        }),
      })
      await fetchData()
    } catch (e) {
      console.error("Failed to save settings", e)
    } finally {
      setSavingSettings(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return (
          <Badge variant="outline" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("status.running")}
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            {t("status.completed")}
          </Badge>
        )
      case "FAILED":
        return (
          <Badge className="gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            {t("status.failed")}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {t("status.pending")}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={() => fetchData()} disabled={loading} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? t("refreshing") : t("refresh")}
        </Button>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{t("scheduler")}</CardTitle>
          </div>
          <CardDescription>
            {statusSummary?.lastRunning ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                {t("running")} ({t("startedAt", { time: statusSummary.lastRunning })})
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                {t("idle")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <Switch
                id="auto-sync"
                checked={settings.auto_sync_enabled === "true"}
                onCheckedChange={(checked) =>
                  setSettings((s: any) => ({ ...s, auto_sync_enabled: checked ? "true" : "false" }))
                }
              />
              <Label htmlFor="auto-sync" className="cursor-pointer">
                {t("autoSync")}
              </Label>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 sm:max-w-[200px]">
              <Label htmlFor="sync-interval" className="text-xs text-muted-foreground">
                {t("intervalSeconds")}
              </Label>
              <Input
                id="sync-interval"
                type="number"
                min={60}
                value={String(settings.sync_interval ?? "")}
                onChange={(e) => setSettings((s: any) => ({ ...s, sync_interval: Number(e.target.value || 0) }))}
                placeholder="3600"
              />
            </div>
            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full sm:w-auto">
              {savingSettings ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("audit")}</CardTitle>
          <CardDescription>{t("auditDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Input
              type="number"
              placeholder={t("limitPlaceholder")}
              value={String(limit)}
              onChange={(e) => setLimit(Number(e.target.value || 50))}
              className="w-full sm:w-24"
              min={1}
              max={100}
            />
          </div>

          {/* Logs List */}
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="divide-y">
              {filtered.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  {t("noEntries")}
                </div>
              ) : (
                filtered.map((log) => (
                  <div key={log.id} className="p-4 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {format(new Date(log.startedAt), "yyyy-MM-dd HH:mm:ss")}
                          </span>
                          <span className="font-semibold">{log.type}</span>
                          {getStatusBadge(log.status)}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {log.metadata?.lastMessage || log.error || "—"}
                        </p>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground sm:flex-col sm:gap-1 sm:text-right">
                        <span>
                          {t("items")}: {log.itemsSynced ?? 0}/{log.itemsTotal ?? 0}
                        </span>
                        <span>
                          {t("failed")}: {log.itemsFailed ?? 0}
                        </span>
                        <span>{log.completedAt ? format(new Date(log.completedAt), "HH:mm:ss") : "—"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Load More */}
          <div className="flex justify-center pt-2">
            {nextCursor ? (
              <Button variant="outline" onClick={() => fetchData({ append: true, cursor: nextCursor })} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t("loadMore")}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">{t("noMoreEntries")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
