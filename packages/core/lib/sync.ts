/**
 * Pterodactyl Sync Service
 * 
 * This service handles synchronizing data from the Pterodactyl panel
 * to our local database. This allows us to:
 * 1. Cache data locally for faster access
 * 2. Build custom features without hitting the panel API constantly
 * 3. Prepare for potential migration away from Pterodactyl
 */

import { prisma } from "./prisma"
import type { SyncStatus } from "../../../prisma/generated/prisma"
import { dispatchSyncCompletion } from "../dispatchers/webhooks"
import { getPterodactylSettings } from "./config"
import { setServerProperties } from "../../panels/properties/server"
import { setEggProperties } from "../../panels/properties/egg"

// Configurable batch size for allocation syncing (can be overridden via env)
const ALLOCATION_BATCH_SIZE = Number(process.env.SYNC_ALLOCATION_BATCH_SIZE) || 100

interface PterodactylPagination {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
}

interface PterodactylResponse<T> {
  object: "list"
  data: T[]
  meta: {
    pagination: PterodactylPagination
  }
}

interface PterodactylSingleResponse<T> {
  object: string
  attributes: T
}

// Get panel credentials
async function getPanelCredentials(): Promise<{ panelUrl: string; apiKey: string } | null> {
  const settings = await getPterodactylSettings()

  if (settings.url && settings.apiKey) {
    return {
      panelUrl: settings.url,
      apiKey: settings.apiKey,
    }
  }

  console.error("[Sync] Pterodactyl panel not configured")
  return null
}

// ============================================================================
// API HELPERS
// ============================================================================

async function fetchFromPanel<T>(
  endpoint: string,
  options: { include?: string[] } = {}
): Promise<T | null> {
  const credentials = await getPanelCredentials()
  if (!credentials) {
    console.error("[Sync] Missing panel credentials")
    return null
  }

  const { panelUrl, apiKey } = credentials
  const url = new URL(`${panelUrl}/api/application${endpoint}`)
  if (options.include?.length) {
    url.searchParams.set("include", options.include.join(","))
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "NodeByte-Sync/1.0",
      },
    })

    if (!response.ok) {
      console.error(`[Sync] API error: ${response.status} ${response.statusText}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[Sync] Fetch error:", error)
    return null
  }
}

// Check whether cancellation has been requested for a given sync log
async function isCancellationRequested(logId: string): Promise<boolean> {
  try {
    const log = await prisma.syncLog.findUnique({ where: { id: logId } })
    const meta: any = (log as any)?.metadata || {}
    return !!meta.cancelRequested
  } catch (e) {
    return false
  }
}

async function fetchAllPages<T>(
  endpoint: string,
  options: { include?: string[] } = {}
): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${page}`
    const response = await fetchFromPanel<PterodactylResponse<{ attributes: T }>>(url, options)

    if (!response) {
      break
    }

    items.push(...response.data.map((item) => item.attributes))

    hasMore = page < response.meta.pagination.total_pages
    page++
  }

  return items
}

// ============================================================================
// SYNC LOG HELPERS
// ============================================================================

async function createSyncLog(type: string) {
  return prisma.syncLog.create({
    data: {
      type,
      status: "RUNNING",
      startedAt: new Date(),
    },
  })
}

async function updateSyncLog(
  id: string,
  data: {
    status?: SyncStatus
    itemsTotal?: number
    itemsSynced?: number
    itemsFailed?: number
    error?: string
    completedAt?: Date
  }
) {
  return prisma.syncLog.update({
    where: { id },
    data,
  })
}

// ============================================================================
// LOCATION SYNC
// ============================================================================

interface PteroLocation {
  id: number
  short: string
  long: string
  created_at: string
  updated_at: string
}

export async function syncLocations(): Promise<{ success: boolean; synced: number; error?: string }> {
  const log = await createSyncLog("locations")
  
  try {
    const locations = await fetchAllPages<PteroLocation>("/locations")
    
    await updateSyncLog(log.id, { itemsTotal: locations.length })

    let synced = 0
    for (const location of locations) {
      try {
        await prisma.location.upsert({
          where: { id: location.id },
          update: {
            shortCode: location.short,
            description: location.long,
            updatedAt: new Date(),
          },
          create: {
            id: location.id,
            shortCode: location.short,
            description: location.long,
          },
        })
        synced++
        if (synced % 5 === 0) {
          await updateSyncLog(log.id, {
            itemsSynced: synced,
            itemsFailed: locations.length - synced,
            metadata: { lastMessage: `Synced ${synced} locations` },
          })

          if (await isCancellationRequested(log.id)) {
            await updateSyncLog(log.id, {
              status: "FAILED",
              error: "Cancelled by user",
              completedAt: new Date(),
              metadata: { cancelled: true },
            })
            return { success: false, synced: synced, error: "Cancelled by user" }
          }
        }
      } catch (error) {
        console.error(`[Sync] Failed to sync location ${location.id}:`, error)
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsSynced: synced,
      itemsFailed: locations.length - synced,
      completedAt: new Date(),
    })

    return { success: true, synced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, synced: 0, error: errorMsg }
  }
}

