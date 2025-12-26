import { NextResponse } from "next/server"
import { requireAdmin } from "@/packages/auth"
import { getConfigs, setConfig } from "@/packages/core/lib/config"

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })

    const cfg = await getConfigs("auto_sync_enabled", "sync_interval")
    return NextResponse.json({ success: true, settings: cfg })
  } catch (error) {
    console.error('[Admin Sync Settings] GET error', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { auto_sync_enabled, sync_interval } = body || {}

    if (typeof auto_sync_enabled !== 'undefined') {
      await setConfig('auto_sync_enabled', auto_sync_enabled ? 'true' : 'false')
    }

    if (typeof sync_interval !== 'undefined') {
      // store as string (seconds)
      await setConfig('sync_interval', String(Number(sync_interval) || 3600))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Sync Settings] POST error', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
