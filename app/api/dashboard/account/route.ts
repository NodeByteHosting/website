/**
 * Dashboard Account API - Get and update user profile
 * 
 * GET /api/dashboard/account - Get current user profile
 * PATCH /api/dashboard/account - Update user profile
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        companyName: true,
        billingEmail: true,
        emailVerified: true,
        roles: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        emailVerified: user.emailVerified?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error("[Dashboard] Failed to fetch account:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch account" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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
    const { firstName, lastName, username, phoneNumber, companyName, billingEmail } = body

    // Validate username uniqueness if provided
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Username is already taken" },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        username: username || null,
        phoneNumber: phoneNumber || null,
        companyName: companyName || null,
        billingEmail: billingEmail || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        companyName: true,
        billingEmail: true,
        emailVerified: true,
        roles: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedUser,
        emailVerified: updatedUser.emailVerified?.toISOString() || null,
        createdAt: updatedUser.createdAt.toISOString(),
        lastLoginAt: updatedUser.lastLoginAt?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error("[Dashboard] Failed to update account:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update account" },
      { status: 500 }
    )
  }
}
