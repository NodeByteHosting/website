import {
  fetchFromPterodactyl,
} from "./core"
import {
  PterodactylPaginatedResponse,
  PterodactylServer,
  PterodactylUser,
  PterodactylNode,
} from "./types"

export async function getServers(page = 1, perPage = 50): Promise<PterodactylPaginatedResponse<PterodactylServer>> {
  return fetchFromPterodactyl(`/application/servers?page=${page}&per_page=${perPage}`)
}

export async function getServerCount(): Promise<number> {
  const response = await getServers(1, 1)
  return response.meta.pagination.total
}

export async function getUsers(page = 1, perPage = 50): Promise<PterodactylPaginatedResponse<PterodactylUser>> {
  return fetchFromPterodactyl(`/application/users?page=${page}&per_page=${perPage}`)
}

export async function getUserCount(): Promise<number> {
  const response = await getUsers(1, 1)
  return response.meta.pagination.total
}

export async function getNodes(): Promise<PterodactylPaginatedResponse<PterodactylNode>> {
  return fetchFromPterodactyl(`/application/nodes?include=allocated_resources`)
}

export async function getNodeCount(): Promise<number> {
  const response = await getNodes()
  return response.meta.pagination.total
}

export async function getStats(): Promise<{
  servers: number
  users: number
  nodes: number
  totalMemory: number
  totalDisk: number
  allocatedMemory: number
  allocatedDisk: number
}> {
  const [serversData, usersData, nodesData] = await Promise.all([
    getServers(1, 1),
    getUsers(1, 1),
    getNodes(),
  ])

  let totalMemory = 0
  let totalDisk = 0
  let allocatedMemory = 0
  let allocatedDisk = 0

  for (const node of nodesData.data) {
    const attrs = node.attributes
    totalMemory += attrs.memory
    totalDisk += attrs.disk
    if (attrs.allocated_resources) {
      allocatedMemory += attrs.allocated_resources.memory
      allocatedDisk += attrs.allocated_resources.disk
    }
  }

  return {
    servers: serversData.meta.pagination.total,
    users: usersData.meta.pagination.total,
    nodes: nodesData.meta.pagination.total,
    totalMemory,
    totalDisk,
    allocatedMemory,
    allocatedDisk,
  }
}

// Databases
export async function getDatabases(page = 1, perPage = 50) {
  return fetchFromPterodactyl(`/application/databases?page=${page}&per_page=${perPage}`)
}

export async function getDatabaseCount(): Promise<number> {
  const response = await getDatabases(1, 1)
  return response.meta.pagination.total
}

// Locations
export async function getLocations() {
  return fetchFromPterodactyl(`/application/locations`)
}

// Nests & Eggs
export async function getNests(page = 1, perPage = 50) {
  return fetchFromPterodactyl(`/application/nests?page=${page}&per_page=${perPage}`)
}

export async function getEggsForNest(nestId: number) {
  return fetchFromPterodactyl(`/application/nests/${nestId}/eggs`)
}

