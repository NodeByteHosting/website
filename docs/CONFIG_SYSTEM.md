# Configuration System Documentation

## Overview

The NodeByte configuration system has been completely refactored from a complex encrypted `SystemSettings` table to a simple, flexible **key-value Config store** in the database. This change improves security through database access control, simplifies configuration management, and provides better extensibility.

## Architecture

### Config Model (Prisma)
```prisma
model Config {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   // Stored as JSON string for complex types
  updatedAt DateTime @updatedAt
}
```

### Core Config Functions

Located in `packages/core/lib/config.ts`:

- **`getConfig(key: string)`** - Get a single configuration value with 1-minute TTL caching
- **`setConfig(key: string, value: string)`** - Create or update a configuration value
- **`getConfigs(...keys: string[])`** - Batch retrieve multiple config values
- **`getAllSettings()`** - Get all configuration as flat object (used by admin panel)
- **`getPanelSettings()`** - Get both Pterodactyl and Virtfusion settings in typed object
- **`getPterodactylSettings()`** - Get Pterodactyl-specific settings
- **`getVirtfusionSettings()`** - Get Virtfusion-specific settings
- **`getSystemState()`** - Get parsed boolean flags for maintenance mode, registration enabled
- **`clearConfigCache()`** - Clear in-memory cache (must call after setConfig)

## Configuration Keys

### Panel Settings
Configuration keys for managing game server panels:

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `pterodactyl_url` | string | Pterodactyl panel base URL | `https://panel.example.com` |
| `pterodactyl_api_key` | string (sensitive) | Pterodactyl admin API key | `ptla_xxxxxxxxxxxxx` |
| `pterodactyl_api` | string | Pterodactyl API endpoint path | `/api/application` |
| `virtfusion_url` | string | Virtfusion panel base URL | `https://virtfusion.example.com` |
| `virtfusion_api_key` | string (sensitive) | Virtfusion API key | `vf_xxxxxxxxxxxxx` |
| `virtfusion_api` | string | Virtfusion API endpoint path | `/api/v1` |

### External Service Integrations
Configuration for third-party service connections:

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `github_token` | string (sensitive) | GitHub personal access token | `ghp_xxxxxxxxxxxxx` |
| `github_repositories` | JSON array | Repositories to track for releases | `["Owner/repo1", "Owner/repo2"]` |
| `resend_api_key` | string (sensitive) | Resend email service API key | `re_xxxxxxxxxxxxx` |
| `crowdin_project_id` | string | Crowdin project ID | `123456` |
| `crowdin_personal_token` | string (sensitive) | Crowdin personal API token | `xxxxxxxxxxxxxxxxxxxx` |

### Site Configuration
General website settings:

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `site_name` | string | Website name/title | `NodeByte Hosting` |
| `site_url` | string | Website base URL | `https://nodebyte.host` |
| `favicon_url` | string | URL to favicon image | `https://nodebyte.host/favicon.ico` |
| `admin_email` | string | Primary admin email | `admin@nodebyte.host` |

### Feature Flags
Boolean settings that enable/disable features (stored as "true"/"false" strings):

| Key | Default | Description |
|-----|---------|-------------|
| `registration_enabled` | `"true"` | Allow new user registration |
| `maintenance_mode` | `"false"` | Enable maintenance mode (blocks access) |
| `email_notifications_enabled` | `"true"` | Allow email notifications via Resend |
| `discord_notifications_enabled` | `"false"` | Allow Discord webhook notifications |
| `auto_sync_enabled` | `"true"` | Enable automatic panel sync jobs |

### Advanced Settings
Performance and advanced configuration (not yet fully implemented):

| Key | Default | Description |
|-----|---------|-------------|
| `cache_timeout` | `60` | Config cache TTL in seconds |
| `sync_interval` | `3600` | Panel sync interval in seconds |

### JSON Serialized Settings
Complex settings stored as JSON strings:

| Key | Type | Description |
|-----|------|-------------|
| `discord_webhooks` | JSON array | Array of Discord webhook objects |

