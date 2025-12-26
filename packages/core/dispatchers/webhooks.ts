/**
 * Webhook Dispatcher Service
 * 
 * Sends Discord webhook notifications based on event types and configured webhooks.
 * Queries the database for webhooks matching the event type and scope, then delivers
 * notifications asynchronously with proper error handling.
 */

import { prisma } from "../lib/prisma"

// ============================================================================
// TYPES
// ============================================================================

type WebhookType = "GAME_SERVER" | "VPS" | "SYSTEM" | "BILLING" | "SECURITY" | "SUPPORT" | "CUSTOM"
type WebhookScope = "ADMIN" | "USER" | "PUBLIC"

interface WebhookEmbedField {
  name: string
  value: string
  inline?: boolean
}

interface WebhookEmbed {
  title: string
  description?: string
  color?: number // Decimal color code
  fields?: WebhookEmbedField[]
  footer?: {
    text: string
    icon_url?: string
  }
}

interface WebhookPayload {
  content?: string
  embeds: WebhookEmbed[]
  username?: string
  avatar_url?: string
}

export interface DispatchOptions {
  types?: WebhookType[] // If empty, sends to all matching types
  scopes?: WebhookScope[] // If empty, sends to ADMIN scope
  onlyEnabled?: boolean // Default: true
}

interface WebhookRecord {
  id: string
  webhookUrl: string
  name: string
  type: WebhookType
  scope: WebhookScope
  enabled: boolean
}

// ============================================================================
// WEBHOOK DELIVERY
// ============================================================================

async function sendToWebhook(
  webhook: WebhookRecord,
  payload: WebhookPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(webhook.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NodeByte-Dispatcher/1.0",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(
        `[WebhookDispatcher] Failed to send to webhook "${webhook.name}" (${webhook.type}): ${response.status} ${response.statusText}`
      )
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    // Update webhook's testSuccessAt timestamp
    try {
      await prisma.discordWebhook.update({
        where: { id: webhook.id },
        data: { testSuccessAt: new Date() },
      })
    } catch (error) {
      console.warn(
        `[WebhookDispatcher] Failed to update webhook success timestamp for "${webhook.name}":`,
        error
      )
    }

    console.log(
      `[WebhookDispatcher] Successfully sent to webhook "${webhook.name}" (${webhook.type})`
    )
    return { success: true }
  } catch (error) {
    console.error(
      `[WebhookDispatcher] Exception sending to webhook "${webhook.name}":`,
      error
    )
    return {
      success: false,
      error: String(error),
    }
  }
}

// ============================================================================
// WEBHOOK QUERYING & FILTERING
// ============================================================================

async function getWebhooksForEvent(
  eventType: WebhookType,
  options: DispatchOptions = {}
): Promise<WebhookRecord[]> {
  const { types, scopes = ["ADMIN"], onlyEnabled = true } = options

  try {
    const webhooks = await prisma.discordWebhook.findMany({
      where: {
        // Filter by webhook type if specified, otherwise use event type
        type: types && types.length > 0 ? { in: types } : eventType,
        // Filter by scope
        scope: scopes && scopes.length > 0 ? { in: scopes } : "ADMIN",
        // Filter by enabled status
        enabled: onlyEnabled ? true : undefined,
      },
      select: {
        id: true,
        webhookUrl: true,
        name: true,
        type: true,
        scope: true,
        enabled: true,
      },
    })

    return webhooks as WebhookRecord[]
  } catch (error) {
    console.error("[WebhookDispatcher] Failed to query webhooks:", error)
    return []
  }
}

// ============================================================================
// PUBLIC DISPATCH METHODS
// ============================================================================

/**
 * Dispatch a webhook event to all matching configured webhooks
 */
export async function dispatchWebhook(
  eventType: WebhookType,
  embed: WebhookEmbed,
  options: DispatchOptions = {}
): Promise<{
  success: boolean
  sent: number
  failed: number
  errors: Array<{ webhook: string; error: string }>
}> {
  const webhooks = await getWebhooksForEvent(eventType, options)

  if (webhooks.length === 0) {
    console.info(
      `[WebhookDispatcher] No webhooks configured for type "${eventType}" with scope "${
        options.scopes?.[0] || "ADMIN"
      }"`
    )
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: [{ webhook: "system", error: "No webhooks configured for this event type" }],
    }
  }

  const payload: WebhookPayload = {
    embeds: [
      {
        ...embed,
        timestamp: new Date().toISOString(),
        footer: {
          text: "NodeByte Hosting",
          icon_url: "https://nodebyte.host/logo.png",
        },
      },
    ],
    username: "NodeByte",
    avatar_url: "https://nodebyte.host/logo.png",
  }

  const results = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [] as Array<{ webhook: string; error: string }>,
  }

  // Send to all webhooks in parallel
  const promises = webhooks.map(async (webhook) => {
    const result = await sendToWebhook(webhook, payload)
    if (result.success) {
      results.sent++
    } else {
      results.failed++
      results.errors.push({
        webhook: webhook.name,
        error: result.error || "Unknown error",
      })
    }
  })

  await Promise.all(promises)

  results.success = results.sent > 0

  return results
}

// ============================================================================
// EVENT-SPECIFIC DISPATCH HELPERS
// ============================================================================

/**
 * System settings were updated
 */
export async function dispatchSettingsUpdate(
  changedFields: string[],
  updatedBy?: string
): Promise<ReturnType<typeof dispatchWebhook>> {
  return dispatchWebhook("SYSTEM", {
    title: "⚙️ System Settings Updated",
    description: `Settings have been modified`,
    color: 16776960, // Yellow
    fields: [
      {
        name: "Changed Fields",
        value: changedFields.join(", ") || "Unknown",
        inline: false,
      },
      ...(updatedBy ? [{ name: "Updated By", value: updatedBy, inline: true }] : []),
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: true,
      },
    ],
  })
}

