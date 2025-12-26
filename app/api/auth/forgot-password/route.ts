/**
 * Forgot Password Endpoint
 * 
 * Generates a password reset token and sends a password reset email.
 * Token expires in 24 hours.
 */

import { NextResponse } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"
import { sendPasswordResetEmail } from "@/packages/core/dispatchers/email"
import crypto from "crypto"

interface ForgotPasswordRequest {
  email: string
}

/**
 * POST /api/auth/forgot-password
 * Generate password reset token and send email
 */
export async function POST(request: Request) {
  try {
    const body: ForgotPasswordRequest = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "email_required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Don't reveal if email exists or not (security)
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If the email exists, a reset link has been sent" },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // Store token in database with 24-hour expiration
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: {
        token: resetTokenHash,
        expiresAt,
      },
      create: {
        token: resetTokenHash,
        expiresAt,
        userId: user.id,
      },
    })

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`

    // Send password reset email
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      resetToken,
      resetUrl,
    })

    if (!emailResult.success) {
      console.error("[Auth] Failed to send password reset email:", emailResult.error)
      // Don't expose email service errors to client
      return NextResponse.json(
        { success: true, message: "If the email exists, a reset link has been sent" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Password reset email sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Auth] Forgot password error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}
