import { NextResponse } from "next/server"
import { getUsers } from "@/packages/panels/pterodactyl"
import { requireAdmin } from "@/packages/auth"

export const revalidate = 60 // Cache for 60 seconds

export async function GET(request: Request) {
  // Require admin authentication
  const authResult = await requireAdmin()
  if (!authResult.authorized) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = Math.min(parseInt(searchParams.get("per_page") || "50", 10), 100)

    const response = await getUsers(page, perPage)

    // Sanitize user data - only expose non-sensitive information
    const sanitizedUsers = response.data.map((user) => ({
      id: user.attributes.id,
      uuid: user.attributes.uuid,
      username: user.attributes.username,
      first_name: user.attributes.first_name,
      last_name: user.attributes.last_name,
      root_admin: user.attributes.root_admin,
      "2fa_enabled": user.attributes["2fa"],
      created_at: user.attributes.created_at,
    }))

    return NextResponse.json({
      success: true,
      data: sanitizedUsers,
      meta: {
        total: response.meta.pagination.total,
        count: response.meta.pagination.count,
        per_page: response.meta.pagination.per_page,
        current_page: response.meta.pagination.current_page,
        total_pages: response.meta.pagination.total_pages,
      },
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        data: [],
        meta: null,
      },
      { status: 500 }
    )
  }
}
