import { NextResponse } from "next/server"
import { getStats } from "@/packages/panels/pterodactyl"
import { requireAdmin } from "@/packages/auth"

export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const stats = await getStats()

    return NextResponse.json({
      success: true,
      data: {
        servers: stats.servers,
        users: stats.users,
        nodes: stats.nodes,
        resources: {
          memory: {
            total: stats.totalMemory,
            allocated: stats.allocatedMemory,
            available: stats.totalMemory - stats.allocatedMemory,
            usagePercent: stats.totalMemory > 0 
              ? Math.round((stats.allocatedMemory / stats.totalMemory) * 100) 
              : 0,
          },
          disk: {
            total: stats.totalDisk,
            allocated: stats.allocatedDisk,
            available: stats.totalDisk - stats.allocatedDisk,
            usagePercent: stats.totalDisk > 0 
              ? Math.round((stats.allocatedDisk / stats.totalDisk) * 100) 
              : 0,
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to fetch panel stats:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch panel statistics",
        data: null,
      },
      { status: 500 }
    )
  }
}
