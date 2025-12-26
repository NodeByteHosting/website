/**
 * WEBHOOK DISPATCHER - INTEGRATION GUIDE
 * 
 * This guide shows how to integrate webhook notifications throughout the codebase.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import {
  dispatchWebhook,
  dispatchSettingsUpdate,
  dispatchServerStateChange,
  dispatchSyncCompletion,
  dispatchSystemAlert,
  dispatchSupportTicket,
  dispatchNodeAlert,
  dispatchBillingEvent,
  type DispatchOptions,
} from "@/packages/core/lib/webhook-dispatcher"

// ============================================================================
// 1. SYSTEM SETTINGS UPDATES
// ============================================================================

// ALREADY INTEGRATED in: app/api/admin/settings/route.ts
// The settings POST handler now automatically sends webhooks when settings are modified

// Example usage in other parts of the codebase:
async function exampleSettingsUpdate() {
  await dispatchSettingsUpdate(
    ["Maintenance Mode", "Sync Interval", "Cache Timeout"],
    "admin@example.com" // optional: who made the change
  )
}

// ============================================================================
// 2. SERVER STATE CHANGES
// ============================================================================

// Use this when servers start, stop, or crash (usually from Pterodactyl webhooks or polling)
async function exampleServerStateChange() {
  // Server came online
  await dispatchServerStateChange("Rust Server 1", "online", "node-1")

  // Server went offline
  await dispatchServerStateChange("Minecraft Server", "offline", "node-2")

  // Server crashed
  await dispatchServerStateChange("Game Server 3", "crashed", "node-1")
}

// ============================================================================
// 3. SYNC COMPLETION
// ============================================================================

// ALREADY INTEGRATED in: packages/core/lib/sync.ts
// The runFullSync function now automatically sends webhooks on completion/failure

// Example usage for individual sync operations:
async function exampleSyncCompletion() {
  const success = true
  const details = "Synced 150 servers, 300 nodes, 500 allocations"
  const duration = "45.23s"

  await dispatchSyncCompletion(success, details, duration)
}

// ============================================================================
// 4. SYSTEM ALERTS & ERRORS
// ============================================================================

// Use for critical errors, security issues, health checks, etc.
async function exampleSystemAlert() {
  // Error alert
  await dispatchSystemAlert(
    "Database Connection Failed",
    "Unable to connect to PostgreSQL: connection timeout",
    "error"
  )

  // Warning alert
  await dispatchSystemAlert(
    "High Memory Usage",
    "Server memory usage at 85%",
    "warning"
  )

  // Info alert
  await dispatchSystemAlert(
    "Maintenance Scheduled",
    "System will undergo maintenance on 2025-12-25 from 02:00-04:00 UTC",
    "info"
  )
}

// INTEGRATION POINTS for system alerts:
// - API error handlers (catch blocks)
// - Database connection issues
// - Critical log statements
// - Health check endpoints
// - Resource monitoring

// ============================================================================
// 5. SUPPORT TICKETS
// ============================================================================

// Use when support tickets are created, updated, or resolved
async function exampleSupportTicket() {
  // Ticket created
  await dispatchSupportTicket(
    "created",
    "TICKET-12345",
    "Server not starting",
    "User reports server won't start after restart"
  )

  // Ticket updated
  await dispatchSupportTicket(
    "updated",
    "TICKET-12345",
    "Server not starting",
    "Updated status: investigating"
  )

  // Ticket resolved
  await dispatchSupportTicket(
    "resolved",
    "TICKET-12345",
    "Server not starting",
    "Issue resolved: memory limit was too low"
  )
}

// ============================================================================
// 6. NODE/VPS RESOURCE ALERTS
// ============================================================================

// Use for resource monitoring and alerts
async function exampleNodeAlert() {
  // CPU alert
  await dispatchNodeAlert("vps-01", "cpu", 92, 80)

  // Memory alert
  await dispatchNodeAlert("vps-02", "memory", 87, 75)

  // Disk alert
  await dispatchNodeAlert("vps-03", "disk", 95, 90)

  // Network alert
  await dispatchNodeAlert("vps-01", "network", 78, 70)
}

// INTEGRATION POINTS for node alerts:
// - Monitoring service/cron job
// - Node status endpoint
// - System performance tracking

// ============================================================================
// 7. BILLING EVENTS
// ============================================================================

// Use for invoice, payment, and subscription events
async function exampleBillingEvent() {
  // Invoice generated
  await dispatchBillingEvent(
    "invoice",
    "Invoice #INV-2025-001234 has been generated",
    "$299.99"
  )

  // Payment processed
  await dispatchBillingEvent(
    "payment",
    "Payment received for Invoice #INV-2025-001234",
    "$299.99"
  )

  // Subscription updated
  await dispatchBillingEvent(
    "subscription",
    "Subscription upgraded from Pro to Enterprise",
    "+$150.00/month"
  )
}

// ============================================================================
// 8. CUSTOM WEBHOOKS
// ============================================================================

// For events not covered by the helper functions, use dispatchWebhook directly
async function exampleCustomWebhook() {
  await dispatchWebhook("CUSTOM", {
    title: "Custom Event",
    description: "Something interesting happened",
    color: 3447003, // Blue
    fields: [
      { name: "Event Type", value: "Custom", inline: true },
      { name: "Details", value: "Additional information", inline: false },
    ],
  })

  // You can also target specific scopes:
  await dispatchWebhook(
    "SYSTEM",
    {
      title: "Internal System Event",
      description: "This only goes to ADMIN webhooks",
      color: 16776960,
    },
    { scopes: ["ADMIN"] } // Only send to admin-scoped webhooks
  )

  // Or to multiple types:
  await dispatchWebhook(
    "SYSTEM",
    {
      title: "Multi-type Event",
      description: "This goes to SYSTEM and VPS webhooks",
      color: 3066993,
    },
    { types: ["SYSTEM", "VPS"] } // Send to both types
  )
}

// ============================================================================
// WEBHOOK TYPE REFERENCE
// ============================================================================

/*
 * GAME_SERVER - Server start/stop/crash events
 * VPS - Node/resource monitoring and alerts
 * SYSTEM - Sync operations, maintenance mode, settings changes
 * BILLING - Invoice, payment, and subscription events
 * SECURITY - Errors, alerts, and security events
 * SUPPORT - Support ticket notifications
 * CUSTOM - Custom events (fallback type)
 */