/**
 * Server state changed (online/offline/crashed)
 */
export async function dispatchServerStateChange(
  serverName: string,
  newState: "online" | "offline" | "crashed",
  nodeId?: string
): Promise<ReturnType<typeof dispatchWebhook>> {
  const statusMap = {
    online: { emoji: "🟢", label: "Online", color: 3066993 }, // Green
    offline: { emoji: "🔴", label: "Offline", color: 15158332 }, // Red
    crashed: { emoji: "💥", label: "Crashed", color: 15105570 }, // Orange
  }

  const status = statusMap[newState]

  return dispatchWebhook("GAME_SERVER", {
    title: `${status.emoji} Server ${status.label}`,
    description: `${serverName} is now ${newState}`,
    color: status.color,
    fields: [
      { name: "Server", value: serverName, inline: true },
      { name: "Status", value: status.label, inline: true },
      ...(nodeId ? [{ name: "Node", value: nodeId, inline: true }] : []),
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: false,
      },
    ],
  })
}

/**
 * Sync operation completed or failed
 */
export async function dispatchSyncCompletion(
  success: boolean,
  details?: string,
  duration?: string
): Promise<ReturnType<typeof dispatchWebhook>> {
  const statusMap = {
    true: { emoji: "✅", label: "Completed", color: 3066993 }, // Green
    false: { emoji: "❌", label: "Failed", color: 15158332 }, // Red
  }

  const status = statusMap[success ? "true" : "false"]

  return dispatchWebhook("SYSTEM", {
    title: `${status.emoji} Sync ${status.label}`,
    description: details || (success ? "Server sync completed successfully" : "Server sync encountered an error"),
    color: status.color,
    fields: [
      { name: "Status", value: status.label, inline: true },
      ...(duration ? [{ name: "Duration", value: duration, inline: true }] : []),
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: false,
      },
    ],
  })
}

/**
 * System error or critical alert
 */
export async function dispatchSystemAlert(
  title: string,
  error: string,
  severity: "info" | "warning" | "error" = "error"
): Promise<ReturnType<typeof dispatchWebhook>> {
  const severityMap = {
    info: { emoji: "ℹ️", color: 3447003 }, // Blue
    warning: { emoji: "⚠️", color: 15105570 }, // Orange
    error: { emoji: "🚨", color: 15158332 }, // Red
  }

  const sev = severityMap[severity]

  return dispatchWebhook("SECURITY", {
    title: `${sev.emoji} ${title}`,
    description: error,
    color: sev.color,
    fields: [
      {
        name: "Severity",
        value: severity.charAt(0).toUpperCase() + severity.slice(1),
        inline: true,
      },
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: true,
      },
    ],
  })
}

/**
 * Support ticket created or updated
 */
export async function dispatchSupportTicket(
  action: "created" | "updated" | "resolved",
  ticketId: string,
  subject: string,
  details?: string
): Promise<ReturnType<typeof dispatchWebhook>> {
  const actionMap = {
    created: { emoji: "🎫", label: "Created", color: 3447003 }, // Blue
    updated: { emoji: "🔄", label: "Updated", color: 16776960 }, // Yellow
    resolved: { emoji: "✅", label: "Resolved", color: 3066993 }, // Green
  }

  const act = actionMap[action]

  return dispatchWebhook("SUPPORT", {
    title: `${act.emoji} Support Ticket ${act.label}`,
    description: subject,
    color: act.color,
    fields: [
      { name: "Ticket ID", value: ticketId, inline: true },
      { name: "Action", value: act.label, inline: true },
      ...(details ? [{ name: "Details", value: details, inline: false }] : []),
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: false,
      },
    ],
  })
}

/**
 * Node/VPS resource alert
 */
export async function dispatchNodeAlert(
  nodeName: string,
  alertType: "cpu" | "memory" | "disk" | "network",
  usage: number,
  threshold: number
): Promise<ReturnType<typeof dispatchWebhook>> {
  const alertTypeMap = {
    cpu: { label: "CPU", color: 15158332 }, // Red
    memory: { label: "Memory", color: 15105570 }, // Orange
    disk: { label: "Disk Space", color: 16776960 }, // Yellow
    network: { label: "Network", color: 3447003 }, // Blue
  }

  const alert = alertTypeMap[alertType]

  return dispatchWebhook("VPS", {
    title: `⚠️ ${alert.label} Usage Alert`,
    description: `${nodeName} has high ${alertType} usage`,
    color: alert.color,
    fields: [
      { name: "Node", value: nodeName, inline: true },
      { name: "Current Usage", value: `${usage}%`, inline: true },
      { name: "Threshold", value: `${threshold}%`, inline: true },
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: false,
      },
    ],
  })
}

/**
 * Billing event
 */
export async function dispatchBillingEvent(
  eventType: "invoice" | "payment" | "subscription",
  details: string,
  amount?: string
): Promise<ReturnType<typeof dispatchWebhook>> {
  const eventMap = {
    invoice: { emoji: "📄", label: "Invoice Generated" },
    payment: { emoji: "💳", label: "Payment Processed" },
    subscription: { emoji: "📅", label: "Subscription Updated" },
  }

  const evt = eventMap[eventType]

  return dispatchWebhook("BILLING", {
    title: `${evt.emoji} ${evt.label}`,
    description: details,
    color: 3066993, // Green
    fields: [
      { name: "Type", value: evt.label, inline: true },
      ...(amount ? [{ name: "Amount", value: amount, inline: true }] : []),
      {
        name: "Timestamp",
        value: new Date().toISOString(),
        inline: false,
      },
    ],
  })
}
