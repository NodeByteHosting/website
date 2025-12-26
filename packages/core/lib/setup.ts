/**
 * Setup Initialization Service
 * 
 * Handles setup detection and initialization on app startup.
 * Checks if the system has been configured and provides setup status.
 */

import { getConfig, getPterodactylSettings, getVirtfusionSettings } from "./config"

export interface SetupStatusDetails {
  isComplete: boolean
  components: {
    siteInfo: boolean
    pterodactylConfig: boolean
    virtfusionConfig: boolean
  }
  configured: {
    siteName?: string
    siteUrl?: string
    faviconUrl?: string | null
    pterodactylUrl?: string | null
    virtfusionUrl?: string | null
  }
}

/**
 * Check if setup is complete
 * At least one panel (Pterodactyl or Virtfusion) must be configured
 */
export async function isSetupComplete(): Promise<boolean> {
  try {
    const pteroSettings = await getPterodactylSettings()
    const virtfusionSettings = await getVirtfusionSettings()
    
    // At least one panel must be configured
    const hasPterodactyl = pteroSettings.url && pteroSettings.apiKey
    const hasVirtfusion = virtfusionSettings.url && virtfusionSettings.apiKey
    
    return hasPterodactyl || hasVirtfusion
  } catch (error) {
    console.error("[Setup] Failed to check setup status:", error)
    return false
  }
}

/**
 * Check if minimum setup is done (at least one panel configured)
 */
export async function hasMinimumSetup(): Promise<boolean> {
  return isSetupComplete()
}

/**
 * Get current setup status details including what's configured
 */
export async function getSetupStatus(): Promise<SetupStatusDetails> {
  try {
    const config = await getConfig('pterodactyl_url')
    const pteroSettings = await getPterodactylSettings()
    const virtfusionSettings = await getVirtfusionSettings()

    const hasSiteInfo = !!(await getConfig('site_name'))
    const hasPterodactyl = !!(pteroSettings.url && pteroSettings.apiKey)
    const hasVirtfusion = !!(virtfusionSettings.url && virtfusionSettings.apiKey)

    return {
      isComplete: hasPterodactyl || hasVirtfusion,
      components: {
        siteInfo: hasSiteInfo,
        pterodactylConfig: hasPterodactyl,
        virtfusionConfig: hasVirtfusion,
      },
      configured: {
        siteName: await getConfig('site_name') || undefined,
        siteUrl: await getConfig('site_url') || undefined,
        faviconUrl: await getConfig('favicon_url') || undefined,
        pterodactylUrl: pteroSettings.url || undefined,
        virtfusionUrl: virtfusionSettings.url || undefined,
      },
    }
  } catch (error) {
    console.error("[Setup] Failed to get setup status:", error)
    return {
      isComplete: false,
      components: {
        siteInfo: false,
        pterodactylConfig: false,
        virtfusionConfig: false,
      },
      configured: {},
    }
  }
}
