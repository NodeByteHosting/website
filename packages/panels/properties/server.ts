/**
 * Server Properties Helper
 * 
 * Manages server metadata/properties that can vary between panels
 * (Pterodactyl, Virtfusion, or future panels)
 */

import { prisma } from "../../core/lib/prisma"

export interface ServerMetadata {
  status?: string | null
  suspended?: boolean
  memory?: number
  disk?: number
  cpu?: number
  swap?: number
  io?: number
  threads?: string | null
  oomDisabled?: boolean
  databaseLimit?: number
  allocationLimit?: number
  backupLimit?: number
  dockerImage?: string
  startupCommand?: string
  // Panel-specific identifiers
  panelId?: string | number
  externalId?: string | null
}

/**
 * Set a server property/metadata
 */
export async function setServerProperty(
  serverId: string,
  key: string,
  value: string
): Promise<void> {
  await prisma.serverProperty.upsert({
    where: {
      serverId_key: {
        serverId,
        key,
      },
    },
    update: { value },
    create: {
      serverId,
      key,
      value,
    },
  })
}

/**
 * Get a server property by key
 */
export async function getServerProperty(
  serverId: string,
  key: string
): Promise<string | null> {
  const prop = await prisma.serverProperty.findUnique({
    where: {
      serverId_key: {
        serverId,
        key,
      },
    },
  })
  return prop?.value || null
}

/**
 * Get all properties for a server
 */
export async function getServerProperties(serverId: string): Promise<Record<string, string>> {
  const props = await prisma.serverProperty.findMany({
    where: { serverId },
  })

  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop.key] = prop.value
  }
  return result
}

/**
 * Set multiple server properties at once
 */
export async function setServerProperties(
  serverId: string,
  metadata: ServerMetadata
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
    await setServerProperty(serverId, update.key, update.value)
  }
}

/**
 * Delete a server property
 */
export async function deleteServerProperty(
  serverId: string,
  key: string
): Promise<void> {
  await prisma.serverProperty.delete({
    where: {
      serverId_key: {
        serverId,
        key,
      },
    },
  }).catch(() => {
    // Ignore if doesn't exist
  })
}

/**
 * Delete all properties for a server
 */
export async function deleteServerProperties(serverId: string): Promise<void> {
  await prisma.serverProperty.deleteMany({
    where: { serverId },
  })
}

/**
 * Parse server metadata from properties
 */
export async function parseServerMetadata(serverId: string): Promise<ServerMetadata> {
  const props = await getServerProperties(serverId)
  const metadata: ServerMetadata = {}

  // Parse numeric properties
  if (props.memory) metadata.memory = parseInt(props.memory, 10)
  if (props.disk) metadata.disk = parseInt(props.disk, 10)
  if (props.cpu) metadata.cpu = parseInt(props.cpu, 10)
  if (props.swap) metadata.swap = parseInt(props.swap, 10)
  if (props.io) metadata.io = parseInt(props.io, 10)
  if (props.databaseLimit) metadata.databaseLimit = parseInt(props.databaseLimit, 10)
  if (props.allocationLimit) metadata.allocationLimit = parseInt(props.allocationLimit, 10)
  if (props.backupLimit) metadata.backupLimit = parseInt(props.backupLimit, 10)

  // Parse boolean properties
  if (props.suspended !== undefined) metadata.suspended = props.suspended === "true"
  if (props.oomDisabled !== undefined) metadata.oomDisabled = props.oomDisabled === "true"

  // String properties
  if (props.status) metadata.status = props.status
  if (props.threads) metadata.threads = props.threads
  if (props.dockerImage) metadata.dockerImage = props.dockerImage
  if (props.startupCommand) metadata.startupCommand = props.startupCommand
  if (props.panelId) metadata.panelId = props.panelId
  if (props.externalId) metadata.externalId = props.externalId

  return metadata
}
