/**
 * Magic Link Authentication - Verify Endpoint
 * 
 * Validates magic link token and creates a session for the user.
 */

import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"
import crypto from "crypto"
import jwt from "jsonwebtoken"

/**
 * GET /api/auth/magic-link/verify?token=xxx
 * Validate token and redirect to authenticated state
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { success: false, error: "token_required" },
        { status: 400 }
      )
    }

    // Hash the token to look it up
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Find magic link token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: tokenHash,
        type: "magic_link",
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "invalid_token" },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      })

      return NextResponse.json(
        { success: false, error: "token_expired" },
        { status: 400 }
      )
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "user_not_found" },
        { status: 400 }
      )
    }

    // Create JWT token for session
    const jwtToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    )

    // Delete the magic link token (one-time use)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })

    // Update email verified status if not already done
    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    }

    console.log(`[Auth] Magic link login successful for user: ${user.email}`)

    // Create response with auth cookie and redirect
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?magicLink=success`,
      {
        status: 302,
      }
    )

    // Set JWT in httpOnly cookie
    response.cookies.set("next-auth.session-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error) {
    console.error("[Auth] Magic link verification error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}
