/**
 * Dashboard Account Password API - Change user password
 * 
 * POST /api/dashboard/account/password - Change password
 */

import { NextResponse } from "next/server"
import { requireAuth } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const authResult = await requireAuth()
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  const userId = authResult.user!.id

  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // If user has no password (magic link only), allow setting one
    if (user.password) {
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        )
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isMigrated: true, // Mark as having set password
      },
    })

    console.log(`[Auth] Password changed for user: ${userId}`)

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("[Dashboard] Failed to change password:", error)
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    )
  }
}
