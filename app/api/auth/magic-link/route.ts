/**
 * Magic Link Authentication - Request Endpoint
 * 
 * Generates a magic login token and sends a magic link email.
 * Token expires in 30 minutes.
 */

import { NextResponse } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"
import { sendMagicLinkEmail } from "@/packages/core/dispatchers/email"
import crypto from "crypto"

interface MagicLinkRequest {
  email: string
}

/**
 * POST /api/auth/magic-link
 * Generate magic link token and send email
 */
export async function POST(request: Request) {
  try {
    const body: MagicLinkRequest = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "email_required" },
        { status: 400 }
      )
    }

    // Find or create user for email-only signup
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Create user on first magic link request
      // They'll set password after first login
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          isMigrated: false, // Haven't set password yet
          isActive: true,
          roles: ["MEMBER"], // Default role
        },
      })
    }

    // Generate magic token (32 random bytes = 64 hex chars)
    const magicToken = crypto.randomBytes(32).toString("hex")
    const magicTokenHash = crypto
      .createHash("sha256")
      .update(magicToken)
      .digest("hex")

    // Store token with 30-minute expiration
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Use VerificationToken model for magic links
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.id,
        type: "magic_link",
      },
    })

    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token: magicTokenHash,
        expires: expiresAt,
        type: "magic_link",
      },
    })

    // Build magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const magicLink = `${baseUrl}/api/auth/magic-link/verify?token=${magicToken}`

    // Send magic link email
    const emailResult = await sendMagicLinkEmail({
      email: user.email,
      magicToken,
      magicUrl: magicLink,
      expiresIn: "30 minutes",
    })

    if (!emailResult.success) {
      console.error("[Auth] Failed to send magic link email:", emailResult.error)
      // Don't expose email service errors to client
      return NextResponse.json(
        { success: true, message: "If the email exists, a magic link has been sent" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Magic link email sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Auth] Magic link error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}
