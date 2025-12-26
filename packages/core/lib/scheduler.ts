import { getConfigs } from "./config"
import { getSyncStatus, runFullSync } from "./sync"

let started = false
let timer: NodeJS.Timeout | null = null

export async function startScheduler(): Promise<void> {
  if (started) return
  started = true

  async function scheduleOnce() {
    try {
      const cfg = await getConfigs("auto_sync_enabled", "sync_interval")
      const enabled = cfg.auto_sync_enabled === "true"
      const intervalSec = cfg.sync_interval ? parseInt(cfg.sync_interval, 10) || 3600 : 3600

      if (!enabled) return

      const status = await getSyncStatus()
      if (status?.lastRunning) {
        // If a sync is currently running, skip this tick
        return
      }

      // Run full sync in background (don't await long blocking here)
      runFullSync().catch((err) => console.error("[Scheduler] runFullSync error:", err))

      // Ensure timer is set with configured interval
      if (timer) clearInterval(timer)
      timer = setInterval(async () => {
        try {
          const cfg2 = await getConfigs("auto_sync_enabled", "sync_interval")
          const enabled2 = cfg2.auto_sync_enabled === "true"
          if (!enabled2) return
          const status2 = await getSyncStatus()
          if (status2?.lastRunning) return
          await runFullSync()
        } catch (e) {
          console.error("[Scheduler] interval run error:", e)
        }
      }, Math.max(1000, intervalSec * 1000))
    } catch (e) {
      console.error("[Scheduler] scheduleOnce error:", e)
    }
  }

  // Initial delayed trigger to allow server startup to settle
  setTimeout(() => {
    scheduleOnce()
  }, 10_000)
}
