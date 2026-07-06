"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useNodeStatus } from "@/packages/core/hooks/use-node-status"
import { LINKS } from "@/packages/core/constants/links"

const STATUS_DOT: Record<string, string> = {
  up: "bg-green-400 animate-pulse",
  degraded: "bg-amber-400",
  maintenance: "bg-amber-400",
  paused: "bg-amber-400",
  down: "bg-red-400",
  unknown: "bg-muted-foreground",
}

const STATUS_LABEL_KEY: Record<string, string> = {
  up: "operational",
  degraded: "degraded",
  maintenance: "maintenance",
  paused: "maintenance",
  down: "down",
  unknown: "unavailable",
}

export function StatusBadge() {
  const t = useTranslations()
  const { available, overallStatus } = useNodeStatus()

  const labelKey = available && overallStatus ? STATUS_LABEL_KEY[overallStatus] : "unavailable"
  const dotClass = available && overallStatus ? STATUS_DOT[overallStatus] : "bg-muted-foreground"

  return (
    <a
      href={LINKS.status}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClass)} />
      {t(`footer.statusLabels.${labelKey}`)}
    </a>
  )
}