// ============================================================================
// NODE SYNC
// ============================================================================

interface PteroNode {
  id: number
  uuid: string
  name: string
  description: string | null
  location_id: number
  fqdn: string
  scheme: string
  behind_proxy: boolean
  maintenance_mode: boolean
  memory: number
  memory_overallocate: number
  disk: number
  disk_overallocate: number
  upload_size: number
  daemon_listen: number
  daemon_sftp: number
  daemon_base: string
  created_at: string
  updated_at: string
}

interface PteroAllocation {
  id: number
  ip: string
  alias: string | null
  port: number
  notes: string | null
  assigned: boolean
}

export async function syncNodes(): Promise<{ success: boolean; synced: number; error?: string }> {
  const log = await createSyncLog("nodes")
  
  try {
    const nodes = await fetchAllPages<PteroNode>("/nodes")
    
    await updateSyncLog(log.id, { itemsTotal: nodes.length })

    let synced = 0
    for (const node of nodes) {
      try {
        await prisma.node.upsert({
          where: { id: node.id },
          update: {
            uuid: node.uuid,
            name: node.name,
            description: node.description,
            fqdn: node.fqdn,
            scheme: node.scheme,
            behindProxy: node.behind_proxy,
            memory: BigInt(node.memory),
            memoryOverallocate: node.memory_overallocate,
            disk: BigInt(node.disk),
            diskOverallocate: node.disk_overallocate,
            isMaintenanceMode: node.maintenance_mode,
            daemonListenPort: node.daemon_listen,
            daemonSftpPort: node.daemon_sftp,
            daemonBase: node.daemon_base,
            locationId: node.location_id,
            updatedAt: new Date(),
          },
          create: {
            id: node.id,
            uuid: node.uuid,
            name: node.name,
            description: node.description,
            fqdn: node.fqdn,
            scheme: node.scheme,
            behindProxy: node.behind_proxy,
            memory: BigInt(node.memory),
            memoryOverallocate: node.memory_overallocate,
            disk: BigInt(node.disk),
            diskOverallocate: node.disk_overallocate,
            isMaintenanceMode: node.maintenance_mode,
            daemonListenPort: node.daemon_listen,
            daemonSftpPort: node.daemon_sftp,
            daemonBase: node.daemon_base,
            locationId: node.location_id,
          },
        })
        synced++
        if (synced % 5 === 0) {
          await updateSyncLog(log.id, {
            itemsSynced: synced,
            itemsFailed: nodes.length - synced,
            metadata: { lastMessage: `Synced ${synced} nodes` },
          })

          if (await isCancellationRequested(log.id)) {
            await updateSyncLog(log.id, {
              status: "FAILED",
              error: "Cancelled by user",
              completedAt: new Date(),
              metadata: { cancelled: true },
            })
            return { success: false, synced: synced, error: "Cancelled by user" }
          }
        }
      } catch (error) {
        console.error(`[Sync] Failed to sync node ${node.id}:`, error)
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsSynced: synced,
      itemsFailed: nodes.length - synced,
      completedAt: new Date(),
    })

    return { success: true, synced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, synced: 0, error: errorMsg }
  }
}

// ============================================================================
// ALLOCATION SYNC
// ============================================================================

