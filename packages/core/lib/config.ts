/**
 * Configuration Management
 * Simple key-value store for all system settings
 * 
 * Configuration Keys - Panel Settings:
 *   - pterodactyl_url: Pterodactyl panel URL
 *   - pterodactyl_api_key: Pterodactyl admin API key
 *   - pterodactyl_api: Pterodactyl API endpoint path (default: /api/application)
 *   - virtfusion_url: Virtfusion panel URL
 *   - virtfusion_api_key: Virtfusion API key
 *   - virtfusion_api: Virtfusion API endpoint path (default: /api/v1)
 * 
 * Configuration Keys - External Services:
 *   - github_token: GitHub API personal access token for fetching releases
 *   - github_repositories: JSON array of repositories to track (e.g., ["Owner/repo1", "Owner/repo2"])
 *   - resend_api_key: Resend email service API key for transactional emails
 *   - crowdin_project_id: Crowdin project ID for translations management
 *   - crowdin_personal_token: Crowdin personal API access token for translations sync
 * 
 * Configuration Keys - Site Configuration:
 *   - site_name: Website name/title (displayed in headers, emails, etc.)
 *   - site_url: Website base URL (used for links, OAuth redirects, email templates)
 *   - favicon_url: URL to favicon image for the website
 *   - admin_email: Primary admin contact email (optional, for admin notifications)
 * 
 * Configuration Keys - Feature Flags:
 *   - registration_enabled: Allow new user registration (default: "true", stored as string)
 *   - maintenance_mode: Enable maintenance mode (default: "false", stored as string)
 *   - email_notifications_enabled: Allow email notifications (default: "true")
 *   - discord_notifications_enabled: Allow Discord webhook notifications (default: "false")
 *   - auto_sync_enabled: Enable automatic panel sync jobs (default: "true")
 * 
 * Configuration Keys - Advanced (not yet fully implemented):
 *   - cache_timeout: Config cache TTL in seconds (default: 60)
 *   - sync_interval: Panel sync interval in seconds (default: 3600)
 * 
 * Configuration Keys - Discord Webhooks (JSON stored):
 *   - discord_webhooks: JSON string of configured webhook endpoints for admin notifications
 * 
 * USAGE NOTES:
 * - Boolean values are stored as "true"/"false" strings, not actual booleans
 * - Use getSystemState() to get parsed boolean flags instead of raw values
 * - API keys and tokens are stored in plain text with database access control
 * - Sensitive fields are masked in admin responses unless user is SUPER_ADMIN
 * - Always call clearConfigCache() after setConfig() to invalidate cached values
 * - Use getConfigs() for batch retrieval to reduce database queries
 */

import { prisma } from "./prisma"

export interface PterodactylSettings {
  url: string | null
  apiKey: string | null
  api: string | null
}

export interface VirtfusionSettings {
  url: string | null
  apiKey: string | null
  api: string | null
}

export interface PanelSettings {
  pterodactyl: PterodactylSettings
  virtfusion: VirtfusionSettings
}

// Cache for config values with per-key timestamp tracking
interface CacheEntry {
  value: string
  timestamp: number
}

let configCache: Map<string, CacheEntry> = new Map()
const DEFAULT_CACHE_TTL_MS = 60000 // 1 minute

function getCacheTTLMs(): number {
  const entry = configCache.get("cache_timeout")
  if (entry && entry.value) {
    const secs = parseInt(entry.value, 10)
    if (!isNaN(secs) && secs > 0) return secs * 1000
  }
  return DEFAULT_CACHE_TTL_MS
}

/**
 * Get a config value by key
 */
export async function getConfig(key: string): Promise<string | null> {
  // Check cache first
  const cached = configCache.get(key)
  const ttl = getCacheTTLMs()
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value || null
  }

  try {
    const config = await prisma.config.findUnique({
      where: { key },
      select: { value: true },
    })

    const value = config?.value || null
    configCache.set(key, {
      value: value || "",
      timestamp: Date.now(),
    })
    return value
  } catch (error) {
    console.error(`[Config] Failed to get ${key}:`, error)
    return null
  }
}

/**
 * Set a config value
 */
export async function setConfig(key: string, value: string): Promise<void> {
  try {
    await prisma.config.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
    // Clear cache
    configCache.delete(key)
  } catch (error) {
    console.error(`[Config] Failed to set ${key}:`, error)
    throw error
  }
}

/**
 * Get multiple config values at once
 */
export async function getConfigs(...keys: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {}

  for (const key of keys) {
    result[key] = await getConfig(key)
  }

  return result
}

/**
 * Get all configuration settings as a flat object
 * Useful for getting everything at once for the admin panel
 */
export async function getAllSettings(): Promise<Record<string, string | null>> {
  try {
    const allConfigs = await prisma.config.findMany({
      select: {
        key: true,
        value: true,
      },
    })

    const result: Record<string, string | null> = {}
    for (const config of allConfigs) {
      result[config.key] = config.value
    }

    return result
  } catch (error) {
    console.error("[Config] Failed to get all settings:", error)
    return {}
  }
}

/**
 * Get panel connection settings
 */
export async function getPanelSettings(): Promise<PanelSettings> {
  const config = await getConfigs(
    "pterodactyl_url",
    "pterodactyl_api_key",
    "pterodactyl_api",
    "virtfusion_url",
    "virtfusion_api_key",
    "virtfusion_api"
  )

  return {
    pterodactyl: {
      url: config.pterodactyl_url,
      apiKey: config.pterodactyl_api_key,
      api: config.pterodactyl_api,
    },
    virtfusion: {
      url: config.virtfusion_url,
      apiKey: config.virtfusion_api_key,
      api: config.virtfusion_api,
    },
  }
}

/**
 * Get Pterodactyl settings only
 */
export async function getPterodactylSettings(): Promise<PterodactylSettings> {
  const settings = await getPanelSettings()
  return settings.pterodactyl
}

/**
 * Get Virtfusion settings only
 */
export async function getVirtfusionSettings(): Promise<VirtfusionSettings> {
  const settings = await getPanelSettings()
  return settings.virtfusion
}

/**
 * Clear config cache (call after updating settings)
 */
export function clearConfigCache(): void {
  configCache.clear()
}

/**
 * Get system state (maintenance mode, registration enabled, etc.)
 */
export async function getSystemState(): Promise<{
  maintenanceMode: boolean
  registrationEnabled: boolean
}> {
  const config = await getConfigs("maintenance_mode", "registration_enabled")

  return {
    maintenanceMode: config.maintenance_mode === "true",
    registrationEnabled: config.registration_enabled !== "false", // default true
  }
}
