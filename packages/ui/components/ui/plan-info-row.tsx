import type { ReactNode } from "react"

/** A label/value row inside a plan card's expandable "Server Info" panel. */
export function PlanInfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
