"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Settings,
  Save,
  RefreshCw,
  Server,
  Link,
  Shield,
  Bell,
  Database,
  Globe,
  Key,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Construction,
  Trash2,
  Plus,
  ChevronDown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Switch } from "@/packages/ui/components/ui/switch"
import { Separator } from "@/packages/ui/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/packages/ui/components/ui/select"
import { useToast } from "@/packages/core/hooks/use-toast"
import { cn } from "@/packages/core/lib/utils"

interface ConnectionStatus {
  connected: boolean
  latency?: number
  version?: string
  error?: string
}

interface DiscordWebhook {
  id: string
  name: string
  webhookUrl: string
  type: "GAME_SERVER" | "VPS" | "SYSTEM" | "BILLING" | "SECURITY" | "SUPPORT" | "CUSTOM"
  scope?: "ADMIN" | "USER" | "PUBLIC"
  description?: string
  enabled: boolean
  testSuccessAt?: string
  createdAt: string
}

interface SystemSettings {
  // Pterodactyl
  pterodactylUrl: string
  pterodactylApiKey: string
  pterodactylApi: string
  
  // Virtfusion
  virtfusionUrl: string
  virtfusionApiKey: string
  virtfusionApi: string
  
  // Crowdin
  crowdinProjectId: string
  crowdinPersonalToken: string
  
  // GitHub
  githubToken: string
  githubRepositories: string // JSON array string
  
  // Features
  registrationEnabled: boolean
  maintenanceMode: boolean
  autoSyncEnabled: boolean
  
  // Email
  emailNotifications: boolean
  resendApiKey: string
  
  // Discord
  discordNotifications: boolean
  discordWebhooks: DiscordWebhook[]
  
  // Advanced
  cacheTimeout: number
  syncInterval: number
  
  // Admin
  adminEmail: string
  siteName: string
  siteUrl: string
}

const MASKED_VALUE = "••••••••••••••••••••"

