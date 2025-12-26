import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    // Only system admins can change roles
    if (!auth.user?.isSystemAdmin) {
      return NextResponse.json(
        { success: false, error: "Only system admins can manage user roles" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, isSystemAdmin, isAdmin, isActive, roles } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Prevent removing yourself as system admin (safety check)
    if (userId === auth.user.id && isSystemAdmin === false) {
      return NextResponse.json(
        { success: false, error: "You cannot remove yourself as a system admin" },
        { status: 400 }
      )
    }

    // Validate roles if provided
    const validRoles = ["MEMBER", "PARTNER", "SPONSOR", "TECH_TEAM", "SUPPORT_TEAM", "ADMINISTRATOR", "SUPER_ADMIN"]
    if (roles && Array.isArray(roles)) {
      for (const role of roles) {
        if (!validRoles.includes(role)) {
          return NextResponse.json(
            { success: false, error: `Invalid role: ${role}` },
            { status: 400 }
          )
        }
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof isSystemAdmin !== "undefined" && { isSystemAdmin }),
        ...(typeof isAdmin !== "undefined" && { isAdmin }),
        ...(typeof isActive !== "undefined" && { isActive }),
        ...(Array.isArray(roles) && { roles }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        roles: true,
        isSystemAdmin: true,
        isAdmin: true,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("[Admin Users Roles] Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
