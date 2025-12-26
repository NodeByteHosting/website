# Webhook Notification Dispatcher - Implementation Summary

## Overview

The webhook notification system has been fully implemented, allowing your NodeByte Hosting platform to send Discord webhooks for system events. The system supports 7 webhook types, automatic event detection, and comprehensive error handling.

## What Was Built

### 1. Core Webhook Dispatcher Service
**File:** `packages/core/lib/webhook-dispatcher.ts`

A production-ready service that:
- Queries database for configured webhooks by event type
- Sends Discord embeds asynchronously (non-blocking)
- Tracks webhook delivery success/failure
- Updates webhook's `testSuccessAt` timestamp on success
- Provides type-safe, event-specific dispatch functions
- Returns detailed delivery results

**Key Functions:**
- `dispatchWebhook()` - Low-level webhook dispatch with custom embeds
- `dispatchSettingsUpdate()` - System settings changes
- `dispatchServerStateChange()` - Server online/offline/crashed events
- `dispatchSyncCompletion()` - Sync operation success/failure
- `dispatchSystemAlert()` - Critical errors and alerts
- `dispatchSupportTicket()` - Support ticket lifecycle events
- `dispatchNodeAlert()` - Resource monitoring (CPU, memory, disk, network)
- `dispatchBillingEvent()` - Invoice, payment, subscription events

### 2. Integration Points

#### ✅ System Settings Updates
**File:** `app/api/admin/settings/route.ts`