export async function syncAllocations(): Promise<{ success: boolean; synced: number; error?: string }> {
  const log = await createSyncLog("allocations")
  
  try {
    // Get all nodes first
    const nodes = await prisma.node.findMany({ select: { id: true } })
    
    let totalSynced = 0
    let totalAllocations = 0

    for (const node of nodes) {
      // Fetch allocations for each node
      let page = 1
      let hasMore = true

      while (hasMore) {
        const response = await fetchFromPanel<PterodactylResponse<{ attributes: PteroAllocation }>>(
          `/nodes/${node.id}/allocations?page=${page}`
        )

        if (!response) {
          hasMore = false
          continue
        }

        totalAllocations += response.data.length


        // Process allocations in configurable batches to avoid long blocking loops
        const batchSize = ALLOCATION_BATCH_SIZE
        for (let i = 0; i < response.data.length; i += batchSize) {
          const batch = response.data.slice(i, i + batchSize)

          for (const allocData of batch) {
            const alloc = allocData.attributes
            try {
              await prisma.allocation.upsert({
                where: { id: alloc.id },
                update: {
                  ip: alloc.ip,
                  port: alloc.port,
                  alias: alloc.alias,
                  notes: alloc.notes,
                  isAssigned: alloc.assigned,
                  nodeId: node.id,
                  updatedAt: new Date(),
                },
                create: {
                  id: alloc.id,
                  ip: alloc.ip,
                  port: alloc.port,
                  alias: alloc.alias,
                  notes: alloc.notes,
                  isAssigned: alloc.assigned,
                  nodeId: node.id,
                },
              })
              totalSynced++
            } catch (error) {
              console.error(`[Sync] Failed to sync allocation ${alloc.id}:`, error)
            }
          }

          // Update progress after each batch
          await updateSyncLog(log.id, {
            itemsTotal: totalAllocations,
            itemsSynced: totalSynced,
            itemsFailed: totalAllocations - totalSynced,
            metadata: { lastMessage: `Node ${node.id} - processed page ${page} batch ${Math.floor(i / batchSize) + 1}` },
          })

          // Check for cancellation
          if (await isCancellationRequested(log.id)) {
            await updateSyncLog(log.id, {
              status: "FAILED",
              error: "Cancelled by user",
              completedAt: new Date(),
              metadata: { cancelled: true },
            })
            return { success: false, synced: totalSynced, error: "Cancelled by user" }
          }
        }

        hasMore = page < response.meta.pagination.total_pages
        page++
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsTotal: totalAllocations,
      itemsSynced: totalSynced,
      itemsFailed: totalAllocations - totalSynced,
      completedAt: new Date(),
    })

    return { success: true, synced: totalSynced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, synced: 0, error: errorMsg }
  }
}

// ============================================================================
// NEST & EGG SYNC
// ============================================================================

interface PteroNest {
  id: number
  uuid: string
  name: string
  description: string | null
  author: string
  created_at: string
  updated_at: string
}

interface PteroEgg {
  id: number
  uuid: string
  name: string
  description: string | null
  author: string
  nest: number
  docker_image: string
  docker_images: Record<string, string>
  startup: string
  script: {
    privileged: boolean
    install: string
    entry: string
    container: string
    extends: string | null
  }
  created_at: string
  updated_at: string
}

interface PteroEggVariable {
  id: number
  egg_id: number
  name: string
  description: string
  env_variable: string
  default_value: string
  user_viewable: boolean
  user_editable: boolean
  rules: string
  created_at: string
  updated_at: string
}

