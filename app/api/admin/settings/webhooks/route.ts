import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

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
    const body = await request.json()
    const { name, webhookUrl, type, description, scope } = body

    if (!name || !webhookUrl || !type) {
      return NextResponse.json(
        { success: false, error: "name, webhookUrl, and type are required" },
        { status: 400 }
      )
    }

    const validWebhookUrls = ["discord.com/api/webhooks", "gateway.nodebyte.host/proxy/discord"]

    // Validate Discord webhook URL format
    if (!validWebhookUrls.includes(webhookUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid Discord webhook URL" },
        { status: 400 }
      )
    }

    // Validate scope if provided
    const allowedScopes = ["ADMIN", "USER", "PUBLIC"]
    const webhookScope = scope && allowedScopes.includes(scope) ? scope : "ADMIN"

    // Create webhook
    const webhook = await prisma.discordWebhook.create({
      data: {
        name,
        webhookUrl,
        type,
        description,
        scope: webhookScope,
      }
    })

    return NextResponse.json({
      success: true,
      message: "Webhook created successfully",
      webhook
    })
  } catch (error: any) {
    console.error("Failed to create webhook:", error)

    // Check for unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "This webhook URL already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create webhook" },
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

  try {
    const body = await request.json()
    const { id, name, type, description, enabled, scope, webhookUrl } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl
    if (type !== undefined) updateData.type = type
    if (description !== undefined) updateData.description = description
    if (enabled !== undefined) updateData.enabled = enabled
    if (scope !== undefined) updateData.scope = scope

    const webhook = await prisma.discordWebhook.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: "Webhook updated successfully",
      webhook
    })
  } catch (error) {
    console.error("Failed to update webhook:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update webhook" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      )
    }

    await prisma.discordWebhook.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Webhook deleted successfully"
    })
  } catch (error) {
    console.error("Failed to delete webhook:", error)

    return NextResponse.json(
      { success: false, error: "Failed to delete webhook" },
      { status: 500 }
    )
  }
}

// Test webhook endpoint
export async function PATCH(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      )
    }

    // Get webhook
    const webhook = await prisma.discordWebhook.findUnique({
      where: { id }
    })

    if (!webhook) {
      return NextResponse.json(
        { success: false, error: "Webhook not found" },
        { status: 404 }
      )
    }

    // Test the webhook by sending a test message
    try {
      const response = await fetch(webhook.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "Test Webhook",
              description: `Testing ${webhook.type} webhook (${webhook.name})`,
              color: 5814783, // Green
              timestamp: new Date().toISOString(),
              fields: [
                {
                  name: "Type",
                  value: webhook.type,
                  inline: true,
                },
                {
                  name: "Status",
                  value: "✅ Webhook is working",
                  inline: true,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: `Discord API error: ${response.status}` },
          { status: 400 }
        )
      }

      // Update test success timestamp
      await prisma.discordWebhook.update({
        where: { id },
        data: {
          testSuccessAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Webhook test successful"
      })
    } catch (fetchError) {
      return NextResponse.json(
        { success: false, error: "Failed to reach Discord webhook endpoint" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Failed to test webhook:", error)

    return NextResponse.json(
      { success: false, error: "Failed to test webhook" },
      { status: 500 }
    )
  }
}
