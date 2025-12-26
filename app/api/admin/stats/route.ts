import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    // Fetch all statistics
    const [
      totalServers,
      totalUsers,
      totalAllocations,
      totalNodes,
      totalNests,
      totalEggs,
      runningServers,
      migratedUsers,
      activeUsers,
    ] = await Promise.all([
      prisma.server.count(),
      prisma.user.count(),
      prisma.allocation.count(),
      prisma.node.count(),
      prisma.nest.count(),
      prisma.egg.count(),
      prisma.server.count(),
      prisma.user.count({
        where: {
          isMigrated: true,
        },
      }),
      prisma.user.count({
        where: {
          isActive: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalServers,
        totalUsers,
        totalAllocations,
        totalNodes,
        totalNests,
        totalEggs,
        runningServers,
        migratedUsers,
        activeUsers,
      },
    })
  } catch (error) {
    console.error("[Admin Stats] Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
