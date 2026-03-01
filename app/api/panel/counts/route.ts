import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth/lib/auth-server"

const API_URL = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    // Proxy to Go backend
    const response = await fetch(`${API_URL}/api/v1/panel/counts`, {
      headers: {
        "Authorization": `Bearer ${authResult.token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch counts" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch counts:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch counts" },
      { status: 500 }
    )
  }
}