// ============================================================================
// SCOPE REFERENCE
// ============================================================================

/*
 * ADMIN - Only sent to admin-scoped webhooks (system-wide)
 * USER - Sent to user-specific webhooks (future: client panel)
 * PUBLIC - Public webhooks (optional: for public events)
 */

// ============================================================================
// ERROR HANDLING
// ============================================================================

// All dispatch functions are async and return results:
async function exampleErrorHandling() {
  const result = await dispatchSystemAlert(
    "Example Alert",
    "Testing webhook delivery",
    "info"
  )

  console.log(`Sent to ${result.sent} webhooks`)
  console.log(`Failed: ${result.failed} webhooks`)
  
  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      console.log(`  - ${error.webhook}: ${error.error}`)
    })
  }

  // Best practice: don't block request on webhook failure
  // Always use .catch() to handle errors gracefully
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

/*
 * 1. Always dispatch webhooks asynchronously (non-blocking):
 *    dispatchWebhook(...).catch((error) => {
 *      console.error("Webhook dispatch failed:", error)
 *    })
 *
 * 2. Don't block user requests on webhook delivery:
 *    Save data first, then dispatch webhook in background
 *
 * 3. Include relevant context in notifications:
 *    - Who made the change (user/admin email)
 *    - What changed (field names)
 *    - When it happened (timestamp is auto-added)
 *    - Why it happened (reason/details)
 *
 * 4. Use appropriate webhook types:
 *    - GAME_SERVER for player-facing server events
 *    - SYSTEM for internal operations
 *    - SECURITY for errors/alerts
 *    - SUPPORT for customer-facing issues
 *
 * 5. Color-code embeds by status:
 *    - Green (3066993): Success
 *    - Red (15158332): Failure/Error
 *    - Yellow (16776960): Warning/In-progress
 *    - Blue (3447003): Info
 *    - Orange (15105570): Alert
 *    - Cyan (65535): Support/Tickets
 *
 * 6. Test webhooks in the admin panel before relying on them
 */
