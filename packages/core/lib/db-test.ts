/**
 * Database Connection Testing Utility
 * 
 * Tests database connections and validates connection strings.
 * Used during setup to verify configurations before saving.
 */

/**
 * Test a PostgreSQL connection string
 * Returns connection status and any errors
 */
export async function testDatabaseConnection(connectionString: string): Promise<{
  success: boolean
  error?: string
  database?: string
  latency?: number
}> {
  if (!connectionString) {
    return {
      success: false,
      error: "Connection string is required",
    }
  }

  // Validate basic PostgreSQL connection string format
  if (!connectionString.startsWith("postgresql://") && !connectionString.startsWith("postgres://")) {
    return {
      success: false,
      error: "Invalid connection string format. Must start with postgresql:// or postgres://",
    }
  }

  try {
    const startTime = Date.now()
    
    // Dynamically import pg to avoid build-time errors
    const { Client } = await import("pg")
    const client = new Client({ connectionString })

    // Try to connect
    await client.connect()
    
    // Get database name for verification
    const result = await client.query("SELECT current_database() as database")
    const database = result.rows[0]?.database

    // Close connection
    await client.end()

    const latency = Date.now() - startTime

    return {
      success: true,
      database,
      latency,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Provide helpful error messages
    let userFriendlyError = errorMessage
    
    if (errorMessage.includes("ECONNREFUSED")) {
      userFriendlyError = "Cannot connect to database server. Check host and port."
    } else if (errorMessage.includes("password authentication failed")) {
      userFriendlyError = "Authentication failed. Check username and password."
    } else if (errorMessage.includes("database")) {
      userFriendlyError = "Database error. Check database name exists."
    } else if (errorMessage.includes("timeout")) {
      userFriendlyError = "Connection timeout. Check host is reachable."
    }

    return {
      success: false,
      error: userFriendlyError,
    }
  }
}

/**
 * Test a panel API connection (Pterodactyl/Virtfusion)
 * Returns connection status and panel information
 */
export async function testPanelConnection(
  panelUrl: string,
  apiKey: string,
  panelType: "pterodactyl" | "virtfusion" = "pterodactyl"
): Promise<{
  success: boolean
  error?: string
  panelVersion?: string
  latency?: number
  serverCount?: number
}> {
  if (!panelUrl || !apiKey) {
    return {
      success: false,
      error: "Panel URL and API key are required",
    }
  }

  try {
    // Normalize URL
    const normalizedUrl = panelUrl.endsWith("/") ? panelUrl.slice(0, -1) : panelUrl
    const startTime = Date.now()

    // Different endpoints for different panel types
    let endpoint = ""
    if (panelType === "pterodactyl") {
      endpoint = `${normalizedUrl}/api/application/servers?per_page=1`
    } else {
      // Virtfusion uses a different API structure
      endpoint = `${normalizedUrl}/api/servers?limit=1`
    }

    // Test connection to panel API by listing servers
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000, // 10 second timeout
    })

    const latency = Date.now() - startTime

    if (!response.ok) {
      let error = `API responded with status ${response.status}`
      
      if (response.status === 401) {
        error = "Authentication failed. Check API key is correct."
      } else if (response.status === 403) {
        error = "Access denied. Check API key has required permissions."
      } else if (response.status === 404) {
        error = "Panel endpoint not found. Check URL and panel type."
      }

      return {
        success: false,
        error,
        latency,
      }
    }

    // Parse response to count servers
    const data = await response.json()
    let serverCount = 0
    let panelVersion = undefined

    if (panelType === "pterodactyl") {
      // Pterodactyl response structure
      serverCount = data.meta?.pagination?.total || 0
      panelVersion = "Pterodactyl v1.x"
    } else {
      // Virtfusion response structure
      serverCount = Array.isArray(data.data) ? data.data.length : 0
      panelVersion = "Virtfusion"
    }

    return {
      success: true,
      panelVersion,
      latency,
      serverCount,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    let userFriendlyError = errorMessage
    
    if (errorMessage.includes("ECONNREFUSED")) {
      userFriendlyError = "Cannot connect to panel server. Check URL is correct."
    } else if (errorMessage.includes("ETIMEDOUT") || errorMessage.includes("timeout")) {
      userFriendlyError = "Connection timeout. Panel server may be down or unreachable."
    } else if (errorMessage.includes("fetch")) {
      userFriendlyError = `Failed to connect: ${errorMessage}`
    }

    return {
      success: false,
      error: userFriendlyError,
    }
  }
}
