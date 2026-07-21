import { NextResponse } from "next/server"
import { computeLatencyStats, fetchStatusSnapshot, type MonitorStatus } from "@/packages/core/lib/status"

export const revalidate = 30

export interface StatusApiMonitor {
  name: string
  groupName: string | null
  status: MonitorStatus
  uptime30dPct: number | null
  latency: { fast: number; avg: number; slow: number } | null
}

export interface StatusApiResponse {
  available: boolean
  generatedAt: number | null
  overallStatus: MonitorStatus | null
  monitors: StatusApiMonitor[]
}

export async function GET() {
  const snapshot = await fetchStatusSnapshot()

  if (!snapshot) {
    return NextResponse.json<StatusApiResponse>(
      { available: false, generatedAt: null, overallStatus: null, monitors: [] },
      { status: 200 },
    )
  }

  const monitors: StatusApiMonitor[] = snapshot.monitors.map((m) => ({
    name: m.name,
    groupName: m.group_name,
    status: m.status,
    uptime30dPct: m.uptime_30d_pct,
    latency: computeLatencyStats(m),
  }))

  return NextResponse.json<StatusApiResponse>(
    { available: true, generatedAt: snapshot.generated_at, overallStatus: snapshot.overall_status, monitors },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    },
  )
}
