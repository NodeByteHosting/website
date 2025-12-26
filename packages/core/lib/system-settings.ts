import { getConfig, getPterodactylSettings as getConfigPterodactyl, getVirtfusionSettings as getConfigVirtfusion, getSystemState as getConfigState } from "./config"

export interface SystemState {
  maintenanceMode: boolean
  registrationEnabled: boolean
}

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

/**
 * DEPRECATED: Use config.ts directly instead
 * 
 * This module is kept for backward compatibility.
 * All new code should import from config.ts
 */

export async function getSystemState(): Promise<SystemState> {
  return getConfigState()
}

/**
 * Get panel connection settings from Config store
 */
export async function getPanelSettings(): Promise<PanelSettings> {
  const pterodactyl = await getConfigPterodactyl()
  const virtfusion = await getConfigVirtfusion()

  return {
    pterodactyl,
    virtfusion,
  }
}

/**
 * Get Pterodactyl settings only
 */
export async function getPterodactylSettings(): Promise<PterodactylSettings> {
  return getConfigPterodactyl()
}

/**
 * Get Virtfusion settings only
 */
export async function getVirtfusionSettings(): Promise<VirtfusionSettings> {
  return getConfigVirtfusion()
}

/**
 * Clear the panel settings cache (call after updating settings)
 */
export function clearPanelSettingsCache(): void {
  // Cache clearing is now handled in config.ts
}
