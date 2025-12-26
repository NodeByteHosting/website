import { NextResponse } from "next/server"
import { prisma } from "@/packages/core/lib/prisma"

interface VerifyEmailRequest {
  token: string
  userId: string
}

/**
 * POST /api/auth/verify-email
 * Verify email with token (used from client-side form)
 */
export async function POST(request: Request) {
  try {
    const body: VerifyEmailRequest = await request.json()
    const { token, userId } = body

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "token_required" },
        { status: 400 }
      )
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, error: "user_id_required" },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: userId,
        token,
        type: "email",
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
        where: { token },
      })

      return NextResponse.json(
        { success: false, error: "token_expired" },
        { status: 400 }
      )
    }

    // Mark email as verified and delete token
    await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { token },
      }),
    ])

    console.log(`[Auth] Email verified for user: ${userId}`)

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Auth] Email verification error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/verify-email?token=xxx&id=yyy
 * Verify email from email link (redirected from email)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const userId = searchParams.get("id")

    if (!token || !userId) {
      return NextResponse.json(
        { success: false, error: "missing_parameters" },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: userId,
        token,
        type: "email",
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "invalid_or_expired_token" },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json(
        { success: false, error: "token_expired" },
        { status: 400 }
      )
    }

    // Mark user email as verified
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    console.log(`[Auth] Email verified for user: ${userId}`)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("[Auth] Email verification error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}

