import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** A labeled row of filter chips — label on the left (or stacked above on mobile), chips wrap on the right. */
export function FilterChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
      <span className="text-xs font-medium text-muted-foreground sm:w-20 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

/** A single toggleable filter pill, used inside FilterChipRow. */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