export async function syncNestsAndEggs(): Promise<{ success: boolean; nests: number; eggs: number; variables: number; error?: string }> {
  const log = await createSyncLog("nests_eggs")
  
  try {
    // Sync nests first
    const nests = await fetchAllPages<PteroNest>("/nests")
    
    let nestsSynced = 0
    for (const nest of nests) {
      try {
        await prisma.nest.upsert({
          where: { id: nest.id },
          update: {
            uuid: nest.uuid,
            name: nest.name,
            description: nest.description,
            author: nest.author,
            updatedAt: new Date(),
          },
          create: {
            id: nest.id,
            uuid: nest.uuid,
            name: nest.name,
            description: nest.description,
            author: nest.author,
          },
        })
        nestsSynced++
        if (nestsSynced % 5 === 0) {
          await updateSyncLog(log.id, {
            itemsSynced: nestsSynced,
            metadata: { lastMessage: `Synced ${nestsSynced} nests` },
          })
        }
      } catch (error) {
        console.error(`[Sync] Failed to sync nest ${nest.id}:`, error)
      }
    }

    // Sync eggs for each nest
    let eggsSynced = 0
    let variablesSynced = 0
    
    for (const nest of nests) {
      const eggsResponse = await fetchFromPanel<PterodactylResponse<{ attributes: PteroEgg & { relationships?: { variables?: { data: { attributes: PteroEggVariable }[] } } } }>>(
        `/nests/${nest.id}/eggs`,
        { include: ["variables"] }
      )
      
      if (!eggsResponse) continue

      for (const eggData of eggsResponse.data) {
        const egg = eggData.attributes
        try {
          const eggRecord = await prisma.egg.upsert({
            where: { id: egg.id },
            update: {
              uuid: egg.uuid,
              name: egg.name,
              nestId: nest.id,
              updatedAt: new Date(),
            },
            create: {
              id: egg.id,
              uuid: egg.uuid,
              name: egg.name,
              nestId: nest.id,
            },
          })

          // Save all egg metadata as properties
          await setEggProperties(eggRecord.id, {
            description: egg.description,
            author: egg.author,
            dockerImage: egg.docker_image,
            dockerImages: egg.docker_images,
            startup: egg.startup,
            scriptPrivileged: egg.script?.privileged ?? false,
            scriptInstall: egg.script?.install,
            scriptEntry: egg.script?.entry,
            scriptContainer: egg.script?.container,
            scriptExtends: egg.script?.extends || null,
            panelId: egg.id.toString(),
            nestId: nest.id,
          })

          eggsSynced++
          
          // Sync egg variables if included
          const variables = egg.relationships?.variables?.data || []
          for (const varData of variables) {
            const variable = varData.attributes
            try {
              await prisma.eggVariable.upsert({
                where: { id: variable.id },
                update: {
                  name: variable.name,
                  description: variable.description || null,
                  envVariable: variable.env_variable,
                  defaultValue: variable.default_value || null,
                  userViewable: variable.user_viewable,
                  userEditable: variable.user_editable,
                  rules: variable.rules || null,
                  eggId: egg.id,
                  updatedAt: new Date(),
                },
                create: {
                  id: variable.id,
                  name: variable.name,
                  description: variable.description || null,
                  envVariable: variable.env_variable,
                  defaultValue: variable.default_value || null,
                  userViewable: variable.user_viewable,
                  userEditable: variable.user_editable,
                  rules: variable.rules || null,
                  eggId: egg.id,
                },
              })
              variablesSynced++
            } catch (error) {
              console.error(`[Sync] Failed to sync egg variable ${variable.id}:`, error)
            }
          }
          // Update progress periodically for eggs/variables
          if ((eggsSynced + variablesSynced) % 10 === 0) {
            await updateSyncLog(log.id, {
              itemsSynced: nestsSynced + eggsSynced + variablesSynced,
              metadata: { lastMessage: `Synced ${eggsSynced} eggs and ${variablesSynced} variables so far` },
            })

            if (await isCancellationRequested(log.id)) {
              await updateSyncLog(log.id, {
                status: "FAILED",
                error: "Cancelled by user",
                completedAt: new Date(),
                metadata: { cancelled: true },
              })
              return { success: false, nests: nestsSynced, eggs: eggsSynced, variables: variablesSynced, error: "Cancelled by user" }
            }
          }
        } catch (error) {
          console.error(`[Sync] Failed to sync egg ${egg.id}:`, error)
        }
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsSynced: nestsSynced + eggsSynced + variablesSynced,
      metadata: { nests: nestsSynced, eggs: eggsSynced, variables: variablesSynced },
      completedAt: new Date(),
    })

    return { success: true, nests: nestsSynced, eggs: eggsSynced, variables: variablesSynced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, nests: 0, eggs: 0, variables: 0, error: errorMsg }
  }
}

// ============================================================================
// SERVER SYNC
// ============================================================================

interface PteroServer {
  id: number
  uuid: string
  identifier: string
  external_id: string | null
  name: string
  description: string
  status: string | null
  suspended: boolean
  limits: {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
    threads: string | null
    oom_disabled: boolean
  }
  feature_limits: {
    databases: number
    allocations: number
    backups: number
  }
  user: number
  node: number
  egg: number
  container: {
    startup_command: string
    image: string
    installed: number
    environment: Record<string, string>
  }
  created_at: string
  updated_at: string
}