When admin settings are modified:
- Detects which fields changed
- Sends SYSTEM webhook with changed field names
- Non-blocking (doesn't delay API response)
- Includes timestamp and changed fields list

#### ✅ Sync Operations
**File:** `packages/core/lib/sync.ts`

When full sync completes:
- Sends SYSTEM webhook with sync status
- Includes summary (locations, nodes, allocations, servers, databases synced)
- Includes duration in seconds
- Marks as success or failure based on all operations

#### ✅ Webhook Type Support
All 7 webhook types now available:
- **GAME_SERVER** - Server state changes (online/offline/crashed)
- **VPS** - Node/resource alerts (CPU, memory, disk, network usage)
- **SYSTEM** - Internal operations (sync, settings, maintenance)
- **BILLING** - Financial events (invoices, payments, subscriptions)
- **SECURITY** - Errors, alerts, and security events
- **SUPPORT** - Support ticket lifecycle (created, updated, resolved)
- **CUSTOM** - Fallback for custom/unclassified events

### 3. Webhook Delivery Features

**Color-Coded Embeds:**
- 🟢 Green (3066993) - Success
- 🔴 Red (15158332) - Failure/Error
- 🟡 Yellow (16776960) - Warning/In-Progress
- 🔵 Blue (3447003) - Info/General
- 🟠 Orange (15105570) - Alert/Critical
- 🩵 Cyan (65535) - Support/Tickets

**Rich Embed Information:**
- Title with emoji indicator
- Description of what happened
- Structured fields with metadata
- Timestamps (automatic)
- Footer with NodeByte branding

**Reliability:**
- Parallel webhook delivery (no sequential delays)
- Individual failure handling (one webhook failure doesn't block others)
- Detailed error reporting per webhook
- Database transaction tracking for success timestamps
- Non-blocking dispatch (uses `.catch()` pattern)

## Architecture

### Database Schema (Already Applied)
```prisma
model DiscordWebhook {
  id            String   @id @default(cuid())
  name          String
  webhookUrl    String   @db.Text
  type          DiscordWebhookType
  scope         DiscordWebhookScope
  enabled       Boolean  @default(true)
  testSuccessAt DateTime?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])
  
  @@unique([webhookUrl, userId])
  @@index([userId])
  @@index([type])
  @@index([scope])
}

enum DiscordWebhookType {
  GAME_SERVER
  VPS
  SYSTEM
  BILLING
  SECURITY
  SUPPORT
  CUSTOM
}

enum DiscordWebhookScope {
  ADMIN
  USER
  PUBLIC
}
```

### How It Works

1. **Configuration Phase**
   - Admin creates webhooks in settings panel
   - Webhooks stored in database with type/scope
   - Can test webhooks before using them

2. **Event Occurs**
   - System event happens (sync completes, settings change, etc.)
   - Code calls appropriate dispatch function
   - Dispatcher queries database for matching webhooks

3. **Delivery Phase**
   - Dispatcher queries all webhooks matching event type
   - Constructs Discord embed with event details
   - Sends embeds in parallel to all matching webhooks
   - Updates `testSuccessAt` on success
   - Logs errors per webhook

4. **Results**
   - Returns delivery results (sent count, failed count, errors)
   - Non-blocking - request completes before webhooks sent
   - Webhook failures don't affect main application

## How to Extend

### Adding Webhooks to New Events

1. **Identify the event location** (where in code it happens)
2. **Import the dispatcher:**
   ```typescript
   import { dispatchServerStateChange } from "@/packages/core/lib/webhook-dispatcher"
   ```

3. **Call the appropriate function:**
   ```typescript
   dispatchServerStateChange("Server Name", "online", "node-1").catch((error) => {
     console.error("Failed to dispatch webhook:", error)
   })
   ```

4. **Use custom webhook for unique events:**
   ```typescript
   import { dispatchWebhook } from "@/packages/core/lib/webhook-dispatcher"
   
   await dispatchWebhook("CUSTOM", {
     title: "My Event",
     description: "Something happened",
     color: 3447003,
     fields: [
       { name: "Field", value: "Value", inline: true }
     ]
   }).catch((error) => {
     console.error("Failed to dispatch:", error)
   })
   ```

## Integration Checklist

Currently implemented:
- ✅ Webhook dispatcher service created
- ✅ Settings updates send SYSTEM webhooks
- ✅ Sync completion sends SYSTEM webhooks  
- ✅ Support SUPPORT webhook type
- ✅ Settings panel allows webhook management
- ✅ Webhook testing functionality
- ✅ Type-safe dispatch functions

Additional integration points (ready for implementation):
- ⏳ Server state change webhooks (in `app/api/panel/servers/route.ts`)
- ⏳ Node/resource alert webhooks (in monitoring service)
- ⏳ Error handler webhooks (wrap error handlers)
- ⏳ Support ticket webhooks (when ticket system built)
- ⏳ Billing event webhooks (in payment processing)

## Testing

### Test a Webhook from Admin Panel
1. Go to Admin → Settings → Discord Webhooks
2. Create a test webhook with your Discord webhook URL
3. Click the "Test" button
4. Check your Discord channel for the test message

### Manual Integration Testing
```typescript
import { dispatchSettingsUpdate } from "@/packages/core/lib/webhook-dispatcher"

// Test in your code
await dispatchSettingsUpdate(
  ["Test Field"],
  "test@example.com"
)
```

## Performance Considerations

- **Non-blocking:** Webhooks sent asynchronously with `.catch()` pattern
- **Parallel delivery:** All webhooks for an event sent in parallel
- **Database queries:** Single query to fetch matching webhooks per event
- **Error isolation:** One webhook failure doesn't affect others
- **Request speed:** No impact on API response times

## Security

- **API Key Protection:** Webhook URLs never exposed in logs
- **Scope-based Access:** ADMIN/USER/PUBLIC scopes control visibility
- **Validation:** Discord webhook URL format validated before save
- **Error Handling:** Sensitive errors caught and logged securely
- **Database-driven:** No hardcoded webhooks

## Error Handling

All dispatch functions are async and return results:
```typescript
const result = await dispatchWebhook(...)
console.log(result.success)    // boolean
console.log(result.sent)       // number of successful deliveries
console.log(result.failed)     // number of failed deliveries
console.log(result.errors)     // array of { webhook, error } objects
```

Always use `.catch()` to prevent promise rejections:
```typescript
dispatchWebhook(...).catch((error) => {
  console.error("Webhook dispatch failed:", error)
  // Don't throw - let request complete
})
```

## Files Modified/Created

**Created:**
- `packages/core/lib/webhook-dispatcher.ts` - Dispatcher service (400+ lines)
- `packages/core/lib/WEBHOOK_INTEGRATION_GUIDE.md` - Integration documentation

**Modified:**
- `app/api/admin/settings/route.ts` - Added settings update webhooks
- `packages/core/lib/sync.ts` - Added sync completion webhooks
- `app/admin/settings/page.tsx` - Added SUPPORT type to dropdown

**Database:**
- Migration: `20251223015040_add_discord_webhook_model_with_types_and_scopes` (already applied)
- All enums updated to include SUPPORT type

## Next Steps

To fully activate the webhook system:

1. **Test in admin panel:**
   - Create a Discord webhook URL
   - Add webhook in Settings → Discord Webhooks
   - Click "Test" to verify connectivity

2. **Monitor events:**
   - Change system settings and check webhook
   - Run sync operation and check webhook
   - Create more webhooks for different types

3. **Extend to more events:**
   - Follow the WEBHOOK_INTEGRATION_GUIDE.md
   - Add dispatch calls to event handlers
   - Test each integration

4. **Set up monitoring:**
   - Consider logging webhook delivery status
   - Monitor webhook failure rates
   - Alert on webhook configuration issues

## Contact

For questions or issues with the webhook system, refer to:
- `packages/core/lib/WEBHOOK_INTEGRATION_GUIDE.md` - Detailed integration examples
- `packages/core/lib/webhook-dispatcher.ts` - Source code and inline documentation
- Admin panel - Settings → Discord Webhooks for management
