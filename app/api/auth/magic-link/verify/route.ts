/**
 * Magic Link Authentication - Verify Endpoint
 * 
 * Validates magic link token and creates a session for the user.
 */

import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"
import { signIn } from "@/packages/auth"
import crypto from "crypto"

/**
 * GET /api/auth/magic-link/verify?token=xxx
 * Validate token and redirect to authenticated state
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      // Redirect to login with error
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login?error=token_required`
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
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login?error=invalid_token`
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

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login?error=token_expired`
      )
    }

    // Get the user with all required fields
    const user = await prisma.user.findUnique({
      where: { id: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login?error=user_not_found`
      )
    }

    // Delete the magic link token (one-time use)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })

    // Update email verified status and last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: user.emailVerified || new Date(),
        lastLoginAt: new Date(),
        isMigrated: true, // Mark as migrated since they've logged in
      },
    })

    console.log(`[Auth] Magic link login successful for user: ${user.email}`)

    // Create a session by storing in the database (NextAuth will recognize this)
    const sessionToken = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Store the session in the database
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    })

    console.log(`[Auth] Session created for user: ${user.id}`)

    // Create response with redirect to dashboard
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = NextResponse.redirect(
      `${baseUrl}/dashboard?login=magic-link`,
      { status: 302 }
    )

    // Set the session cookie
    const cookieName = process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  } catch (error) {
    console.error("[Auth] Magic link verification error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login?error=server_error`
    )
  }
}
