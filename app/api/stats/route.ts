import { NextResponse } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"

export const revalidate = 300 // Cache for 5 minutes - public route

/**
 * Public stats endpoint - returns ONLY aggregate counts from database
 * No sensitive information exposed
 */
export async function GET() {
  try {
    // Fetch all counts from database in parallel
    const [totalServers, totalUsers, totalAllocations, activeUsers] = await Promise.all([
      // Count all servers
      prisma.server.count(),
      // Count all users
      prisma.user.count(),
      // Count all allocations
      prisma.allocation.count(),
      // Count users who have logged in (lastLoginAt is set)
      prisma.user.count({
        where: {
          lastLoginAt: {
            not: null,
          },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalServers,
        totalUsers,
        activeUsers,
        totalAllocations,
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
        totalServers: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalAllocations: 0,
      },
      public: true,
    })
  }
}