## Usage Patterns

### Getting Configuration Values

```typescript
import { getConfig, getConfigs, getPterodactylSettings, getSystemState } from "@/packages/core/lib/config"

// Get single value
const siteName = await getConfig("site_name")

// Get multiple values at once
const config = await getConfigs("site_name", "site_url", "pterodactyl_url")

// Get typed settings
const pterodactyl = await getPterodactylSettings()
const { maintenanceMode, registrationEnabled } = await getSystemState()

// Get all settings (for admin panel)
const allSettings = await getAllSettings()
```

### Setting Configuration Values

```typescript
import { setConfig, clearConfigCache } from "@/packages/core/lib/config"

// Save a configuration value
await setConfig("site_name", "My Hosting Company")
await setConfig("github_token", "ghp_xxxxxxxxxxxxx")
await setConfig("github_repositories", JSON.stringify(["Owner/repo1", "Owner/repo2"]))

// Always clear cache after updates
clearConfigCache()
```

### Boolean Flags

```typescript
const { registrationEnabled, maintenanceMode } = await getSystemState()

// Or manually parse:
const enabled = await getConfig("registration_enabled")
const isEnabled = enabled === "true" // Always compare to string "true"
```

## Security

### Field Masking in API Responses

Sensitive fields are automatically masked in API responses unless the user has SUPER_ADMIN role:

**Sensitive Fields (masked if not SUPER_ADMIN):**
- `pterodactyl_api_key`
- `virtfusion_api_key`
- `crowdin_personal_token`
- `github_token`
- `resend_api_key`

**Masking Example:**
```typescript
// GET /api/admin/settings response
{
  pterodactylUrl: "https://panel.example.com",
  pterodactylApiKey: isSuperAdmin(userRoles) 
    ? "ptla_xxxxxxxxxxxxx"  // Full value for SUPER_ADMIN
    : "••••••••••••••••••••", // Masked for others
}
```

### Access Control

- Only authenticated admins can view configuration
- Only SUPER_ADMIN can modify sensitive settings (POST)
- Only SUPER_ADMIN can reset/clear API keys (PUT)
- Database-level access control secures sensitive data
- No encryption layer (relies on database security)

## Configuration Access Patterns

### Admin Settings Page
Located at: `app/admin/settings/page.tsx`

Fetches configuration via `GET /api/admin/settings` which:
1. Calls `getAllSettings()` to get all config
2. Masks sensitive values based on user role
3. Tests panel connections in real-time
4. Returns status of external service connections

### Setup Wizard
Located at: `app/setup/page.tsx`

Saves configuration via `POST /api/setup` which:
1. Validates at least one panel is configured
2. Tests connections if requested
3. Saves all settings using `setConfig()`
4. Supports optional settings (GitHub, Resend, Crowdin)

### API Routes Using Configuration

| Route | Purpose | Config Keys Used |
|-------|---------|------------------|
| `/api/admin/settings` | Get/update all settings | All config keys |
| `/api/setup` | Initial setup wizard | Panel URLs, API keys, optional services |
| `/api/github/releases` | Fetch GitHub releases | `github_token`, `github_repositories` |
| `/api/auth/forgot-password` | Password reset emails | `site_name`, `site_url` (via email dispatcher) |
| `/api/auth/register` | User registration | `registration_enabled` |
| `/packages/core/dispatchers/email.ts` | Email notifications | `resend_api_key`, `site_name`, `site_url` |
| `/packages/core/dispatchers/notifications.ts` | Email & Discord notifications | `resend_api_key`, `discord_webhooks`, enabled flags |

## Migration from Old System

### Old Table: `SystemSettings`
The old `SystemSettings` Prisma model had complex columns:
- `siteName`, `siteUrl`, `faviconUrl` - Site info
- `pterodactylUrl`, `pterodactylApiKey`, `pterodactylApi` - Pterodactyl
- `virtfusionUrl`, `virtfusionApiKey`, `virtfusionApi` - Virtfusion
- `githubToken`, `githubRepositories` - GitHub integration
- `resendApiKey` - Email service
- `crowdinProjectId`, `crowdinPersonalToken` - Translations
- `registrationEnabled`, `maintenanceMode` - Feature flags
- `emailNotifications`, `discordNotifications` - Notification flags
- `discordWebhooks` (JSON) - Webhook list
- Encrypted fields using `ENCRYPTION_KEY`

