import { NextResponse } from "next/server"
import { getSetupStatus } from "@/packages/core/lib/setup"
import { testPanelConnection } from "@/packages/core/lib/db-test"
import { setConfig, clearConfigCache } from "@/packages/core/lib/config"

export async function GET() {
  try {
    const status = await getSetupStatus()
    return NextResponse.json({ success: true, ...status })
  } catch (error) {
    console.error("[Setup API] Failed to get status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get setup status" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      siteName,
      siteUrl,
      faviconUrl,
      pterodactylUrl,
      pterodactylApiKey,
      pterodactylApi,
      virtfusionUrl,
      virtfusionApiKey,
      virtfusionApi,
      // Optional settings that can be configured later
      githubToken,
      resendApiKey,
      crowdinProjectId,
      crowdinPersonalToken,
      discordWebhooks,
      testConnections = false,
    } = body

    // Validate that at least one configuration is being set
    const hasSiteInfo = !!(siteName || siteUrl)
    const hasPterodactyl = !!(pterodactylUrl && pterodactylApiKey)
    const hasVirtfusion = !!(virtfusionUrl && virtfusionApiKey)

    if (!hasSiteInfo && !hasPterodactyl && !hasVirtfusion) {
      return NextResponse.json(
        { success: false, error: "At least one configuration section must be provided" },
        { status: 400 }
      )
    }

    // Test connections if requested
    const testResults: Record<string, any> = {}

    if (testConnections) {
      // Test Pterodactyl connection
      if (pterodactylUrl && pterodactylApiKey) {
        testResults.pterodactyl = await testPanelConnection(
          pterodactylUrl,
          pterodactylApiKey,
          "pterodactyl"
        )
      }

      // Test Virtfusion connection
      if (virtfusionUrl && virtfusionApiKey) {
        testResults.virtfusion = await testPanelConnection(
          virtfusionUrl,
          virtfusionApiKey,
          "virtfusion"
        )
      }

      // Return test results without saving
      return NextResponse.json({
        success: true,
        message: "Connection tests completed",
        testResults,
      })
    }

    // Save configuration to Config store - Required settings
    if (siteName) await setConfig("site_name", siteName)
    if (siteUrl) await setConfig("site_url", siteUrl)
    if (faviconUrl !== undefined) await setConfig("favicon_url", faviconUrl || "")
    
    if (pterodactylUrl) await setConfig("pterodactyl_url", pterodactylUrl)
    if (pterodactylApiKey) await setConfig("pterodactyl_api_key", pterodactylApiKey)
    if (pterodactylApi) await setConfig("pterodactyl_api", pterodactylApi)
    
    if (virtfusionUrl) await setConfig("virtfusion_url", virtfusionUrl)
    if (virtfusionApiKey) await setConfig("virtfusion_api_key", virtfusionApiKey)
    if (virtfusionApi) await setConfig("virtfusion_api", virtfusionApi)
    
    // Save optional settings if provided
    if (githubToken) await setConfig("github_token", githubToken)
    if (resendApiKey) await setConfig("resend_api_key", resendApiKey)
    if (crowdinProjectId) await setConfig("crowdin_project_id", crowdinProjectId)
    if (crowdinPersonalToken) await setConfig("crowdin_personal_token", crowdinPersonalToken)
    if (discordWebhooks) await setConfig("discord_webhooks", JSON.stringify(discordWebhooks))
    
    // Clear cache to ensure fresh values
    clearConfigCache()

    // Get updated status to return
    const updatedStatus = await getSetupStatus()

    return NextResponse.json({
      success: true,
      message: "Setup configuration saved successfully",
      ...updatedStatus,
    })
  } catch (error) {
    console.error("[Setup API] Failed to complete setup:", error)
    return NextResponse.json(
      { success: false, error: "Failed to complete setup" },
      { status: 500 }
    )
  }
}

