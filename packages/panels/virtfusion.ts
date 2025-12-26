// Virtfusion API helper functions
// Virtfusion is a VPS management panel

import { getVirtfusionSettings } from "../core/lib/system-settings"

interface VirtfusionPaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

interface VirtfusionServer {
  id: number
  uuid: string
  name: string
  hostname: string
  status: string
  state: string
  suspended: boolean
  user_id: number
  node_id: number
  package_id: number | null
  ipv4_address: string | null
  ipv6_address: string | null
  memory: number
  disk: number
  cpu: number
  bandwidth: number
  bandwidth_used: number
  created_at: string
  updated_at: string
}

interface VirtfusionUser {
  id: number
  uuid: string
  name: string
  email: string
  email_verified_at: string | null
  is_admin: boolean
  status: string
  created_at: string
  updated_at: string
}

interface VirtfusionNode {
  id: number
  uuid: string
  name: string
  fqdn: string
  status: string
  memory: number
  memory_allocated: number
  disk: number
  disk_allocated: number
  cpu: number
  cpu_allocated: number
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

interface VirtfusionStats {
  servers: number
  users: number
  nodes: number
  totalMemory: number
  totalDisk: number
  allocatedMemory: number
  allocatedDisk: number
}

async function fetchFromVirtfusion<T>(endpoint: string): Promise<T> {
  const settings = await getVirtfusionSettings()
  
  if (!settings.api || !settings.apiKey) {
    throw new Error("Virtfusion API not configured")
  }

  const response = await fetch(`${settings.api}${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "NodeByte-Website/1.0 (https://nodebyte.host)",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  })

  if (!response.ok) {
    throw new Error(`Virtfusion API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getVirtfusionServers(page = 1, perPage = 50): Promise<VirtfusionPaginatedResponse<VirtfusionServer>> {
  return fetchFromVirtfusion(`/api/servers?page=${page}&per_page=${perPage}`)
}

export async function getVirtfusionServerCount(): Promise<number> {
  try {
    const response = await getVirtfusionServers(1, 1)
    return response.meta.total
  } catch {
    return 0
  }
}

export async function getVirtfusionUsers(page = 1, perPage = 50): Promise<VirtfusionPaginatedResponse<VirtfusionUser>> {
  return fetchFromVirtfusion(`/api/users?page=${page}&per_page=${perPage}`)
}

export async function getVirtfusionUserCount(): Promise<number> {
  try {
    const response = await getVirtfusionUsers(1, 1)
    return response.meta.total
  } catch {
    return 0
  }
}

export async function getVirtfusionNodes(): Promise<VirtfusionPaginatedResponse<VirtfusionNode>> {
  return fetchFromVirtfusion(`/api/nodes`)
}

export async function getVirtfusionNodeCount(): Promise<number> {
  try {
    const response = await getVirtfusionNodes()
    return response.meta.total
  } catch {
    return 0
  }
}

export async function getVirtfusionStats(): Promise<VirtfusionStats> {
  try {
    const [serversData, usersData, nodesData] = await Promise.all([
      getVirtfusionServers(1, 1),
      getVirtfusionUsers(1, 1),
      getVirtfusionNodes(),
    ])

    let totalMemory = 0
    let totalDisk = 0
    let allocatedMemory = 0
    let allocatedDisk = 0

    for (const node of nodesData.data) {
      totalMemory += node.memory
      totalDisk += node.disk
      allocatedMemory += node.memory_allocated
      allocatedDisk += node.disk_allocated
    }

    return {
      servers: serversData.meta.total,
      users: usersData.meta.total,
      nodes: nodesData.meta.total,
      totalMemory,
      totalDisk,
      allocatedMemory,
      allocatedDisk,
    }
  } catch (error) {
    console.error("[Virtfusion] Failed to get stats:", error)
    return {
      servers: 0,
      users: 0,
      nodes: 0,
      totalMemory: 0,
      totalDisk: 0,
      allocatedMemory: 0,
      allocatedDisk: 0,
    }
  }
}

/**
 * Verify a user exists in Virtfusion by email
 */
export async function verifyVirtfusionUser(email: string): Promise<VirtfusionUser | null> {
  const settings = await getVirtfusionSettings()
  
  if (!settings.api || !settings.apiKey) {
    console.error("[Virtfusion] API not configured")
    return null
  }

  try {
    // Search for user by email
    const response = await fetch(
      `${settings.api}/api/users?filter[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          "Authorization": `Bearer ${settings.apiKey}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "NodeByte-Website/1.0 (https://nodebyte.host)",
        },
      }
    )

    if (!response.ok) {
      console.error(`[Virtfusion] API error: ${response.status}`)
      return null
    }

    const data: VirtfusionPaginatedResponse<VirtfusionUser> = await response.json()

    // Find exact email match
    const user = data.data.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    return user || null
  } catch (error) {
    console.error("[Virtfusion] Error verifying user:", error)
    return null
  }
}

export type {
  VirtfusionPaginatedResponse,
  VirtfusionServer,
  VirtfusionUser,
  VirtfusionNode,
  VirtfusionStats,
}
