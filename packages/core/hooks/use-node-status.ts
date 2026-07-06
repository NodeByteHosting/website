"use client"

import { useEffect, useState } from "react"
import type { StatusApiMonitor, StatusApiResponse } from "@/app/api/status/route"
import type { MonitorStatus } from "@/packages/core/lib/status"

const REFRESH_INTERVAL_MS = 60_000

export function useNodeStatus() {
  const [monitors, setMonitors] = useState<StatusApiMonitor[]>([])
  const [available, setAvailable] = useState(false)
  const [overallStatus, setOverallStatus] = useState<MonitorStatus | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetch("/api/status")
        .then((r) => r.json())
        .then((data: StatusApiResponse) => {
          if (cancelled) return
          setAvailable(data.available)
          setMonitors(data.monitors)
          setOverallStatus(data.overallStatus)
        })
        .catch(() => {})
    }

    load()
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const findMonitor = (name: string) =>
    monitors.find((m) => m.name.trim().toLowerCase() === name.trim().toLowerCase()) ?? null

  return { available, overallStatus, monitors, findMonitor }
}
