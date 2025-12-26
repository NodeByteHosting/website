import { NextResponse } from "next/server"
import { requireAdmin, isSuperAdmin } from "@/packages/auth"
import { auth } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"
import { dispatchSettingsUpdate } from "@/packages/core/dispatchers/webhooks"
import { testPanelConnection } from "@/packages/core/lib/db-test"
import { getConfig, getAllSettings, setConfig, clearConfigCache } from "@/packages/core/lib/config"

export async function GET() {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  // Get current user's roles
  const session = await auth()
  const userRoles = session?.user?.roles || []

  try {
    // Get all config settings
    const allSettings = await getAllSettings()

    // Test database connection
    let databaseConnected = false
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseConnected = true
    } catch {
      databaseConnected = false
    }

    // Check Pterodactyl panel connection
    let pterodactylConnected = false
    let pterodactylVersion = null
    let pterodactylLatency = null
    const pterodactylUrl = allSettings.pterodactyl_url
    const pterodactylApiKey = allSettings.pterodactyl_api_key

    if (pterodactylUrl && pterodactylApiKey) {
      try {
        const testResult = await testPanelConnection(pterodactylUrl, pterodactylApiKey, "pterodactyl")
        if (testResult.success) {
          pterodactylConnected = true
          pterodactylVersion = testResult.panelVersion || "Connected"
          pterodactylLatency = testResult.latency
        }
      } catch {
        pterodactylConnected = false
      }
    }

    // Check Virtfusion panel connection
    let virtfusionConnected = false
    let virtfusionVersion = null
    let virtfusionLatency = null
    const virtfusionUrl = allSettings.virtfusion_url
    const virtfusionApiKey = allSettings.virtfusion_api_key

    if (virtfusionUrl && virtfusionApiKey) {
      try {
        const testResult = await testPanelConnection(virtfusionUrl, virtfusionApiKey, "virtfusion")
        if (testResult.success) {
          virtfusionConnected = true
          virtfusionVersion = "Virtfusion"
          virtfusionLatency = testResult.latency
        }
      } catch {
        virtfusionConnected = false
      }
    }

    // Parse Discord webhooks from database
    let discordWebhooks = []
    try {
      // Get admin webhooks from DiscordWebhook model
      const webhooks = await prisma.discordWebhook.findMany({
        where: {
          scope: "ADMIN"
        },
        select: {
          id: true,
          name: true,
          webhookUrl: true,
          type: true,
          scope: true,
          description: true,
          enabled: true,
          testSuccessAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      })
      discordWebhooks = webhooks
    } catch {
      discordWebhooks = []
    }

    // Parse GitHub repositories config into an array for frontend
    let githubRepos: string[] = []
    try {
      const rawRepos = allSettings.github_repositories
      if (rawRepos) {
        try {
          const parsed = JSON.parse(rawRepos)
          if (Array.isArray(parsed)) {
            githubRepos = parsed
          } else if (typeof parsed === "string") {
            // handle double-encoded string
            try {
              const inner = JSON.parse(parsed)
              if (Array.isArray(inner)) githubRepos = inner
              else githubRepos = [String(parsed)]
            } catch {
              githubRepos = parsed.split("\n").map((r: string) => r.trim()).filter(Boolean)
            }
          }
        } catch {
          // fallback: newline-separated
          githubRepos = rawRepos.split("\n").map((r: string) => r.trim()).filter(Boolean)
        }
      }
    } catch (e) {
      githubRepos = []
    }

    return NextResponse.json({
      success: true,
      settings: {
        pterodactylUrl: allSettings.pterodactyl_url || "",
        pterodactylApiKey: isSuperAdmin(userRoles) && allSettings.pterodactyl_api_key ? allSettings.pterodactyl_api_key : (allSettings.pterodactyl_api_key ? "••••••••••••••••••••" : ""),
        pterodactylApi: allSettings.pterodactyl_api || "",
        virtfusionUrl: allSettings.virtfusion_url || "",
        virtfusionApiKey: isSuperAdmin(userRoles) && allSettings.virtfusion_api_key ? allSettings.virtfusion_api_key : (allSettings.virtfusion_api_key ? "••••••••••••••••••••" : ""),
        virtfusionApi: allSettings.virtfusion_api || "",
        crowdinProjectId: allSettings.crowdin_project_id || "",
        crowdinPersonalToken: isSuperAdmin(userRoles) && allSettings.crowdin_personal_token ? allSettings.crowdin_personal_token : (allSettings.crowdin_personal_token ? "••••••••••••••••••••" : ""),
        githubToken: isSuperAdmin(userRoles) && allSettings.github_token ? allSettings.github_token : (allSettings.github_token ? "••••••••••••••••••••" : ""),
        registrationEnabled: allSettings.registration_enabled !== "false",
        maintenanceMode: allSettings.maintenance_mode === "true",
        // Email & Notifications
        emailNotifications: allSettings.email_notifications_enabled !== "false",
        resendApiKey: isSuperAdmin(userRoles) && allSettings.resend_api_key ? allSettings.resend_api_key : (allSettings.resend_api_key ? "••••••••••••••••••••" : ""),
        discordNotifications: allSettings.discord_notifications_enabled === "true",
        // Feature flags
        autoSyncEnabled: allSettings.auto_sync_enabled === "true",
        // Advanced
        cacheTimeout: allSettings.cache_timeout ? parseInt(allSettings.cache_timeout, 10) : 60,
        syncInterval: allSettings.sync_interval ? parseInt(allSettings.sync_interval, 10) : 3600,
        // Admin/site
        adminEmail: allSettings.admin_email || "",
        discordWebhooks: discordWebhooks,
        githubRepositories: githubRepos,
        siteName: allSettings.site_name || "NodeByte Hosting",
        siteUrl: allSettings.site_url || "",
        faviconUrl: allSettings.favicon_url || "",
      },
      pterodactylStatus: {
        connected: pterodactylConnected,
        version: pterodactylVersion,
        latency: pterodactylLatency,
      },
      virtfusionStatus: {
        connected: virtfusionConnected,
        version: virtfusionVersion,
        latency: virtfusionLatency,
      },
      databaseStatus: {
        connected: databaseConnected,
      },
    })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

const MASKED_VALUE = "••••••••••••••••••••"

export async function POST(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  // Get current user's roles
  const session = await auth()
  const userRoles = session?.user?.roles || []

  // Only SUPER_ADMIN can modify sensitive settings
  if (!isSuperAdmin(userRoles)) {
    return NextResponse.json(
      { success: false, error: "Only super admins can modify sensitive settings" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    
    // Track which fields are being changed for webhook notification
    const changedFields: string[] = []

    // Save all settings to Config store
    if (body.siteName) {
      await setConfig("site_name", body.siteName)
      changedFields.push("Site Name")
    }
    if (body.siteUrl) {
      await setConfig("site_url", body.siteUrl)
      changedFields.push("Site URL")
    }
    if (body.faviconUrl !== undefined) {
      await setConfig("favicon_url", body.faviconUrl || "")
      changedFields.push("Favicon URL")
    }

    // Panel settings
    if (body.pterodactylUrl) {
      await setConfig("pterodactyl_url", body.pterodactylUrl)
      changedFields.push("Pterodactyl URL")
    }
    if (body.pterodactylApi) {
      await setConfig("pterodactyl_api", body.pterodactylApi)
    }
    if (body.pterodactylApiKey && body.pterodactylApiKey !== MASKED_VALUE) {
      await setConfig("pterodactyl_api_key", body.pterodactylApiKey)
      changedFields.push("Pterodactyl API Key")
    }

    if (body.virtfusionUrl) {
      await setConfig("virtfusion_url", body.virtfusionUrl)
      changedFields.push("Virtfusion URL")
    }
    if (body.virtfusionApi) {
      await setConfig("virtfusion_api", body.virtfusionApi)
    }
    if (body.virtfusionApiKey && body.virtfusionApiKey !== MASKED_VALUE) {
      await setConfig("virtfusion_api_key", body.virtfusionApiKey)
      changedFields.push("Virtfusion API Key")
    }

    // Optional settings
    if (body.githubToken && body.githubToken !== MASKED_VALUE) {
      await setConfig("github_token", body.githubToken)
      changedFields.push("GitHub Token")
    }
    if (body.githubRepositories !== undefined) {
      // Accept either an array or a JSON string from the frontend. Avoid double-encoding.
      let reposToStore: string[] = []
      if (Array.isArray(body.githubRepositories)) {
        reposToStore = body.githubRepositories
      } else if (typeof body.githubRepositories === "string") {
        try {
          const parsed = JSON.parse(body.githubRepositories)
          if (Array.isArray(parsed)) {
            reposToStore = parsed
          } else {
            // It's a plain string (double-encoded), treat as single-entry list
            reposToStore = [String(parsed)]
          }
        } catch {
          // Not JSON — fallback to splitting newlines or treating as single entry
          reposToStore = body.githubRepositories.split("\n").map((r: string) => r.trim()).filter(Boolean)
        }
      }

      // If requested, merge with existing stored repositories instead of overwriting
      if (body.githubRepositoriesMerge) {
        try {
          const existingRaw = await getConfig("github_repositories")
          let existing: string[] = []
          if (existingRaw) {
            try {
              const parsed = JSON.parse(existingRaw)
              if (Array.isArray(parsed)) existing = parsed
            } catch {
              // ignore parse errors
            }
          }

          const union = Array.from(new Set([...existing, ...reposToStore]))
          await setConfig("github_repositories", JSON.stringify(union))
        } catch (e) {
          // fallback to overwrite
          await setConfig("github_repositories", JSON.stringify(reposToStore))
        }
      } else {
        await setConfig("github_repositories", JSON.stringify(reposToStore))
      }
      changedFields.push("GitHub Repositories")
    }
    if (body.resendApiKey && body.resendApiKey !== MASKED_VALUE) {
      await setConfig("resend_api_key", body.resendApiKey)
      changedFields.push("Resend API Key")
    }
    if (body.crowdinProjectId) {
      await setConfig("crowdin_project_id", body.crowdinProjectId)
      changedFields.push("Crowdin Project ID")
    }
    if (body.crowdinPersonalToken && body.crowdinPersonalToken !== MASKED_VALUE) {
      await setConfig("crowdin_personal_token", body.crowdinPersonalToken)
      changedFields.push("Crowdin Token")
    }

    // System settings
    if (body.registrationEnabled !== undefined) {
      await setConfig("registration_enabled", body.registrationEnabled ? "true" : "false")
      changedFields.push("Registration")
    }
    if (body.maintenanceMode !== undefined) {
      await setConfig("maintenance_mode", body.maintenanceMode ? "true" : "false")
      changedFields.push("Maintenance Mode")
    }

    // Auto-sync
    if (body.autoSyncEnabled !== undefined) {
      await setConfig("auto_sync_enabled", body.autoSyncEnabled ? "true" : "false")
      changedFields.push("Auto Sync")
    }

    // Admin email
    if (body.adminEmail !== undefined) {
      await setConfig("admin_email", body.adminEmail || "")
      changedFields.push("Admin Email")
    }

    // Notification settings
    if (body.emailNotifications !== undefined) {
      await setConfig("email_notifications_enabled", body.emailNotifications ? "true" : "false")
      changedFields.push("Email Notifications")
    }
    if (body.discordNotifications !== undefined) {
      await setConfig("discord_notifications_enabled", body.discordNotifications ? "true" : "false")
      changedFields.push("Discord Notifications")
    }

    // Advanced settings
    if (body.cacheTimeout !== undefined) {
      // store as seconds string
      await setConfig("cache_timeout", String(Number(body.cacheTimeout) || 60))
      changedFields.push("Cache Timeout")
    }
    if (body.syncInterval !== undefined) {
      await setConfig("sync_interval", String(Number(body.syncInterval) || 3600))
      changedFields.push("Sync Interval")
    }

    // Discord webhooks
    // Discord webhooks are managed via the DiscordWebhook model and the dedicated webhooks API.
    // Do not write discord_webhooks JSON blob into Config to avoid duplication.

    // Clear cache after updating settings
    clearConfigCache()

    // Dispatch webhook notification for settings update (async, non-blocking)
    if (changedFields.length > 0) {
      dispatchSettingsUpdate(changedFields).catch((error) => {
        console.error("Failed to dispatch settings update webhook:", error)
      })
    }

    // Get updated settings to return
    const updatedSettings = await getAllSettings()

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings
    })
  } catch (error) {
    console.error("Failed to save settings:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  // Get current user's roles
  const session = await auth()
  const userRoles = session?.user?.roles || []

  // Only SUPER_ADMIN can reset/delete sensitive settings
  if (!isSuperAdmin(userRoles)) {
    return NextResponse.json(
      { success: false, error: "Only super admins can reset sensitive settings" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { keys } = body

    if (!Array.isArray(keys)) {
      return NextResponse.json(
        { success: false, error: "keys must be an array" },
        { status: 400 }
      )
    }

    // Delete specified config keys
    const configKeyMap: Record<string, string> = {
      pterodactylApiKey: "pterodactyl_api_key",
      virtfusionApiKey: "virtfusion_api_key",
      crowdinPersonalToken: "crowdin_personal_token",
      githubToken: "github_token",
      resendApiKey: "resend_api_key",
    }

    for (const key of keys) {
      const configKey = configKeyMap[key]
      if (configKey) {
        // Delete by setting to empty string (or you can delete from DB directly)
        await setConfig(configKey, "")
      }
    }

    clearConfigCache()

    return NextResponse.json({
      success: true,
      message: "Settings keys reset successfully"
    })
  } catch (error) {
    console.error("Failed to reset settings:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to reset settings" },
      { status: 500 }
    )
  }
}