### New Table: `Config`
Simple key-value store:
- Single `key` (unique) and `value` (string) columns
- No encryption at application level
- All config values fetched via `getConfig(key)`
- JSON complex types stored as stringified JSON

### Backward Compatibility Layer
File: `packages/core/lib/system-settings.ts`

Provides deprecated functions that delegate to new Config system:
- `getSystemSettings()` → calls `getConfig()` for each key
- `getPterodactylSettings()` → calls config system
- `getVirtfusionSettings()` → calls config system
- `getSystemState()` → calls config system

**Status:** Old functions work but should be replaced in new code.

## Best Practices

### 1. Always Use Type-Specific Getters When Available
```typescript
// ❌ Avoid
const settings = await getConfig("pterodactyl_url")
const apiKey = await getConfig("pterodactyl_api_key")

// ✅ Prefer
const { url, apiKey } = await getPterodactylSettings()
```

### 2. Clear Cache After Updates
```typescript
await setConfig("site_name", "New Name")
clearConfigCache() // Always do this

// Or the config will be stale for 60 seconds
```

### 3. Handle Boolean Flags Properly
```typescript
// ❌ Wrong - these return strings
if (await getConfig("registration_enabled")) { }

// ✅ Correct
const { registrationEnabled } = await getSystemState()
if (registrationEnabled) { }

// ✅ Also correct - explicit string comparison
const value = await getConfig("registration_enabled")
if (value === "true") { }
```

### 4. Store Complex Data as JSON
```typescript
// For arrays or objects
const repos = ["Owner/repo1", "Owner/repo2"]
await setConfig("github_repositories", JSON.stringify(repos))

// When retrieving
const reposJson = await getConfig("github_repositories")
const repos = reposJson ? JSON.parse(reposJson) : []
```

### 5. Batch Retrieve Related Config
```typescript
// ❌ Multiple database queries
const url = await getConfig("pterodactyl_url")
const apiKey = await getConfig("pterodactyl_api_key")
const apiPath = await getConfig("pterodactyl_api")

// ✅ Single batch query
const config = await getConfigs(
  "pterodactyl_url",
  "pterodactyl_api_key",
  "pterodactyl_api"
)
```

## Future Enhancements

Potential improvements not yet implemented:

1. **Configuration Validation** - Add schema validation for config values
2. **Configuration Hooks** - Run callbacks when specific config keys change
3. **Configuration Encryption** - Add optional encryption for sensitive fields
4. **Configuration Audit Log** - Track who changed what and when
5. **Configuration Versioning** - Roll back to previous config states
6. **Dynamic Feature Flags** - Change features without restart
7. **Configuration Secrets** - Separate secret storage service integration

## Troubleshooting

### Config Not Updating in Admin Panel
Check if you called `clearConfigCache()` after `setConfig()`. The 1-minute cache will serve stale values otherwise.

### API Keys Showing as Masked
Verify your user account has the `SUPER_ADMIN` role. Only super admins can see unmasked sensitive values.

### GitHub Releases Not Showing
1. Verify `github_token` is set via admin settings
2. Verify `github_repositories` contains valid repository names
3. Check that the token has permission to read public repositories
4. Look for error logs in API response

### Emails Not Sending
1. Verify `resend_api_key` is set via admin settings
2. Check that `email_notifications_enabled` is "true"
3. Verify the Resend API key is valid
4. Check application logs for Resend API errors

### Setup Wizard Stuck
1. At least one panel (Pterodactyl OR Virtfusion) must be configured
2. Panel URL and API key must be provided
3. Test connection button can verify credentials before saving
4. Check browser console for any fetch errors
