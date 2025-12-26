/**
 * Notification Service
 * 
 * Handles sending notifications via Email (Resend) and Discord
 * based on system settings configured in the Config table.
 */

import { prisma } from "../lib/prisma"
import { getConfig } from "../lib/config"

// ============================================================================
// EMAIL NOTIFICATIONS (via Resend)
// ============================================================================

interface EmailNotificationPayload {
  to: string
  subject: string
  html: string
  text?: string
}

async function getResendApiKey(): Promise<string | null> {
  try {
    const apiKey = await getConfig("resend_api_key")
    const enabled = await getConfig("email_notifications_enabled")

    if (enabled === "false") {
      return null // Email notifications disabled
    }

    if (apiKey) {
      return apiKey
    }
  } catch (error) {
    console.error("[Notifications] Failed to fetch Resend API key:", error)
  }

  return process.env.RESEND_API_KEY || null
}

export async function sendEmailNotification(
  payload: EmailNotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = await getResendApiKey()

    if (!apiKey) {
      console.warn("[Notifications] Email notifications disabled or Resend API key not configured")
      return { success: false, error: "Email notifications not configured" }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "notifications@nodebyte.host",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Notifications] Resend API error:", error)
      return { success: false, error: "Failed to send email" }
    }

    console.log(`[Notifications] Email sent to ${payload.to}`)
    return { success: true }
  } catch (error) {
    console.error("[Notifications] Failed to send email:", error)
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// DISCORD NOTIFICATIONS
// ============================================================================

interface DiscordWebhook {
  name: string
  url: string
}

interface DiscordNotificationPayload {
  title: string
  description?: string
  content?: string
  color?: number // Decimal color code
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
}

async function getDiscordWebhooks(): Promise<DiscordWebhook[]> {
  try {
    const webhooksJson = await getConfig("discord_webhooks")
    const enabled = await getConfig("discord_notifications_enabled")

    if (enabled === "false") {
      return [] // Discord notifications disabled
    }

    if (!webhooksJson) {
      return []
    }

    try {
      return JSON.parse(webhooksJson)
    } catch {
      console.warn("[Notifications] Failed to parse Discord webhooks from database")
      return []
    }
  } catch (error) {
    console.error("[Notifications] Failed to fetch Discord webhooks:", error)
    return []
  }
}

export async function sendDiscordNotification(
  payload: DiscordNotificationPayload
): Promise<{ success: boolean; sent: number; errors: string[] }> {
  try {
    const webhooks = await getDiscordWebhooks()

    if (webhooks.length === 0) {
      console.warn("[Notifications] Discord notifications disabled or no webhooks configured")
      return { success: false, sent: 0, errors: ["No Discord webhooks configured"] }
    }

    const embed = {
      title: payload.title,
      description: payload.description,
      color: payload.color || 3447003, // Default blue
      fields: payload.fields || [],
      timestamp: new Date().toISOString(),
    }

    const errors: string[] = []
    let sent = 0

    for (const webhook of webhooks) {
      try {
        const response = await fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: payload.content,
            embeds: [embed],
            username: "NodeByte",
            avatar_url: "https://nodebyte.host/logo.png",
          }),
        })

        if (!response.ok) {
          errors.push(`[${webhook.name}] Failed to send (${response.status})`)
        } else {
          sent++
          console.log(`[Notifications] Discord notification sent to ${webhook.name}`)
        }
      } catch (error) {
        errors.push(`[${webhook.name}] ${String(error)}`)
        console.error(`[Notifications] Failed to send to webhook ${webhook.name}:`, error)
      }
    }

    return {
      success: sent > 0,
      sent,
      errors,
    }
  } catch (error) {
    console.error("[Notifications] Failed to process Discord notifications:", error)
    return { success: false, sent: 0, errors: [String(error)] }
  }
}

// ============================================================================
// COMBINED NOTIFICATION HANDLER
// ============================================================================

export interface NotificationPayload {
  type: "email" | "discord" | "both"
  email?: EmailNotificationPayload
  discord?: DiscordNotificationPayload
}

export async function sendNotification(
  payload: NotificationPayload
): Promise<{
  email?: { success: boolean; error?: string }
  discord?: { success: boolean; sent: number; errors: string[] }
}> {
  const results: {
    email?: { success: boolean; error?: string }
    discord?: { success: boolean; sent: number; errors: string[] }
  } = {}

  if ((payload.type === "email" || payload.type === "both") && payload.email) {
    results.email = await sendEmailNotification(payload.email)
  }

  if ((payload.type === "discord" || payload.type === "both") && payload.discord) {
    results.discord = await sendDiscordNotification(payload.discord)
  }

  return results
}

// ============================================================================
// EXAMPLE NOTIFICATION TEMPLATES
// ============================================================================

export function createServerStatusNotification(serverName: string, status: "online" | "offline") {
  return {
    title: `Server ${status === "online" ? "Online" : "Offline"}`,
    description: `${serverName} is now ${status}`,
    color: status === "online" ? 3066993 : 15158332, // Green or Red
  }
}

export function createSyncNotification(
  success: boolean,
  details?: string
) {
  return {
    title: success ? "✅ Sync Completed" : "❌ Sync Failed",
    description: details,
    color: success ? 3066993 : 15158332, // Green or Red
  }
}

export function createMaintenanceNotification(enabled: boolean) {
  return {
    title: enabled ? "🔧 Maintenance Mode Enabled" : "✅ Maintenance Mode Disabled",
    color: enabled ? 15105570 : 3066993, // Yellow or Green
  }
}

export function createUserRegistrationNotification(username: string, email: string) {
  return {
    title: "👤 New User Registration",
    fields: [
      { name: "Username", value: username, inline: true },
      { name: "Email", value: email, inline: true },
    ],
    color: 3447003, // Blue
  }
}
