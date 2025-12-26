import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    const url = new URL(request.url)
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"))
    const cursor = url.searchParams.get("cursor") || null

    let logs
    if (cursor) {
      // Cursor-based pagination: return items older than the cursor
      logs = await prisma.syncLog.findMany({
        orderBy: { startedAt: "desc" },
        cursor: { id: cursor },
        skip: 1,
        take: limit,
      })
    } else {
      logs = await prisma.syncLog.findMany({
        orderBy: { startedAt: "desc" },
        take: limit,
      })
    }

    const nextCursor = logs.length === limit ? logs[logs.length - 1].id : null

    return NextResponse.json({ success: true, logs, nextCursor })
  } catch (error) {
    console.error("[Admin Sync Logs] Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
