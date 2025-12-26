"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Server,
  Database,
  Globe,
  CheckCircle2,
  Circle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
} from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"
import { Input } from "@/packages/ui/components/ui/input"
import { Label } from "@/packages/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Checkbox } from "@/packages/ui/components/ui/checkbox"
import { Badge } from "@/packages/ui/components/ui/badge"
import { useToast } from "@/packages/core/hooks/use-toast"

interface SetupStatus {
  isComplete: boolean
  components: {
    siteInfo: boolean
    pterodactylConfig: boolean
    virtfusionConfig: boolean
  }
  configured: Record<string, any>
}

interface TestResult {
  success: boolean
  error?: string
  latency?: number
  serverCount?: number
  panelVersion?: string
  database?: string
}

type Step = "welcome" | "site" | "panels" | "pterodactyl" | "virtfusion" | "optional" | "complete"

export default function SetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [testingConnections, setTestingConnections] = useState<Record<string, boolean>>({})
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [currentStep, setCurrentStep] = useState<Step>("welcome")

  // Panel selection
  const [selectedPanels, setSelectedPanels] = useState<{
    pterodactyl: boolean
    virtfusion: boolean
  }>({
    pterodactyl: false,
    virtfusion: false,
  })

  const [formData, setFormData] = useState({
    siteName: "",
    siteUrl: "",
    faviconUrl: "",
    pterodactylUrl: "",
    pterodactylApiKey: "",
    pterodactylApi: "/api/application",
    virtfusionUrl: "",
    virtfusionApiKey: "",
    virtfusionApi: "/api/v1",
    // Optional settings
    githubToken: "",
    resendApiKey: "",
    crowdinProjectId: "",
    crowdinPersonalToken: "",
  })

  // Load current setup status on mount
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch("/api/setup")
        const data = await response.json()
        setSetupStatus(data)

        // Pre-fill form with existing values
        if (data.configured) {
          setFormData((prev) => ({
            ...prev,
            siteName: data.configured.siteName || prev.siteName,
            siteUrl: data.configured.siteUrl || prev.siteUrl,
            faviconUrl: data.configured.faviconUrl || prev.faviconUrl,
            pterodactylUrl: data.configured.pterodactylUrl || prev.pterodactylUrl,
            virtfusionUrl: data.configured.virtfusionUrl || prev.virtfusionUrl,
          }))

          // Auto-select panels if already configured
          if (data.configured.pterodactylUrl) {
            setSelectedPanels((prev) => ({ ...prev, pterodactyl: true }))
          }
          if (data.configured.virtfusionUrl) {
            setSelectedPanels((prev) => ({ ...prev, virtfusion: true }))
          }
        }

        // Skip to appropriate step if already partially configured
        if (data.components?.siteInfo && !data.isComplete) {
          setCurrentStep("panels")
        }
      } catch (error) {
        console.error("Failed to load setup status:", error)
      }
    }

    loadStatus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTestConnection = async (type: "pterodactyl" | "virtfusion") => {
    setTestingConnections((prev) => ({ ...prev, [type]: true }))

    try {
      const body: Record<string, unknown> = { testConnections: true }

      if (type === "pterodactyl") {
        body.pterodactylUrl = formData.pterodactylUrl
        body.pterodactylApiKey = formData.pterodactylApiKey
      } else if (type === "virtfusion") {
        body.virtfusionUrl = formData.virtfusionUrl
        body.virtfusionApiKey = formData.virtfusionApiKey
      }

      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.testResults?.[type]) {
        setTestResults((prev) => ({ ...prev, [type]: data.testResults[type] }))
        const result = data.testResults[type]

        if (result.success) {
          toast({
            title: "Connection Successful",
            description: result.database
              ? `Connected to database: ${result.database}`
              : `Connected to ${type} panel (${result.latency}ms)`,
          })
        } else {
          toast({
            variant: "destructive",
            title: "Connection Failed",
            description: result.error || "Unable to establish connection",
          })
        }
      }
    } catch (error) {
      console.error(`Failed to test ${type} connection:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to test ${type} connection`,
      })
    } finally {
      setTestingConnections((prev) => ({ ...prev, [type]: false }))
    }
  }

  const saveConfiguration = async (configType: "site" | "pterodactyl" | "virtfusion" | "optional") => {
    setLoading(true)

    try {
      const body: Record<string, unknown> = {}

      if (configType === "site") {
        body.siteName = formData.siteName
        body.siteUrl = formData.siteUrl
        body.faviconUrl = formData.faviconUrl || null
      } else if (configType === "pterodactyl") {
        body.pterodactylUrl = formData.pterodactylUrl
        body.pterodactylApiKey = formData.pterodactylApiKey
        body.pterodactylApi = formData.pterodactylApi
      } else if (configType === "virtfusion") {
        body.virtfusionUrl = formData.virtfusionUrl
        body.virtfusionApiKey = formData.virtfusionApiKey
        body.virtfusionApi = formData.virtfusionApi
      } else if (configType === "optional") {
        // Only add optional fields if they have values
        if (formData.githubToken) body.githubToken = formData.githubToken
        if (formData.resendApiKey) body.resendApiKey = formData.resendApiKey
        if (formData.crowdinProjectId) body.crowdinProjectId = formData.crowdinProjectId
        if (formData.crowdinPersonalToken) body.crowdinPersonalToken = formData.crowdinPersonalToken
      }

      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: data.error || "Failed to save configuration",
        })
        return false
      }

      setSetupStatus(data)
      return true
    } catch (error) {
      console.error("Save error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSetup = async () => {
    setLoading(true)

    try {
      toast({
        title: "Setup Complete!",
        description: "Your platform is ready to use.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Setup error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = async () => {
    if (currentStep === "welcome") {
      setCurrentStep("site")
    } else if (currentStep === "site") {
      if (!formData.siteName || !formData.siteUrl) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: "Please fill in all required fields",
        })
        return
      }
      const success = await saveConfiguration("site")
      if (success) {
        setCurrentStep("panels")
      }
    } else if (currentStep === "panels") {
      if (!selectedPanels.pterodactyl && !selectedPanels.virtfusion) {
        toast({
          variant: "destructive",
          title: "Select a Panel",
          description: "Please select at least one panel to configure",
        })
        return
      }
      if (selectedPanels.pterodactyl) {
        setCurrentStep("pterodactyl")
      } else if (selectedPanels.virtfusion) {
        setCurrentStep("virtfusion")
      }
    } else if (currentStep === "pterodactyl") {
      if (!formData.pterodactylUrl || !formData.pterodactylApiKey || !formData.pterodactylApi) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: "Please fill in all Pterodactyl fields",
        })
        return
      }
      const success = await saveConfiguration("pterodactyl")
      if (success) {
        if (selectedPanels.virtfusion) {
          setCurrentStep("virtfusion")
        } else {
          setCurrentStep("optional")
        }
      }
    } else if (currentStep === "virtfusion") {
      if (!formData.virtfusionUrl || !formData.virtfusionApiKey || !formData.virtfusionApi) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: "Please fill in all Virtfusion fields",
        })
        return
      }
      const success = await saveConfiguration("virtfusion")
      if (success) {
        setCurrentStep("optional")
      }
    } else if (currentStep === "optional") {
      await saveConfiguration("optional")
      setCurrentStep("complete")
    }
  }

  const handlePrevStep = () => {
    if (currentStep === "site") {
      setCurrentStep("welcome")
    } else if (currentStep === "panels") {
      setCurrentStep("site")
    } else if (currentStep === "pterodactyl") {
      setCurrentStep("panels")
    } else if (currentStep === "virtfusion") {
      if (selectedPanels.pterodactyl) {
        setCurrentStep("pterodactyl")
      } else {
        setCurrentStep("panels")
      }
    } else if (currentStep === "optional") {
      if (selectedPanels.virtfusion) {
        setCurrentStep("virtfusion")
      } else if (selectedPanels.pterodactyl) {
        setCurrentStep("pterodactyl")
      }
    } else if (currentStep === "complete") {
      setCurrentStep("optional")
    }
  }

  const getStepNumber = () => {
    const steps: Step[] = ["welcome", "site", "panels"]
    if (selectedPanels.pterodactyl) steps.push("pterodactyl")
    if (selectedPanels.virtfusion) steps.push("virtfusion")
    steps.push("complete")
    return steps.indexOf(currentStep) + 1
  }

  const getTotalSteps = () => {
    let count = 4 // welcome, site, panels, complete
    if (selectedPanels.pterodactyl) count++
    if (selectedPanels.virtfusion) count++
    return count
  }

  // Loading state
  if (!setupStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading setup...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4 py-32">
      <Card className="w-full max-w-2xl">
        {/* Progress Header */}
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Platform Setup</CardTitle>
                <CardDescription>
                  Step {getStepNumber()} of {getTotalSteps()}
                </CardDescription>
              </div>
            </div>
            {currentStep !== "welcome" && (
              <Badge variant="outline" className="font-mono">
                {Math.round((getStepNumber() / getTotalSteps()) * 100)}%
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {currentStep !== "welcome" && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getStepNumber() / getTotalSteps()) * 100}%` }}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Welcome Step */}
          {currentStep === "welcome" && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Welcome to NodeByte</h2>
                  <p className="text-muted-foreground mt-2">
                    Let&apos;s configure your hosting platform. This wizard will guide you through the initial setup process.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Site Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up your site name, URL, and branding
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <Server className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Panel Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to Pterodactyl, Virtfusion, or both
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <Database className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Data Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Import existing users and servers from your panels
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Site Configuration Step */}
          {currentStep === "site" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Site Configuration
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your site details and branding
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="NodeByte Hosting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL *</Label>
                  <Input
                    id="siteUrl"
                    name="siteUrl"
                    value={formData.siteUrl}
                    onChange={handleChange}
                    placeholder="https://nodebyte.host"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    name="faviconUrl"
                    value={formData.faviconUrl}
                    onChange={handleChange}
                    placeholder="https://nodebyte.host/favicon.ico"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Panel Selection Step */}
          {currentStep === "panels" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Panel Selection
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose which panels you want to integrate with your platform
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className={`relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPanels.pterodactyl
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPanels((prev) => ({ ...prev, pterodactyl: !prev.pterodactyl }))}
                >
                  <Checkbox
                    checked={selectedPanels.pterodactyl}
                    onCheckedChange={(checked) =>
                      setSelectedPanels((prev) => ({ ...prev, pterodactyl: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Pterodactyl Panel</h3>
                      <Badge variant="secondary" className="text-xs">Game Servers</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to your Pterodactyl panel to manage game servers like Minecraft, Rust, and more.
                    </p>
                  </div>
                  {setupStatus?.components.pterodactylConfig && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Configured
                    </Badge>
                  )}
                </div>

                <div
                  className={`relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPanels.virtfusion
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPanels((prev) => ({ ...prev, virtfusion: !prev.virtfusion }))}
                >
                  <Checkbox
                    checked={selectedPanels.virtfusion}
                    onCheckedChange={(checked) =>
                      setSelectedPanels((prev) => ({ ...prev, virtfusion: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Virtfusion Panel</h3>
                      <Badge variant="secondary" className="text-xs">VPS / VDS</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to your Virtfusion panel to manage virtual private servers and dedicated servers.
                    </p>
                  </div>
                  {setupStatus?.components.virtfusionConfig && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Configured
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                You can configure additional panels later in the admin settings.
              </p>
            </div>
          )}

          {/* Pterodactyl Configuration Step */}
          {currentStep === "pterodactyl" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Pterodactyl Configuration
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your Pterodactyl panel credentials
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pterodactylUrl">Panel URL *</Label>
                  <Input
                    id="pterodactylUrl"
                    name="pterodactylUrl"
                    value={formData.pterodactylUrl}
                    onChange={handleChange}
                    placeholder="https://panel.example.com"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pterodactylApiKey">API Key *</Label>
                  <Input
                    id="pterodactylApiKey"
                    name="pterodactylApiKey"
                    value={formData.pterodactylApiKey}
                    onChange={handleChange}
                    placeholder="ptlc_..."
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Create an Application API key in your Pterodactyl panel settings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pterodactylApi">API Endpoint *</Label>
                  <Input
                    id="pterodactylApi"
                    name="pterodactylApi"
                    value={formData.pterodactylApi}
                    onChange={handleChange}
                    placeholder="https://panel.example.com/api/application"
                  />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-extrabold">Example:</span> https://panel.example.com/api
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTestConnection("pterodactyl")}
                    disabled={
                      !formData.pterodactylUrl ||
                      !formData.pterodactylApiKey ||
                      testingConnections.pterodactyl
                    }
                  >
                    {testingConnections.pterodactyl ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Testing Connection...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                  {testResults.pterodactyl && (
                    <div className={`flex items-center gap-2 text-sm mt-2 ${testResults.pterodactyl.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {testResults.pterodactyl.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      {testResults.pterodactyl.success
                        ? `Connected (${testResults.pterodactyl.latency}ms) - ${testResults.pterodactyl.serverCount} server(s)`
                        : testResults.pterodactyl.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Virtfusion Configuration Step */}
          {currentStep === "virtfusion" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Virtfusion Configuration
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your Virtfusion panel credentials
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="virtfusionUrl">Panel URL *</Label>
                  <Input
                    id="virtfusionUrl"
                    name="virtfusionUrl"
                    value={formData.virtfusionUrl}
                    onChange={handleChange}
                    placeholder="https://panel.example.com"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtfusionApiKey">API Key *</Label>
                  <Input
                    id="virtfusionApiKey"
                    name="virtfusionApiKey"
                    value={formData.virtfusionApiKey}
                    onChange={handleChange}
                    placeholder="Your API key"
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtfusionApi">API Endpoint *</Label>
                  <Input
                    id="virtfusionApi"
                    name="virtfusionApi"
                    value={formData.virtfusionApi}
                    onChange={handleChange}
                    placeholder="/api/v1"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTestConnection("virtfusion")}
                    disabled={
                      !formData.virtfusionUrl ||
                      !formData.virtfusionApiKey ||
                      testingConnections.virtfusion
                    }
                  >
                    {testingConnections.virtfusion ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Testing Connection...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                  {testResults.virtfusion && (
                    <div className={`flex items-center gap-2 text-sm mt-2 ${testResults.virtfusion.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {testResults.virtfusion.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      {testResults.virtfusion.success
                        ? `Connected (${testResults.virtfusion.latency}ms) - ${testResults.virtfusion.serverCount} server(s)`
                        : testResults.virtfusion.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Optional Settings Step */}
          {currentStep === "optional" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Optional Integrations
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure additional integrations. These can be added or modified later in your admin panel.
                </p>
              </div>

              <div className="space-y-4">
                {/* GitHub Token */}
                <div className="space-y-2">
                  <Label htmlFor="githubToken">GitHub Token (Optional)</Label>
                  <Input
                    id="githubToken"
                    name="githubToken"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={formData.githubToken}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for webhook dispatching and GitHub integration features
                  </p>
                </div>

                {/* Resend API Key */}
                <div className="space-y-2">
                  <Label htmlFor="resendApiKey">Resend API Key (Optional)</Label>
                  <Input
                    id="resendApiKey"
                    name="resendApiKey"
                    type="password"
                    placeholder="re_xxxxxxxxxxxxxxxxxxxx"
                    value={formData.resendApiKey}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for sending transactional emails
                  </p>
                </div>

                {/* Crowdin Project ID */}
                <div className="space-y-2">
                  <Label htmlFor="crowdinProjectId">Crowdin Project ID (Optional)</Label>
                  <Input
                    id="crowdinProjectId"
                    name="crowdinProjectId"
                    placeholder="123456"
                    value={formData.crowdinProjectId}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Crowdin project ID for localization management
                  </p>
                </div>

                {/* Crowdin Personal Token */}
                <div className="space-y-2">
                  <Label htmlFor="crowdinPersonalToken">Crowdin Personal Token (Optional)</Label>
                  <Input
                    id="crowdinPersonalToken"
                    name="crowdinPersonalToken"
                    type="password"
                    placeholder="xxxxxxxxxxxxxxxxxxxx"
                    value={formData.crowdinPersonalToken}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Crowdin API personal token for synchronization
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Setup Complete!</h2>
                  <p className="text-muted-foreground mt-2">
                    Your platform is configured and ready to use.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Site Configuration</p>
                    <p className="text-sm text-muted-foreground">{formData.siteName}</p>
                  </div>
                </div>

                {selectedPanels.pterodactyl && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Pterodactyl Panel</p>
                      <p className="text-sm text-muted-foreground">{formData.pterodactylUrl}</p>
                    </div>
                  </div>
                )}

                {selectedPanels.virtfusion && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Virtfusion Panel</p>
                      <p className="text-sm text-muted-foreground">{formData.virtfusionUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {currentStep !== "welcome" && currentStep !== "complete" && (
              <Button variant="outline" onClick={handlePrevStep} disabled={loading}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <div className="flex-1" />

            {currentStep === "complete" ? (
              <Button onClick={handleCompleteSetup} disabled={loading} className="min-w-[140px]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Finishing...
                  </>
                ) : (
                  <>
                    Launch Platform
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNextStep} disabled={loading} className="min-w-[140px]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === "welcome" ? "Get Started" : "Continue"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
