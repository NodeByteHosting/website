/**
 * WEBHOOK DISPATCHER - QUICK REFERENCE
 * 
 * Copy-paste ready examples for all dispatch functions
 */

// ============================================================================
// 1. SETTINGS UPDATE WEBHOOK
// ============================================================================
import { dispatchSettingsUpdate } from "@/packages/core/dispatchers/webhooks"

// Automatically called in: app/api/admin/settings/route.ts
// Manual usage:
await dispatchSettingsUpdate(
  ["Maintenance Mode", "Cache Timeout"],
  "admin@example.com"
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 2. SYNC COMPLETION WEBHOOK
// ============================================================================
import { dispatchSyncCompletion } from "@/packages/core/dispatchers/webhooks"

// Automatically called in: packages/core/lib/sync.ts
// Manual usage:
await dispatchSyncCompletion(
  true, // success
  "Synced 150 servers, 300 nodes, 500 allocations",
  "45.23s"
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 3. SERVER STATE CHANGE WEBHOOK
// ============================================================================
import { dispatchServerStateChange } from "@/packages/core/dispatchers/webhooks"

// Server online
await dispatchServerStateChange("Rust Server 1", "online", "node-1")
  .catch((error) => console.error("Webhook failed:", error))

// Server offline
await dispatchServerStateChange("Minecraft Server", "offline", "node-2")
  .catch((error) => console.error("Webhook failed:", error))

// Server crashed
await dispatchServerStateChange("Game Server 3", "crashed", "node-1")
  .catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 4. SYSTEM ALERT WEBHOOK
// ============================================================================
import { dispatchSystemAlert } from "@/packages/core/dispatchers/webhooks"

// Error alert
await dispatchSystemAlert(
  "Database Connection Failed",
  "Unable to connect to PostgreSQL: connection timeout",
  "error"
).catch((error) => console.error("Webhook failed:", error))

// Warning alert
await dispatchSystemAlert(
  "High Memory Usage",
  "Server memory usage at 85%",
  "warning"
).catch((error) => console.error("Webhook failed:", error))

// Info alert
await dispatchSystemAlert(
  "Scheduled Maintenance",
  "System will undergo maintenance on 2025-12-25 from 02:00-04:00 UTC",
  "info"
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 5. SUPPORT TICKET WEBHOOK
// ============================================================================
import { dispatchSupportTicket } from "@/packages/core/dispatchers/webhooks"

// Ticket created
await dispatchSupportTicket(
  "created",
  "TICKET-12345",
  "Server not starting",
  "User reports server won't start after restart"
).catch((error) => console.error("Webhook failed:", error))

// Ticket updated
await dispatchSupportTicket(
  "updated",
  "TICKET-12345",
  "Server not starting",
  "Updated status: investigating"
).catch((error) => console.error("Webhook failed:", error))

// Ticket resolved
await dispatchSupportTicket(
  "resolved",
  "TICKET-12345",
  "Server not starting",
  "Fixed: memory limit was set too low"
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 6. NODE ALERT WEBHOOK
// ============================================================================
import { dispatchNodeAlert } from "@/packages/core/dispatchers/webhooks"

// CPU alert
await dispatchNodeAlert("vps-01", "cpu", 92, 80)
  .catch((error) => console.error("Webhook failed:", error))

// Memory alert
await dispatchNodeAlert("vps-02", "memory", 87, 75)
  .catch((error) => console.error("Webhook failed:", error))

// Disk alert
await dispatchNodeAlert("vps-03", "disk", 95, 90)
  .catch((error) => console.error("Webhook failed:", error))

// Network alert
await dispatchNodeAlert("vps-01", "network", 78, 70)
  .catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 7. BILLING EVENT WEBHOOK
// ============================================================================
import { dispatchBillingEvent } from "@/packages/core/dispatchers/webhooks"

// Invoice generated
await dispatchBillingEvent(
  "invoice",
  "Invoice #INV-2025-001234 has been generated",
  "$299.99"
).catch((error) => console.error("Webhook failed:", error))

// Payment processed
await dispatchBillingEvent(
  "payment",
  "Payment received for Invoice #INV-2025-001234",
  "$299.99"
).catch((error) => console.error("Webhook failed:", error))

// Subscription updated
await dispatchBillingEvent(
  "subscription",
  "Subscription upgraded from Pro to Enterprise",
  "+$150.00/month"
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// 8. CUSTOM WEBHOOK (Low-Level)
// ============================================================================
import { dispatchWebhook } from "@/packages/core/dispatchers/webhooks"

// Simple custom event
await dispatchWebhook(
  "CUSTOM",
  {
    title: "Custom Event",
    description: "Something interesting happened",
    color: 3447003, // Blue
    fields: [
      { name: "Event", value: "Custom", inline: true },
      { name: "Details", value: "More info", inline: false }
    ]
  }
).catch((error) => console.error("Webhook failed:", error))

// Custom with specific scopes
await dispatchWebhook(
  "SYSTEM",
  {
    title: "Admin-Only Event",
    description: "This only goes to ADMIN webhooks",
    color: 16776960 // Yellow
  },
  { scopes: ["ADMIN"] }
).catch((error) => console.error("Webhook failed:", error))

// Custom with multiple types
await dispatchWebhook(
  "SYSTEM",
  {
    title: "Multi-Type Event",
    description: "Goes to SYSTEM and VPS webhooks",
    color: 3066993 // Green
  },
  { types: ["SYSTEM", "VPS"] }
).catch((error) => console.error("Webhook failed:", error))


// ============================================================================
// COLOR REFERENCE
// ============================================================================
/*
  3066993  - Green    (#2D5F2E) - Success/Online
  15158332 - Red      (#E63946) - Error/Offline/Failed
  16776960 - Yellow   (#FFFF00) - Warning/In-Progress
  3447003  - Blue     (#3498DB) - Info/General
  15105570 - Orange   (#FF6B35) - Alert/Critical
  65535    - Cyan     (#00FFFF) - Support/Tickets
  9807270  - Purple   (#95A5A6) - Custom
*/


// ============================================================================
// WEBHOOK TYPE REFERENCE
// ============================================================================
/*
  "GAME_SERVER" - Server online/offline/crashed events
  "VPS"         - Node/resource alerts
  "SYSTEM"      - Sync, settings, maintenance
  "BILLING"     - Invoices, payments, subscriptions
  "SECURITY"    - Errors, alerts
  "SUPPORT"     - Support tickets
  "CUSTOM"      - Fallback/custom events
*/


// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================
/*
  ✓ System Settings Updates       - ACTIVE (app/api/admin/settings/route.ts)
  ✓ Sync Completion              - ACTIVE (packages/core/lib/sync.ts)
  ⏳ Server State Changes         - READY (use dispatchServerStateChange)
  ⏳ Node/Resource Alerts         - READY (use dispatchNodeAlert)
  ⏳ Error/System Alerts          - READY (use dispatchSystemAlert)
  ⏳ Support Tickets              - READY (use dispatchSupportTicket)
  ⏳ Billing Events               - READY (use dispatchBillingEvent)
*/


// ============================================================================
// ERROR HANDLING PATTERN
// ============================================================================
import { dispatchWebhook } from "@/packages/core/dispatchers/webhooks"

const result = await dispatchWebhook(...)
  .catch((error) => {
    console.error("Webhook dispatch failed:", error)
    // Return null or default result - don't throw
    return { success: false, sent: 0, failed: 0, errors: [] }
  })

if (result.success) {
  console.log(`Sent to ${result.sent} webhooks`)
} else {
  console.log(`Failed: ${result.failed} webhooks`)
  result.errors.forEach((error) => {
    console.log(`  - ${error.webhook}: ${error.error}`)
  })
}