export default function SettingsPage() {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState<string | null>(null)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [showCrowdin, setShowCrowdin] = useState(false)
  const [showGithub, setShowGithub] = useState(false)
  const [showVirtfusion, setShowVirtfusion] = useState(false)
  const [showDatabase, setShowDatabase] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [maskedFields, setMaskedFields] = useState<Set<string>>(new Set())
  const [githubReposInput, setGithubReposInput] = useState("")
  const [editingRepoIndex, setEditingRepoIndex] = useState<number | null>(null)
  const [editingRepoValue, setEditingRepoValue] = useState<string>("")
  const [newRepoInput, setNewRepoInput] = useState<string>("")
  
  // Webhook state
  const [webhooks, setWebhooks] = useState<DiscordWebhook[]>([])
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)
  const [deletingWebhook, setDeletingWebhook] = useState<string | null>(null)
  const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null)
  const [editingWebhookForm, setEditingWebhookForm] = useState<any>(null)
  const [newWebhookForm, setNewWebhookForm] = useState({
    name: "",
    webhookUrl: "",
    type: "SYSTEM" as const,
    description: "",
    scope: "ADMIN" as const,
  })
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false)
  
  // Connection statuses
  const [pterodactylStatus, setPterodactylStatus] = useState<ConnectionStatus>({ connected: false })
  const [virtfusionStatus, setVirtfusionStatus] = useState<ConnectionStatus>({ connected: false })
  const [databaseStatus, setDatabaseStatus] = useState<ConnectionStatus>({ connected: false })
  
  // Settings state
  const [settings, setSettings] = useState<SystemSettings>({
    pterodactylUrl: "",
    pterodactylApiKey: "",
    pterodactylApi: "",
    virtfusionUrl: "",
    virtfusionApiKey: "",
    virtfusionApi: "",
    crowdinProjectId: "",
    crowdinPersonalToken: "",
    githubToken: "",
    githubRepositories: "[]",
    registrationEnabled: true,
    maintenanceMode: false,
    autoSyncEnabled: true,
    emailNotifications: true,
    resendApiKey: "",
    discordNotifications: false,
    discordWebhooks: [],
    cacheTimeout: 60,
    syncInterval: 3600,
    adminEmail: "",
    siteName: "NodeByte Hosting",
    siteUrl: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      
      if (data.success) {
        // Track which fields are masked (already set)
        const masked = new Set<string>()
        if (data.settings.pterodactylApiKey === MASKED_VALUE) masked.add("pterodactylApiKey")
        if (data.settings.virtfusionApiKey === MASKED_VALUE) masked.add("virtfusionApiKey")
        if (data.settings.crowdinPersonalToken === MASKED_VALUE) masked.add("crowdinPersonalToken")
        if (data.settings.githubToken === MASKED_VALUE) masked.add("githubToken")
        if (data.settings.resendApiKey === MASKED_VALUE) masked.add("resendApiKey")
        setMaskedFields(masked)

        // `githubRepositories` may be an array (new API) or a JSON string (legacy)
        let repos: string[] = []
        const raw = data.settings.githubRepositories
        if (Array.isArray(raw)) {
          repos = raw
        } else if (typeof raw === "string" && raw.length) {
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) repos = parsed
          } catch {
            // fallback: treat as newline-separated or single value
            repos = raw.split("\n").map((r: string) => r.trim()).filter(Boolean)
          }
        }
        setGithubReposInput(repos.join("\n"))

        setSettings({
          ...data.settings,
          discordWebhooks: Array.isArray(data.settings.discordWebhooks) 
            ? data.settings.discordWebhooks 
            : [],
        })
        
        // Store webhooks separately
        if (Array.isArray(data.settings.discordWebhooks)) {
          setWebhooks(data.settings.discordWebhooks)
        }
        setPterodactylStatus({
          connected: data.pterodactylStatus?.connected || false,
          version: data.pterodactylStatus?.version,
        })
        setVirtfusionStatus({
          connected: data.virtfusionStatus?.connected || false,
          version: data.virtfusionStatus?.version,
        })
        setDatabaseStatus({
          connected: data.databaseStatus?.connected || false,
        })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast({
        title: t("error.title"),
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (type: "pterodactyl" | "virtfusion" | "database") => {
    setTestingConnection(type)
    try {
      const response = await fetch(`/api/admin/settings/test?type=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pterodactylUrl: settings.pterodactylUrl,
          pterodactylApiKey: settings.pterodactylApiKey,
          virtfusionUrl: settings.virtfusionUrl,
          virtfusionApiKey: settings.virtfusionApiKey,
        }),
      })
      const data = await response.json()
      
      if (type === "pterodactyl") {
        setPterodactylStatus({
          connected: data.success,
          latency: data.latency,
          version: data.version,
          error: data.error,
        })
      } else if (type === "virtfusion") {
        setVirtfusionStatus({
          connected: data.success,
          latency: data.latency,
          version: data.version,
          error: data.error,
        })
      } else {
        setDatabaseStatus({
          connected: data.success,
          latency: data.latency,
          error: data.error,
        })
      }

      toast({
        title: data.success ? t("settings.connection.success") : t("settings.connection.failed"),
        description: data.success 
          ? t("settings.connection.successDesc", { type }) 
          : data.error,
        variant: data.success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: t("settings.connection.failed"),
        description: t("settings.connection.error"),
        variant: "destructive",
      })
    } finally {
      setTestingConnection(null)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Parse GitHub repositories from textarea
      const repos = githubReposInput
        .split("\n")
        .map(r => r.trim())
        .filter(r => r.length > 0)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          // Send array to the API and request merge to avoid accidental overwrites
          githubRepositories: repos,
          githubRepositoriesMerge: true,
        }),
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: t("settings.saved"),
          description: t("settings.savedDesc"),
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("settings.saveError"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Repo management helpers (use per-repo endpoints)
  const addRepo = async (repo: string) => {
    const val = repo.trim()
    if (!val) return
    try {
      const res = await fetch('/api/admin/settings/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: val }),
      })
      const data = await res.json()
      if (data.success) {
        setGithubReposInput(data.repos.join('\n'))
        setNewRepoInput("")
        toast({ title: 'Repository added' })
      } else {
        throw new Error(data.error || 'Failed to add')
      }
    } catch (err: any) {
      toast({ title: t('error.title'), description: err.message || 'Failed to add repository', variant: 'destructive' })
    }
  }

  const updateRepo = async (oldRepo: string, newRepo: string) => {
    const val = newRepo.trim()
    if (!val) return
    try {
      const res = await fetch('/api/admin/settings/repos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldRepo, repo: val }),
      })
      const data = await res.json()
      if (data.success) {
        setGithubReposInput(data.repos.join('\n'))
        setEditingRepoIndex(null)
        setEditingRepoValue("")
        toast({ title: 'Repository updated' })
      } else {
        throw new Error(data.error || 'Failed to update')
      }
    } catch (err: any) {
      toast({ title: t('error.title'), description: err.message || 'Failed to update repository', variant: 'destructive' })
    }
  }

  const removeRepo = async (repo: string, idx?: number) => {
    try {
      const res = await fetch('/api/admin/settings/repos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo }),
      })
      const data = await res.json()
      if (data.success) {
        setGithubReposInput(data.repos.join('\n'))
        toast({ title: 'Repository removed' })
      } else {
        throw new Error(data.error || 'Failed to remove')
      }
    } catch (err: any) {
      toast({ title: t('error.title'), description: err.message || 'Failed to remove repository', variant: 'destructive' })
    }
  }

  const createWebhook = async () => {
    try {
      const response = await fetch("/api/admin/settings/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWebhookForm),
      })
      const data = await response.json()

      if (data.success) {
        setWebhooks([...webhooks, data.webhook])
        setNewWebhookForm({
          name: "",
          webhookUrl: "",
          type: "SYSTEM",
          description: "",
        })
        setShowNewWebhookForm(false)
        toast({
          title: "Webhook created",
          description: `${newWebhookForm.name} has been created`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: t("error.title"),
        description: error.message || "Failed to create webhook",
        variant: "destructive",
      })
    }
  }

  const startEditWebhook = (webhook: DiscordWebhook) => {
    setEditingWebhookId(webhook.id)
    setEditingWebhookForm({
      id: webhook.id,
      name: webhook.name,
      webhookUrl: webhook.webhookUrl,
      type: webhook.type,
      description: webhook.description || "",
      scope: webhook.scope || "ADMIN",
      enabled: webhook.enabled,
    })
  }

  const cancelEditWebhook = () => {
    setEditingWebhookId(null)
    setEditingWebhookForm(null)
  }

  const saveEditWebhook = async () => {
    if (!editingWebhookForm || !editingWebhookForm.id) return
    try {
      const response = await fetch("/api/admin/settings/webhooks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWebhookForm),
      })
      const data = await response.json()
      if (data.success) {
        setWebhooks(webhooks.map(w => w.id === data.webhook.id ? data.webhook : w))
        toast({ title: "Webhook updated" })
        cancelEditWebhook()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message || "Failed to update webhook", variant: "destructive" })
    }
  }

  const testWebhook = async (id: string) => {
    setTestingWebhook(id)
    try {
      const response = await fetch("/api/admin/settings/webhooks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()

      if (data.success) {
        // Update webhook in list
        setWebhooks(webhooks.map(w => 
          w.id === id ? { ...w, testSuccessAt: new Date().toISOString() } : w
        ))
        toast({
          title: "Test successful",
          description: "Webhook is working correctly",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Test failed",
        description: error.message || "Failed to test webhook",
        variant: "destructive",
      })
    } finally {
      setTestingWebhook(null)
    }
  }

  const deleteWebhook = async (id: string) => {
    setDeletingWebhook(id)
    try {
      const response = await fetch("/api/admin/settings/webhooks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()

      if (data.success) {
        setWebhooks(webhooks.filter(w => w.id !== id))
        toast({
          title: "Webhook deleted",
          description: "The webhook has been removed",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: t("error.title"),
        description: error.message || "Failed to delete webhook",
        variant: "destructive",
      })
    } finally {
      setDeletingWebhook(null)
    }
  }

  const webhookTypeColors: Record<string, string> = {
    GAME_SERVER: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    VPS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SYSTEM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    BILLING: "bg-green-500/10 text-green-500 border-green-500/20",
    SECURITY: "bg-red-500/10 text-red-500 border-red-500/20",
    SUPPORT: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    CUSTOM: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  }

  const webhookTypeLabels: Record<string, string> = {
    GAME_SERVER: "Game Server",
    VPS: "VPS/Node",
    SYSTEM: "System",
    BILLING: "Billing",
    SECURITY: "Security",
    SUPPORT: "Support",
    CUSTOM: "Custom",
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast({
        title: t("settings.copyFailed"),
        variant: "destructive",
      })
    }
  }

  const resetKey = async (key: string) => {
    setResetting(key)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: [key] }),
      })
      const data = await response.json()

      if (data.success) {
        // Update masked fields set
        const newMasked = new Set(maskedFields)
        newMasked.delete(key)
        setMaskedFields(newMasked)

        // Clear the field
        setSettings({
          ...settings,
          [key]: "",
        })

        toast({
          title: "Reset successful",
          description: `${key} has been reset`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: "Failed to reset key",
        variant: "destructive",
      })
    } finally {
      setResetting(null)
    }
  }

  const ConnectionBadge = ({ status }: { status: ConnectionStatus }) => (
    <Badge
      variant={status.connected ? "default" : "destructive"}
      className={cn(
        "gap-1",
        status.connected && "bg-green-500/10 text-green-500 border-green-500/20"
      )}
    >
      {status.connected ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      {status.connected ? t("settings.status.connected") : t("settings.status.disconnected")}
      {status.latency && (
        <span className="ml-1 text-xs opacity-70">({status.latency}ms)</span>
      )}
    </Badge>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
            {t("settings.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("settings.description")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="connections" className="gap-2">
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.connections")}</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.features")}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.notifications")}</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.advanced")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          {/* Token Protection Notice */}
          <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
            <Key className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Token Protection</AlertTitle>
            <AlertDescription className="text-amber-500/80">
              Once a token or API key is set, it cannot be edited directly for security reasons. Use the reset button to clear it and set a new one.
            </AlertDescription>
          </Alert>

          {/* Pterodactyl Panel */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>{t("settings.pterodactyl.title")}</CardTitle>
                </div>
                <ConnectionBadge status={pterodactylStatus} />
              </div>
              <CardDescription>{t("settings.pterodactyl.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panel-url">{t("settings.pterodactyl.url")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="panel-url"
                      placeholder="https://panel.example.com"
                      value={settings.pterodactylUrl}
                      onChange={(e) => setSettings({
                        ...settings,
                        pterodactylUrl: e.target.value
                      })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(settings.pterodactylUrl, "_blank")}
                      disabled={!settings.pterodactylUrl}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panel-key">{t("settings.pterodactyl.apiKey")}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="panel-key"
                        type={showApiKey ? "text" : "password"}
                        placeholder="ptla_xxxxxxxxxx"
                        className="pr-10"
                        value={settings.pterodactylApiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          pterodactylApiKey: e.target.value
                        })}
                        disabled={maskedFields.has("pterodactylApiKey")}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {maskedFields.has("pterodactylApiKey") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetKey("pterodactylApiKey")}
                        disabled={resetting === "pterodactylApiKey"}
                      >
                        {resetting === "pterodactylApiKey" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.pterodactyl.apiKeyNote")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="panel-api">{t("settings.pterodactyl.apiUrl")}</Label>
                <Input
                  id="panel-api"
                  placeholder="https://panel.example.com/api"
                  value={settings.pterodactylApi}
                  onChange={(e) => setSettings({
                    ...settings,
                    pterodactylApi: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  {t("settings.pterodactyl.apiUrlNote")}
                </p>
              </div>
              {pterodactylStatus.version && (
                <div className="text-sm text-muted-foreground">
                  {t("settings.pterodactyl.version")}: <span className="font-medium">{pterodactylStatus.version}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => testConnection("pterodactyl")}
                disabled={testingConnection === "pterodactyl"}
              >
                {testingConnection === "pterodactyl" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {t("settings.testConnection")}
              </Button>
            </CardFooter>
          </Card>

          {/* Virtfusion Panel */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>Virtfusion Panel</CardTitle>
                </div>
                <ConnectionBadge status={virtfusionStatus} />
              </div>
              <CardDescription>Configure your Virtfusion VPS panel connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="virtfusion-url">Panel URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="virtfusion-url"
                      placeholder="https://virt.example.com"
                      value={settings.virtfusionUrl}
                      onChange={(e) => setSettings({
                        ...settings,
                        virtfusionUrl: e.target.value
                      })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(settings.virtfusionUrl, "_blank")}
                      disabled={!settings.virtfusionUrl}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="virtfusion-key">API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="virtfusion-key"
                        type={showVirtfusion ? "text" : "password"}
                        placeholder="virt_xxxxxxxxxx"
                        className="pr-10"
                        value={settings.virtfusionApiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          virtfusionApiKey: e.target.value
                        })}
                        disabled={maskedFields.has("virtfusionApiKey")}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setShowVirtfusion(!showVirtfusion)}
                        >
                          {showVirtfusion ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {maskedFields.has("virtfusionApiKey") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetKey("virtfusionApiKey")}
                        disabled={resetting === "virtfusionApiKey"}
                      >
                        {resetting === "virtfusionApiKey" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your Virtfusion API key is stored encrypted
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="virtfusion-api">API Endpoint (optional)</Label>
                <Input
                  id="virtfusion-api"
                  placeholder="/api/application"
                  value={settings.virtfusionApi}
                  onChange={(e) => setSettings({
                    ...settings,
                    virtfusionApi: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Custom API endpoint for your Virtfusion installation
                </p>
              </div>
              {virtfusionStatus.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{virtfusionStatus.error}</AlertDescription>
                </Alert>
              )}
              {virtfusionStatus.version && (
                <div className="text-sm text-muted-foreground">
                  Version: <span className="font-medium">{virtfusionStatus.version}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => testConnection("virtfusion")}
                disabled={testingConnection === "virtfusion"}
              >
                {testingConnection === "virtfusion" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {t("settings.testConnection")}
              </Button>
            </CardFooter>
          </Card>

          {/* Crowdin Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>{t("settings.crowdin.title")}</CardTitle>
              </div>
              <CardDescription>{t("settings.crowdin.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crowdin-id">{t("settings.crowdin.projectId")}</Label>
                  <Input
                    id="crowdin-id"
                    placeholder="123456"
                    value={settings.crowdinProjectId}
                    onChange={(e) => setSettings({
                      ...settings,
                      crowdinProjectId: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crowdin-token">{t("settings.crowdin.personalToken")}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="crowdin-token"
                        type={showCrowdin ? "text" : "password"}
                        placeholder="crwd_xxxxxxxxxxxxx"
                        className="pr-10"
                        value={settings.crowdinPersonalToken}
                        onChange={(e) => setSettings({
                          ...settings,
                          crowdinPersonalToken: e.target.value
                        })}
                        disabled={maskedFields.has("crowdinPersonalToken")}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setShowCrowdin(!showCrowdin)}
                        >
                          {showCrowdin ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {maskedFields.has("crowdinPersonalToken") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetKey("crowdinPersonalToken")}
                        disabled={resetting === "crowdinPersonalToken"}
                      >
                        {resetting === "crowdinPersonalToken" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.crowdin.personalTokenNote")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>{t("settings.github.title")}</CardTitle>
              </div>
              <CardDescription>{t("settings.github.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-token">{t("settings.github.token")}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="github-token"
                      type={showGithub ? "text" : "password"}
                      placeholder="ghp_xxxxxxxxxxxxx"
                      className="pr-10"
                      value={settings.githubToken}
                      onChange={(e) => setSettings({
                        ...settings,
                        githubToken: e.target.value
                      })}
                      disabled={maskedFields.has("githubToken")}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowGithub(!showGithub)}
                      >
                        {showGithub ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {maskedFields.has("githubToken") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetKey("githubToken")}
                      disabled={resetting === "githubToken"}
                    >
                      {resetting === "githubToken" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.github.tokenNote")}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="github-repos">Monitored Repositories</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Manage monitored repositories. Add, edit or remove entries (format: owner/repo).
                </p>

                {/* Repo list */}
                <div className="space-y-2 mb-2">
                  {githubReposInput.split("\n").map(r => r.trim()).filter(Boolean).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No repositories configured yet</p>
                  ) : (
                    githubReposInput.split("\n").map((repo, idx) => repo.trim()).filter(Boolean).map((repo, idx) => (
                      <div key={idx} className="p-2 rounded-lg border bg-card flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {editingRepoIndex === idx ? (
                            <input
                              className="w-full rounded-md border px-2 py-1 text-sm"
                              value={editingRepoValue}
                              onChange={(e) => setEditingRepoValue(e.target.value)}
                            />
                          ) : (
                            <p className="text-sm font-medium truncate">{repo}</p>
                          )}
                        </div>

                        <div className="flex gap-1 flex-shrink-0">
                          {editingRepoIndex === idx ? (
                            <>
                              <Button size="sm" onClick={() => updateRepo(repo, editingRepoValue)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => { setEditingRepoIndex(null); setEditingRepoValue("") }}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => { setEditingRepoIndex(idx); setEditingRepoValue(repo) }}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => removeRepo(repo, idx)}>Delete</Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new repo */}
                <div className="flex gap-2">
                  <Input
                    placeholder="owner/repo"
                    value={newRepoInput}
                    onChange={(e) => setNewRepoInput(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={() => addRepo(newRepoInput)}>Add</Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  {githubReposInput.split("\n").filter(r => r.trim()).length} repository/repositories configured
                </p>
              </div>

              <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-500">{t("settings.github.warning")}</AlertTitle>
                <AlertDescription className="text-blue-500/80">
                  {t("settings.github.warningDesc")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Database */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <button
                    onClick={() => setShowDatabase(!showDatabase)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <CardTitle>{t("settings.database.title")}</CardTitle>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        showDatabase && "rotate-180"
                      )}
                    />
                  </button>
                </div>
                <ConnectionBadge status={databaseStatus} />
              </div>
              <CardDescription>{t("settings.database.description")}</CardDescription>
            </CardHeader>
            {showDatabase && (
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                  {t("settings.database.readOnly")}
                </div>
              </CardContent>
            )}
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => testConnection("database")}
                disabled={testingConnection === "database"}
              >
                {testingConnection === "database" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {t("settings.testConnection")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.features.title")}</CardTitle>
              <CardDescription>{t("settings.features.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.features.registration")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.features.registrationDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    registrationEnabled: checked
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.features.maintenance")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.features.maintenanceDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    maintenanceMode: checked
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.features.autoSync")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.features.autoSyncDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.autoSyncEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    autoSyncEnabled: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>{t("settings.notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t("settings.notifications.email")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.emailDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    emailNotifications: checked
                  })}
                />
              </div>

              {/* Email Credentials Section */}
              {settings.emailNotifications && (
                <>
                  <Separator />
                  <div className="space-y-3 pl-4 border-l-2 border-green-500/30">
                    <div className="space-y-2">
                      <Label htmlFor="resend-key">{t("settings.notifications.resendApiKey")}</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="resend-key"
                            type={showResend ? "text" : "password"}
                            placeholder="re_xxxxxxxxxxxxx"
                            className="pr-10"
                            value={settings.resendApiKey}
                            onChange={(e) => setSettings({
                              ...settings,
                              resendApiKey: e.target.value
                            })}
                            disabled={maskedFields.has("resendApiKey")}
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => setShowResend(!showResend)}
                            >
                              {showResend ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {maskedFields.has("resendApiKey") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetKey("resendApiKey")}
                            disabled={resetting === "resendApiKey"}
                          >
                            {resetting === "resendApiKey" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("settings.notifications.resendApiKeyNote")}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Discord Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {t("settings.notifications.discord")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.notifications.discordDesc")}
                  </p>
                </div>
                <Switch
                  checked={settings.discordNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    discordNotifications: checked
                  })}
                />
              </div>

              {/* Discord Webhooks Section */}
              {settings.discordNotifications && (
                <>
                  <Separator />
                  <div className="space-y-4 pl-4 border-l-2 border-blue-500/30">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Discord Webhooks</h4>
                      
                      {/* Existing Webhooks */}
                      <div className="space-y-2 mb-4">
                        {webhooks.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No webhooks configured yet</p>
                        ) : (
                          webhooks.map((webhook) => {
                            return (
                              <div key={webhook.id} className="p-3 rounded-lg border bg-card space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-medium">{webhook.name}</p>
                                      <Badge variant="outline" className={webhookTypeColors[webhook.type]}>
                                        {webhookTypeLabels[webhook.type]}
                                      </Badge>
                                      {webhook.scope && (
                                        <Badge variant="outline" className="ml-1">
                                          {webhook.scope}
                                        </Badge>
                                      )}
                                    </div>
                                    {webhook.description && (
                                      <p className="text-xs text-muted-foreground mb-1">{webhook.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground truncate break-all">
                                      {webhook.webhookUrl.substring(0, 20)}...
                                    </p>
                                    {webhook.testSuccessAt && (
                                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        ✓ Last tested: {new Date(webhook.testSuccessAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex gap-1 mt-2 sm:mt-0 flex-wrap">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => testWebhook(webhook.id)}
                                      disabled={testingWebhook === webhook.id}
                                      title="Test webhook"
                                    >
                                      {testingWebhook === webhook.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <RefreshCw className="h-4 w-4" />
                                      )}
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={() => startEditWebhook(webhook)}>Edit</Button>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteWebhook(webhook.id)}
                                      disabled={deletingWebhook === webhook.id}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      {deletingWebhook === webhook.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {editingWebhookId === webhook.id && editingWebhookForm && (
                                  <div className="mt-2 p-2 border rounded space-y-2 bg-muted/20 grid gap-2 grid-cols-1 ">
                                    <Input value={editingWebhookForm.name} onChange={(e) => setEditingWebhookForm({...editingWebhookForm, name: e.target.value})} />
                                    <Input className="truncate overflow-x-auto" value={editingWebhookForm.webhookUrl} onChange={(e) => setEditingWebhookForm({...editingWebhookForm, webhookUrl: e.target.value})} />
                                    <div className="flex gap-2 flex-col">
                                      <select value={editingWebhookForm.type} onChange={(e) => setEditingWebhookForm({...editingWebhookForm, type: e.target.value})} className="rounded-md border px-2 border-input bg-background">
                                        <option value="GAME_SERVER">Game Server</option>
                                        <option value="VPS">VPS</option>
                                        <option value="SYSTEM">System</option>
                                        <option value="BILLING">Billing</option>
                                        <option value="SECURITY">Security</option>
                                        <option value="SUPPORT">Support</option>
                                        <option value="CUSTOM">Custom</option>
                                      </select>
                                      <select value={editingWebhookForm.scope} onChange={(e) => setEditingWebhookForm({...editingWebhookForm, scope: e.target.value})} className=" rounded-md border border-input bg-background px-2">
                                        <option value="ADMIN">Admin</option>
                                        <option value="USER">User</option>
                                        <option value="PUBLIC">Public</option>
                                      </select>
                                      <div className="flex items-center gap-2">
                                        <Label className="text-xs">Enabled</Label>
                                        <Switch checked={!!editingWebhookForm.enabled} onCheckedChange={(v) => setEditingWebhookForm({...editingWebhookForm, enabled: v})} />
                                      </div>
                                    </div>
                                    <Input value={editingWebhookForm.description} onChange={(e) => setEditingWebhookForm({...editingWebhookForm, description: e.target.value})} />
                                    <div className="flex gap-2 justify-end">
                                      <Button size="sm" onClick={() => saveEditWebhook()}>Save</Button>
                                      <Button size="sm" variant="outline" onClick={() => cancelEditWebhook()}>Cancel</Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>

                      {/* Add New Webhook Form */}
                      {!showNewWebhookForm ? (
                        <Button
                          size="sm"
                          onClick={() => setShowNewWebhookForm(true)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Webhook
                        </Button>
                      ) : (
                        <div className="space-y-3 p-3 rounded-lg bg-muted/30 border">
                          <div className="space-y-2">
                            <Label htmlFor="webhook-name" className="text-xs">Webhook Name</Label>
                            <Input
                              id="webhook-name"
                              placeholder="e.g., Game Server Alerts"
                              value={newWebhookForm.name}
                              onChange={(e) => setNewWebhookForm({ ...newWebhookForm, name: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhook-type" className="text-xs">Webhook Type</Label>
                            <select
                              id="webhook-type"
                              value={newWebhookForm.type}
                              onChange={(e) => setNewWebhookForm({ 
                                ...newWebhookForm, 
                                type: e.target.value as any
                              })}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="GAME_SERVER">Game Server</option>
                              <option value="VPS">VPS/Node</option>
                              <option value="SYSTEM">System</option>
                              <option value="BILLING">Billing</option>
                              <option value="SECURITY">Security</option>
                              <option value="SUPPORT">Support</option>
                              <option value="CUSTOM">Custom</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhook-scope" className="text-xs">Scope</Label>
                            <select
                              id="webhook-scope"
                              value={newWebhookForm.scope}
                              onChange={(e) => setNewWebhookForm({
                                ...newWebhookForm,
                                scope: e.target.value as any
                              })}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="USER">User</option>
                              <option value="PUBLIC">Public</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhook-url" className="text-xs">Discord Webhook URL</Label>
                            <Input
                              id="webhook-url"
                              type="password"
                              placeholder="https://discord.com/api/webhooks/..."
                              value={newWebhookForm.webhookUrl}
                              onChange={(e) => setNewWebhookForm({ ...newWebhookForm, webhookUrl: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="webhook-desc" className="text-xs">Description (Optional)</Label>
                            <Input
                              id="webhook-desc"
                              placeholder="What is this webhook for?"
                              value={newWebhookForm.description}
                              onChange={(e) => setNewWebhookForm({ ...newWebhookForm, description: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={createWebhook}
                              disabled={!newWebhookForm.name || !newWebhookForm.webhookUrl}
                              className="flex-1"
                            >
                              Create Webhook
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowNewWebhookForm(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Add Discord webhooks to receive notifications. You can test each webhook to ensure it's working.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.advanced.title")}</CardTitle>
              <CardDescription>{t("settings.advanced.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("settings.advanced.cacheTimeout")}</Label>
                <Select value={String(settings.cacheTimeout)} onValueChange={(value) => setSettings({
                  ...settings,
                  cacheTimeout: parseInt(value)
                })}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 {t("settings.advanced.seconds")}</SelectItem>
                    <SelectItem value="60">1 {t("settings.advanced.minute")}</SelectItem>
                    <SelectItem value="300">5 {t("settings.advanced.minutes")}</SelectItem>
                    <SelectItem value="600">10 {t("settings.advanced.minutes")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t("settings.advanced.cacheTimeoutDesc")}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("settings.advanced.syncInterval")}</Label>
                <Select value={String(settings.syncInterval)} onValueChange={(value) => setSettings({
                  ...settings,
                  syncInterval: parseInt(value)
                })}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1800">30 {t("settings.advanced.minutes")}</SelectItem>
                    <SelectItem value="3600">1 {t("settings.advanced.hour")}</SelectItem>
                    <SelectItem value="7200">2 {t("settings.advanced.hours")}</SelectItem>
                    <SelectItem value="86400">24 {t("settings.advanced.hours")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t("settings.advanced.syncIntervalDesc")}
                </p>
              </div>
              <Separator />
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <h4 className="font-medium text-destructive mb-2">
                  {t("settings.advanced.dangerZone")}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("settings.advanced.dangerZoneDesc")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="destructive" size="sm">
                    {t("settings.advanced.clearCache")}
                  </Button>
                  <Button variant="destructive" size="sm">
                    {t("settings.advanced.resetSync")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Settings Button */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={saveSettings}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {t("settings.saveSettings")}
        </Button>
      </div>
    </div>
  )
}
