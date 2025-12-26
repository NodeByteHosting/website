/**
 * Egg Properties Helper
 * 
 * Manages egg metadata/properties that can vary between panels
 * (Pterodactyl, Virtfusion, or future panels)
 */

import { prisma } from "../../core/lib/prisma"

export interface EggMetadata {
  description?: string
  author?: string
  dockerImage?: string
  dockerImages?: Record<string, string>
  startup?: string
  scriptPrivileged?: boolean
  scriptInstall?: string
  scriptEntry?: string
  scriptContainer?: string
  scriptExtends?: string | null
  // Panel-specific identifiers
  panelId?: string | number
  nestId?: number
}

/**
 * Set an egg property/metadata
 */
export async function setEggProperty(
  eggId: string | number,
  key: string,
  value: string
): Promise<void> {
  const numericEggId = typeof eggId === "string" ? Number(eggId) : eggId

  const existing = await prisma.eggProperty.findFirst({
    where: { eggId: numericEggId as number, key, panelType: null },
  })

  if (existing) {
    await prisma.eggProperty.update({ where: { id: existing.id }, data: { value } })
  } else {
    await prisma.eggProperty.create({ data: { eggId: numericEggId as number, key, value, panelType: null } })
  }
}

/**
 * Get an egg property by key
 */
export async function getEggProperty(
  eggId: string | number,
  key: string
): Promise<string | null> {
  const numericEggId = typeof eggId === "string" ? Number(eggId) : eggId
  const prop = await prisma.eggProperty.findFirst({ where: { eggId: numericEggId as number, key, panelType: null } })
  return prop?.value || null
}

/**
 * Get all properties for an egg
 */
export async function getEggProperties(eggId: string): Promise<Record<string, string>> {
  const numericEggId = typeof eggId === "string" ? Number(eggId) : eggId
  const props = await prisma.eggProperty.findMany({ where: { eggId: numericEggId as number } })

  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop.key] = prop.value
  }
  return result
}

/**
 * Set multiple egg properties at once
 */
export async function setEggProperties(
  eggId: string,
  metadata: EggMetadata
): Promise<void> {
  const updates: Array<{ key: string; value: string }> = []

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updates.push({
        key,
        value: typeof value === "string" ? value : JSON.stringify(value),
      })
    }
  })

  // Batch upsert all properties
  for (const update of updates) {
    await setEggProperty(eggId, update.key, update.value)
  }
}

/**
 * Delete an egg property
 */
export async function deleteEggProperty(
  eggId: string | number,
  key: string
): Promise<void> {
  const numericEggId = typeof eggId === "string" ? Number(eggId) : eggId
  await prisma.eggProperty.deleteMany({ where: { eggId: numericEggId as number, key } }).catch(() => {})
}

/**
 * Delete all properties for an egg
 */
export async function deleteEggProperties(eggId: string): Promise<void> {
  await prisma.eggProperty.deleteMany({
    where: { eggId },
  })
}

/**
 * Parse egg metadata from properties
 */
export async function parseEggMetadata(eggId: string): Promise<EggMetadata> {
  const props = await getEggProperties(eggId)
  const metadata: EggMetadata = {}

  // String properties
  if (props.description) metadata.description = props.description
  if (props.author) metadata.author = props.author
  if (props.dockerImage) metadata.dockerImage = props.dockerImage
  if (props.dockerImages) metadata.dockerImages = JSON.parse(props.dockerImages)
  if (props.startup) metadata.startup = props.startup
  if (props.scriptInstall) metadata.scriptInstall = props.scriptInstall
  if (props.scriptEntry) metadata.scriptEntry = props.scriptEntry
  if (props.scriptContainer) metadata.scriptContainer = props.scriptContainer
  if (props.scriptExtends) metadata.scriptExtends = props.scriptExtends

  // Boolean properties
  if (props.scriptPrivileged !== undefined) metadata.scriptPrivileged = props.scriptPrivileged === "true"

  // Numeric properties
  if (props.nestId) metadata.nestId = parseInt(props.nestId, 10)
  if (props.panelId) metadata.panelId = props.panelId

  return metadata
}