export async function syncServers(): Promise<{ success: boolean; synced: number; error?: string }> {
  const log = await createSyncLog("servers")
  
  try {
    const servers = await fetchAllPages<PteroServer>("/servers", {
      include: ["allocations"],
    })
    
    await updateSyncLog(log.id, { itemsTotal: servers.length })

    let synced = 0
    for (const server of servers) {
      try {
        // Find the local user by pterodactylId
        const user = await prisma.user.findFirst({
          where: { pterodactylId: server.user },
        })

        if (!user) {
          console.warn(`[Sync] No local user found for Pterodactyl user ${server.user}, skipping server ${server.name}`)
          continue
        }

        // Map Pterodactyl status to our enum
        const statusMap: Record<string, "INSTALLING" | "INSTALL_FAILED" | "SUSPENDED" | "RESTORING_BACKUP" | "RUNNING" | "OFFLINE" | "STARTING" | "STOPPING"> = {
          installing: "INSTALLING",
          install_failed: "INSTALL_FAILED",
          suspended: "SUSPENDED",
          restoring_backup: "RESTORING_BACKUP",
        }
        const status = server.suspended 
          ? "SUSPENDED" 
          : statusMap[server.status || ""] || "OFFLINE"

        // Upsert server record (minimal columns)
        const serverRecord = await prisma.server.upsert({
          where: { pterodactylId: server.id },
          update: {
            uuid: server.uuid,
            uuidShort: server.identifier,
            name: server.name,
            description: server.description,
            status,
            isSuspended: server.suspended,
            ownerId: user.id,
            nodeId: server.node,
            eggId: server.egg,
            lastSyncedAt: new Date(),
            updatedAt: new Date(),
          },
          create: {
            pterodactylId: server.id,
            uuid: server.uuid,
            uuidShort: server.identifier,
            name: server.name,
            description: server.description,
            status,
            isSuspended: server.suspended,
            ownerId: user.id,
            nodeId: server.node,
            eggId: server.egg,
            installedAt: server.container.installed === 1 ? new Date() : null,
          },
        })

        // Save all server specifications as properties
        await setServerProperties(serverRecord.id, {
          panelId: server.id.toString(),
          externalId: server.external_id,
          status,
          suspended: server.suspended,
          memory: server.limits.memory,
          swap: server.limits.swap,
          disk: server.limits.disk,
          io: server.limits.io,
          cpu: server.limits.cpu,
          threads: server.limits.threads,
          oomDisabled: server.limits.oom_disabled,
          databaseLimit: server.feature_limits.databases,
          allocationLimit: server.feature_limits.allocations,
          backupLimit: server.feature_limits.backups,
          dockerImage: server.container.image,
          startupCommand: server.container.startup_command,
        })

        synced++
        if (synced % 10 === 0) {
          await updateSyncLog(log.id, {
            itemsSynced: synced,
            itemsFailed: servers.length - synced,
            metadata: { lastMessage: `Synced ${synced} servers` },
          })

          if (await isCancellationRequested(log.id)) {
            await updateSyncLog(log.id, {
              status: "FAILED",
              error: "Cancelled by user",
              completedAt: new Date(),
              metadata: { cancelled: true },
            })
            return { success: false, synced, error: "Cancelled by user" }
          }
        }
      } catch (error) {
        console.error(`[Sync] Failed to sync server ${server.id}:`, error)
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsSynced: synced,
      itemsFailed: servers.length - synced,
      completedAt: new Date(),
    })

    return { success: true, synced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, synced: 0, error: errorMsg }
  }
}

// ============================================================================
// SERVER DATABASE SYNC
// ============================================================================

interface PteroServerDatabase {
  id: number
  server: number
  host: number
  database: string
  username: string
  remote: string
  max_connections: number
  created_at: string
  updated_at: string
  relationships?: {
    host?: {
      attributes: {
        id: number
        name: string
        host: string
        port: number
      }
    }
  }
}

export async function syncServerDatabases(): Promise<{ success: boolean; synced: number; error?: string }> {
  const log = await createSyncLog("databases")
  
  try {
    // Get all servers from our database
    const servers = await prisma.server.findMany({
      select: { id: true, pterodactylId: true },
    })
    
    let totalSynced = 0

    for (const server of servers) {
      // Fetch databases for each server
      const response = await fetchFromPanel<PterodactylResponse<{ attributes: PteroServerDatabase }>>(
        `/servers/${server.pterodactylId}/databases`,
        { include: ["host"] }
      )

      if (!response) continue

      for (const dbData of response.data) {
        const db = dbData.attributes
        try {
          const hostInfo = db.relationships?.host?.attributes
          
          await prisma.serverDatabase.upsert({
            where: { id: db.id },
            update: {
              name: db.database,
              username: db.username,
              host: hostInfo?.host || "localhost",
              port: hostInfo?.port || 3306,
              maxConnections: db.max_connections,
              serverId: server.id,
              updatedAt: new Date(),
            },
            create: {
              id: db.id,
              name: db.database,
              username: db.username,
              host: hostInfo?.host || "localhost",
              port: hostInfo?.port || 3306,
              maxConnections: db.max_connections,
              serverId: server.id,
            },
          })
          totalSynced++
        } catch (error) {
          console.error(`[Sync] Failed to sync database ${db.id}:`, error)
        }
      }
    }

    await updateSyncLog(log.id, {
      status: "COMPLETED",
      itemsSynced: totalSynced,
      completedAt: new Date(),
    })

    return { success: true, synced: totalSynced }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    await updateSyncLog(log.id, {
      status: "FAILED",
      error: errorMsg,
      completedAt: new Date(),
    })
    return { success: false, synced: 0, error: errorMsg }
  }
}

