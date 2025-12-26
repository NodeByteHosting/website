import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"
import { getConfig } from "@/packages/core/lib/config"
import { testPanelConnection } from "@/packages/core/lib/db-test"

export async function POST(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const body = await request.json()

    if (type === "database") {
      const start = Date.now()
      try {
        await prisma.$queryRaw`SELECT 1`
        const latency = Date.now() - start
        return NextResponse.json({
          success: true,
          latency,
        })
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "Database connection failed",
        })
      }
    }

    if (type === "pterodactyl") {
      // Get settings from config store
      const pterodactylUrl = body.pterodactylUrl || (await getConfig("pterodactyl_url"))
      const pterodactylApiKey = body.pterodactylApiKey || (await getConfig("pterodactyl_api_key"))

      if (!pterodactylUrl || !pterodactylApiKey) {
        return NextResponse.json({
          success: false,
          error: "Pterodactyl credentials not configured",
        })
      }

      try {
        const testResult = await testPanelConnection(pterodactylUrl, pterodactylApiKey, "pterodactyl")
        return NextResponse.json(testResult)
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "Failed to connect to Pterodactyl panel",
        })
      }
    }

    if (type === "virtfusion") {
      // Get settings from config store
      const virtfusionUrl = body.virtfusionUrl || (await getConfig("virtfusion_url"))
      const virtfusionApiKey = body.virtfusionApiKey || (await getConfig("virtfusion_api_key"))

      if (!virtfusionUrl || !virtfusionApiKey) {
        return NextResponse.json({
          success: false,
          error: "Virtfusion credentials not configured",
        })
      }

      try {
        const testResult = await testPanelConnection(virtfusionUrl, virtfusionApiKey, "virtfusion")
        return NextResponse.json(testResult)
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "Failed to connect to Virtfusion panel",
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: "Invalid test type",
    })
  } catch (error) {
    console.error("Connection test failed:", error)
    
    return NextResponse.json(
      { success: false, error: "Connection test failed" },
      { status: 500 }
    )
  }
}
