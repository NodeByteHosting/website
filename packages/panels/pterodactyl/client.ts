import { fetchClientFromPterodactyl } from "./core"

/**
 * Client API helpers — these endpoints are intended to be used with per-user
 * client tokens (not the application admin key). See Pterodactyl Client API docs.
 */
export async function getClientServerDetails(serverId: string, clientToken: string, apiBase?: string) {
  return fetchClientFromPterodactyl(`/client/servers/${serverId}`, clientToken, apiBase)
}

export async function getClientServerLogs(serverId: string, clientToken: string, lines = 100, apiBase?: string) {
  return fetchClientFromPterodactyl(`/client/servers/${serverId}/files/contents?file=console.log&lines=${lines}`, clientToken, apiBase)
}

// Add more client-facing helper functions here as needed.
