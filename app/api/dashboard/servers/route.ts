/**
 * Dashboard Servers API - Get user's servers with filtering and pagination
 * 
 * GET /api/dashboard/servers
 * Query params: page, per_page, search, status
 */

import { NextResponse } from "next/server"
import { requireAuth } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"
import { Prisma } from "@/prisma/generated/prisma"

export async function GET(request: Request) {
  const authResult = await requireAuth()
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  const userId = authResult.user!.id

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") || "12", 10)))
    const search = searchParams.get("search") || ""
    const statusFilter = searchParams.get("status") || ""

    // Build where clause
    const where: Prisma.ServerWhereInput = {
      ownerId: userId,
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Add status filter
    if (statusFilter && statusFilter !== "all") {
      const statusMap: Record<string, string> = {
        running: "RUNNING",
        online: "RUNNING",
        offline: "OFFLINE",
        starting: "STARTING",
        stopping: "STOPPING",
        suspended: "SUSPENDED",
        installing: "INSTALLING",
      }
      const mappedStatus = statusMap[statusFilter.toLowerCase()]
      if (mappedStatus) {
        where.status = mappedStatus as Prisma.EnumServerStatusFilter["equals"]
      }
    }

    // Get total count
    const total = await prisma.server.count({ where })

    // Get servers with pagination
    const servers = await prisma.server.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { updatedAt: "desc" },
      include: {
        node: { select: { id: true, name: true } },
        egg: { select: { id: true, name: true } },
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

    // Transform servers for the frontend
    const transformedServers = servers.map((server) => {
      const memoryProp = server.properties.find((p) => p.key === "memory")
      const diskProp = server.properties.find((p) => p.key === "disk")
      const cpuProp = server.properties.find((p) => p.key === "cpu")
      const allocation = server.allocations[0]

      return {
        id: server.id,
        uuid: server.uuid,
        name: server.name,
        description: server.description,
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
        createdAt: server.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedServers,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error("[Dashboard] Failed to fetch servers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch servers" },
      { status: 500 }
    )
  }
}
