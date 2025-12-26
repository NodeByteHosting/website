import { NextResponse } from "next/server"
import { getServerCount, getUserCount, getNodeCount } from "@/packages/panels/pterodactyl"
import { requireAdmin } from "@/packages/auth"

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
    const [servers, users, nodes] = await Promise.all([
      getServerCount(),
      getUserCount(),
      getNodeCount(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        servers,
        users,
        nodes,
      },
    })
  } catch (error) {
    console.error("Failed to fetch counts:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch counts",
        data: {
          servers: 0,
          users: 0,
          nodes: 0,
        },
      },
      { status: 500 }
    )
  }
}
