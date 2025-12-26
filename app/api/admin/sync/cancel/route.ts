import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { prisma } from "@/packages/core/lib/prisma"

export async function POST() {
  try {
    const authResult = await requireAdmin()
    if (!authResult.authorized) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    // Find the most recent running sync log
    const running = await prisma.syncLog.findFirst({ where: { status: "RUNNING" }, orderBy: { startedAt: "desc" } })
    if (!running) {
      return NextResponse.json({ success: false, error: "No running sync found" }, { status: 404 })
    }

    const meta = (running.metadata as any) || {}
    meta.cancelRequested = true

    await prisma.syncLog.update({ where: { id: running.id }, data: { metadata: meta } })

    return NextResponse.json({ success: true, message: "Cancellation requested" })
  } catch (error) {
    console.error("[Admin Sync Cancel] Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
