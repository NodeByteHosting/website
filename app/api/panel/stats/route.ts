import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth/lib/auth-server"

const API_URL = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080"

export const dynamic = "force-dynamic"
export const revalidate = 60

export async function GET() {
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/panel/stats`, {
      headers: { "Authorization": `Bearer ${authResult.token}` },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch panel stats" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch panel stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch panel stats" },
      { status: 500 }
    )
  }
}
