import { NextResponse } from "next/server"
import { getNodes } from "@/packages/panels/pterodactyl"
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

    const response = await getNodes(page, perPage)

    // Format node data with resource calculations
    const formattedNodes = response.data.map((node) => {
      const memoryTotal = node.attributes.memory
      const memoryOverAllocate = node.attributes.memory_overallocate
      const memoryEffective = memoryTotal + (memoryTotal * (memoryOverAllocate / 100))
      const memoryAllocated = node.attributes.allocated_resources?.memory || 0
      
      const diskTotal = node.attributes.disk
      const diskOverAllocate = node.attributes.disk_overallocate
      const diskEffective = diskTotal + (diskTotal * (diskOverAllocate / 100))
      const diskAllocated = node.attributes.allocated_resources?.disk || 0

      return {
        id: node.attributes.id,
        uuid: node.attributes.uuid,
        name: node.attributes.name,
        description: node.attributes.description,
        public: node.attributes.public,
        fqdn: node.attributes.fqdn,
        scheme: node.attributes.scheme,
        behind_proxy: node.attributes.behind_proxy,
        maintenance_mode: node.attributes.maintenance_mode,
        resources: {
          memory: {
            total: memoryTotal,
            effective: memoryEffective,
            allocated: memoryAllocated,
            available: memoryEffective - memoryAllocated,
            usage_percent: Math.round((memoryAllocated / memoryEffective) * 100),
            overallocate_percent: memoryOverAllocate,
          },
          disk: {
            total: diskTotal,
            effective: diskEffective,
            allocated: diskAllocated,
            available: diskEffective - diskAllocated,
            usage_percent: Math.round((diskAllocated / diskEffective) * 100),
            overallocate_percent: diskOverAllocate,
          },
        },
        location_id: node.attributes.location_id,
        created_at: node.attributes.created_at,
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedNodes,
      meta: {
        total: response.meta.pagination.total,
        count: response.meta.pagination.count,
        per_page: response.meta.pagination.per_page,
        current_page: response.meta.pagination.current_page,
        total_pages: response.meta.pagination.total_pages,
      },
    })
  } catch (error) {
    console.error("Failed to fetch nodes:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch nodes",
        data: [],
        meta: null,
      },
      { status: 500 }
    )
  }
}
