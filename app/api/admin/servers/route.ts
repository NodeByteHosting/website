import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function GET(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = Math.min(parseInt(searchParams.get("perPage") || "25", 10), 100)
    const search = searchParams.get("search") || ""
    const filter = searchParams.get("filter") || "all"

    // Build where clause
    const where: any = {}
    
    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { uuid: { contains: search, mode: "insensitive" } },
      ]
    }

    // Status filter
    switch (filter) {
      case "running":
        where.status = "RUNNING"
        where.isSuspended = false
        break
      case "offline":
        where.status = "OFFLINE"
        where.isSuspended = false
        break
      case "suspended":
        where.isSuspended = true
        break
      case "installing":
        where.status = { in: ["INSTALLING", "INSTALL_FAILED"] }
        break
    }

    // Get total count
    const total = await prisma.server.count({ where })

    // Get servers with pagination
    const servers = await prisma.server.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        pterodactylId: true,
        uuid: true,
        name: true,
        description: true,
        status: true,
        isSuspended: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        node: {
          select: {
            id: true,
            name: true,
          },
        },
        egg: {
          select: {
            id: true,
            name: true,
          },
        },
        properties: {
          select: {
            key: true,
            value: true,
          },
        },
        allocations: {
          select: {
            ip: true,
            port: true,
            isAssigned: true,
          },
          take: 5,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: servers,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error("Failed to fetch servers:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch servers",
        data: [],
        meta: null,
      },
      { status: 500 }
    )
  }
}
