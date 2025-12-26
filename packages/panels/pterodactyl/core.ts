import { getPterodactylSettings } from "../../core/lib/system-settings"

export async function fetchFromPterodactyl<T>(endpoint: string): Promise<T> {
  const settings = await getPterodactylSettings()

  if (!settings.api || !settings.apiKey) {
    throw new Error("Pterodactyl API not configured")
  }

  const response = await fetch(`${settings.api}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      // Headers to bypass Cloudflare bot protection
      "User-Agent": "NodeByte-Website/1.0 (https://nodebyte.host)",
      "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID || "",
      "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET || "",
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Pterodactyl API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Helper for client API calls which require a per-user/client token
export async function fetchClientFromPterodactyl<T>(endpoint: string, token: string, apiBase?: string): Promise<T> {
  const base = apiBase || (await getPterodactylSettings()).api
  if (!base) throw new Error("Pterodactyl API base URL not configured")
  if (!token) throw new Error("Client token required for client API endpoints")

  const response = await fetch(`${base}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "NodeByte-Website/1.0 (https://nodebyte.host)",
    },
  })

  if (!response.ok) {
    throw new Error(`Pterodactyl Client API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