// ============================================================================
// SERVER BACKUP SYNC (uses Client API, not Application API)
// Note: The Application API doesn't expose backups directly
// We'll skip this for now as it requires per-user client API keys
// ============================================================================

// ============================================================================
// USER SYNC (sync user data from panel to our database)
// ============================================================================

interface PteroUser {
  id: number
  uuid: string
  username: string
  email: string
  first_name: string
  last_name: string
  language: string
  root_admin: boolean
  "2fa": boolean
  created_at: string
  updated_at: string
}

export async function syncUserFromPanel(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.pterodactylId) {
      return { success: false, error: "User not found or no pterodactyl ID" }
    }

    const pteroUser = await fetchFromPanel<PterodactylSingleResponse<PteroUser>>(
      `/users/${user.pterodactylId}`
    )

    if (!pteroUser) {
      return { success: false, error: "Could not fetch user from panel" }
    }

    const { attributes } = pteroUser

    await prisma.user.update({
      where: { id: userId },
      data: {
        username: attributes.username,
        firstName: attributes.first_name,
        lastName: attributes.last_name,
        isPterodactylAdmin: attributes.root_admin,
        lastSyncedAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: errorMsg }
  }
}

// ============================================================================
// FULL SYNC
// ============================================================================

export async function runFullSync(): Promise<{
  success: boolean
  results: {
    locations: { success: boolean; synced: number }
    nodes: { success: boolean; synced: number }
    allocations: { success: boolean; synced: number }
    nests: { success: boolean; nests: number; eggs: number; variables: number }
    servers: { success: boolean; synced: number }
    databases: { success: boolean; synced: number }
  }
}> {
  const startTime = Date.now()
  console.log("[Sync] Starting full sync...")

  // Sync in order (dependencies first)
  const locations = await syncLocations()
  console.log(`[Sync] Locations: ${locations.synced} synced`)

  const nodes = await syncNodes()
  console.log(`[Sync] Nodes: ${nodes.synced} synced`)

  const allocations = await syncAllocations()
  console.log(`[Sync] Allocations: ${allocations.synced} synced`)

  const nests = await syncNestsAndEggs()
  console.log(`[Sync] Nests: ${nests.nests}, Eggs: ${nests.eggs}, Variables: ${nests.variables}`)

  const servers = await syncServers()
  console.log(`[Sync] Servers: ${servers.synced} synced`)

  const databases = await syncServerDatabases()
  console.log(`[Sync] Databases: ${databases.synced} synced`)

  const allSuccess = locations.success && nodes.success && allocations.success && nests.success && servers.success && databases.success
  const duration = Date.now() - startTime
  const durationSeconds = (duration / 1000).toFixed(2)

  console.log(`[Sync] Full sync ${allSuccess ? "completed" : "completed with errors"} in ${durationSeconds}s`)

  // Dispatch webhook notification for sync completion (async, non-blocking)
  const syncSummary = `Locations: ${locations.synced}, Nodes: ${nodes.synced}, Allocations: ${allocations.synced}, Servers: ${servers.synced}, Databases: ${databases.synced}`
  dispatchSyncCompletion(allSuccess, syncSummary, `${durationSeconds}s`).catch((error) => {
    console.error("[Sync] Failed to dispatch sync completion webhook:", error)
  })

  return {
    success: allSuccess,
    results: {
      locations,
      nodes,
      allocations,
      nests,
      servers,
      databases,
    },
  }
}

// ============================================================================
// GET SYNC STATUS
// ============================================================================

export async function getSyncStatus() {
  const latestLogs = await prisma.syncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 10,
  })

  const lastFullSync = await prisma.syncLog.findFirst({
    where: { type: "servers", status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
  })

  return {
    recentLogs: latestLogs,
    lastFullSync: lastFullSync?.completedAt,
  }
}
