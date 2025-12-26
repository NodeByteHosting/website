import { NextResponse } from "next/server"
import { getServers } from "@/packages/panels/pterodactyl"
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

    const response = await getServers(page, perPage)

    // Sanitize server data - remove sensitive information
    const sanitizedServers = response.data.map((server) => ({
      id: server.attributes.id,
      uuid: server.attributes.uuid,
      identifier: server.attributes.identifier,
      name: server.attributes.name,
      description: server.attributes.description,
      status: server.attributes.status,
      suspended: server.attributes.suspended,
      limits: {
        memory: server.attributes.limits.memory,
        disk: server.attributes.limits.disk,
        cpu: server.attributes.limits.cpu,
      },
      node: server.attributes.node,
      created_at: server.attributes.created_at,
    }))

    return NextResponse.json({
      success: true,
      data: sanitizedServers,
      meta: {
        total: response.meta.pagination.total,
        count: response.meta.pagination.count,
        per_page: response.meta.pagination.per_page,
        current_page: response.meta.pagination.current_page,
        total_pages: response.meta.pagination.total_pages,
      },
    })
  } catch (error) {
    console.error("Failed to fetch servers:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch servers",
        data: [],
        meta: null,
      },
      { status: 500 }
    )
  }
}
