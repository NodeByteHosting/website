import { NextResponse } from "next/server"
import { registerUser, verifyPterodactylUser } from "@/packages/auth/lib/auth-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, confirmPassword } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "invalid_email" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "password_too_short" },
        { status: 400 }
      )
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "passwords_dont_match" },
        { status: 400 }
      )
    }

    console.log(`[Register] Attempting registration for: ${email}`)

    // Register the user
    const result = await registerUser(email, password)

    if (!result.success) {
      console.log(`[Register] Registration failed: ${result.error}`)
      
      // Map errors to appropriate status codes
      const statusMap: Record<string, number> = {
        email_exists: 409,
        panel_account_linked: 409,
        server_error: 500,
      }

      return NextResponse.json(
        { success: false, error: result.error },
        { status: statusMap[result.error || "server_error"] || 500 }
      )
    }

    console.log(`[Register] User registered successfully: ${email}`)
    
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("[Register] Error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}

// Check if email exists in panel (informational - for UI hints)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { success: false, error: "missing_email" },
        { status: 400 }
      )
    }

    // Check if email exists in Pterodactyl panel (optional info for UI)
    const pteroUser = await verifyPterodactylUser(email)

    return NextResponse.json({
      success: true,
      // Whether this email exists in the panel (for UI hints)
      existsInPanel: !!pteroUser,
      username: pteroUser?.username || null,
    })
  } catch (error) {
    console.error("[Register] Check error:", error)
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    )
  }
}
