/**
 * Reset Password Endpoint
 * 
 * Validates password reset token and updates user password.
 */

import { NextResponse } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const SALT_ROUNDS = 12

interface ResetPasswordRequest {
  token: string
  password: string
}

/**
 * POST /api/auth/reset-password
 * Validate token and update password
 */
export async function POST(request: Request) {
  try {
    const body: ResetPasswordRequest = await request.json()
    const { token, password } = body

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "token_required" },
        { status: 400 }
      )
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "password_too_short" },
        { status: 400 }
      )
    }

    // Hash the token to look it up
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Find reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    })

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: "invalid_token" },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })

      return NextResponse.json(
        { success: false, error: "token_expired" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Update user password and delete token
    const [updatedUser] = await Promise.all([
      prisma.user.update({
        where: { id: resetToken.user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ])

    console.log(`[Auth] Password reset successful for user: ${updatedUser.email}`)

    return NextResponse.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Auth] Reset password error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}
