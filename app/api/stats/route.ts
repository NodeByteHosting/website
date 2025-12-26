import { NextResponse } from "next/server"
import { getServerCount, getUserCount, getNodeCount } from "@/packages/panels/pterodactyl/application"

export const revalidate = 300 // Cache for 5 minutes - public route

/**
 * Public stats endpoint - returns ONLY aggregate counts
 * No sensitive information exposed
 */
export async function GET() {
  try {
    // Fetch counts in parallel
    const [servers, users, nodes] = await Promise.all([
      getServerCount().catch(() => null),
      getUserCount().catch(() => null),
      getNodeCount().catch(() => null),
    ])

    // Return only counts - no detailed information
    return NextResponse.json({
      success: true,
      data: {
        servers: servers ?? 0,
        users: users ?? 0,
        nodes: nodes ?? 0,
      },
      // Note: This is public data, no sensitive info
      public: true,
    })
  } catch (error) {
    console.error("Failed to fetch public stats:", error)
    
    // Return zeros on error - don't expose error details
    return NextResponse.json({
      success: false,
      data: {
        servers: 0,
        users: 0,
        nodes: 0,
      },
      public: true,
    })
  }
}
