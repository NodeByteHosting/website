/**
 * Dashboard Stats API - Get user-specific statistics
 * 
 * GET /api/dashboard/stats
 * Returns server counts, recent servers, account balance, and open tickets for the current user
 */

import { NextResponse } from "next/server"
import { requireAuth } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function GET() {
  const authResult = await requireAuth()
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  const userId = authResult.user!.id

  try {
    // Get server counts
    const [totalServers, onlineServers, offlineServers, suspendedServers] = await Promise.all([
      prisma.server.count({ where: { ownerId: userId } }),
      prisma.server.count({ where: { ownerId: userId, status: "RUNNING" } }),
      prisma.server.count({ where: { ownerId: userId, status: "OFFLINE" } }),
      prisma.server.count({ where: { ownerId: userId, isSuspended: true } }),
    ])

    // Get recent servers with their data
    const recentServers = await prisma.server.findMany({
      where: { ownerId: userId },
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        node: { select: { name: true } },
        egg: { select: { name: true } },
        allocations: {
          where: { isAssigned: true },
          take: 1,
          select: { ip: true, port: true },
        },
        properties: {
          where: {
            key: { in: ["memory", "disk", "cpu"] },
          },
        },
      },
    })

    // Get user account data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountBalance: true },
    })

    // Get open ticket count
    const openTickets = await prisma.supportTicket.count({
      where: {
        userId,
        status: { in: ["open", "pending", "in_progress"] },
      },
    })

    // Transform recent servers for the frontend
    const transformedServers = recentServers.map((server) => {
      const memoryProp = server.properties.find((p) => p.key === "memory")
      const diskProp = server.properties.find((p) => p.key === "disk")
      const cpuProp = server.properties.find((p) => p.key === "cpu")
      const allocation = server.allocations[0]

      return {
        id: server.uuid,
        name: server.name,
        status: server.status.toLowerCase(),
        game: server.egg?.name || "Unknown",
        node: server.node.name,
        ip: allocation?.ip || "0.0.0.0",
        port: allocation?.port || 0,
        resources: {
          memory: {
            used: 0, // Would come from real-time API in production
            limit: parseInt(memoryProp?.value || "0"),
          },
          cpu: {
            used: 0,
            limit: parseInt(cpuProp?.value || "100"),
          },
          disk: {
            used: 0,
            limit: parseInt(diskProp?.value || "0"),
          },
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        servers: {
          total: totalServers,
          online: onlineServers,
          offline: offlineServers,
          suspended: suspendedServers,
        },
        recentServers: transformedServers,
        accountBalance: user?.accountBalance ? Number(user.accountBalance) : 0,
        openTickets,
      },
    })
  } catch (error) {
    console.error("[Dashboard] Failed to fetch stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
