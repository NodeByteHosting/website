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
    const sortField = searchParams.get("sortField") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const filter = searchParams.get("filter") || "all"

    // Build where clause
    const where: any = {}
    
    // Search filter
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ]
    }

    // Status filter
    switch (filter) {
      case "active":
        where.isActive = true
        break
      case "inactive":
        where.isActive = false
        break
      case "admin":
        // Match any administrative indicator: system admin, panel-specific admin, or admin roles
        where.OR = [
          { isSystemAdmin: true },
          { isPterodactylAdmin: true },
          { isVirtfusionAdmin: true },
          { roles: { has: "ADMINISTRATOR" } },
          { roles: { has: "SUPER_ADMIN" } },
        ]
        break
      case "migrated":
        where.isMigrated = true
        break
      case "not-migrated":
        where.isMigrated = false
        break
    }

    // Build orderBy
    const validSortFields = ["username", "email", "createdAt", "lastLoginAt"]
    const orderField = validSortFields.includes(sortField) ? sortField : "createdAt"
    const orderBy = { [orderField]: sortOrder === "asc" ? "asc" : "desc" }

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isSystemAdmin: true,
        isPterodactylAdmin: true,
        isVirtfusionAdmin: true,
        roles: true,
        isMigrated: true,
        isActive: true,
        pterodactylId: true,
        createdAt: true,
        lastLoginAt: true,
        lastSyncedAt: true,
        _count: {
          select: {
            servers: true,
            sessions: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        data: [],
        meta: null,
      },
      { status: 500 }
    )
  }
}
