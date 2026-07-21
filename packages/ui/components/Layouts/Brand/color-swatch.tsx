"use client"

import { Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/packages/core/hooks/use-toast"

interface ColorSwatchProps {
  label: string
  value: string
  /** Rendered swatch color — usually the same as `value`, but callers can pass a resolved hex when `value` is an oklch() string that CSS can't preview reliably everywhere. */
  swatch?: string
  className?: string
}

/** A labeled color swatch that copies its value to the clipboard on click. */
export function ColorSwatch({ label, value, swatch, className }: ColorSwatchProps) {
  const { toast } = useToast()

  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      toast({ title: "Copied!", description: `${label}: ${value}` })
    }).catch(() => {
      toast({ title: "Copy failed", description: "Your browser blocked clipboard access.", variant: "destructive" })
    })
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm text-left transition-all hover:border-border hover:bg-card/50",
        className,
      )}
    >
      <span
        className="w-9 h-9 rounded-lg shrink-0 ring-1 ring-black/10 shadow-sm"
        style={{ background: swatch ?? value }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium truncate">{label}</span>
        <span className="block text-xs text-muted-foreground font-mono truncate">{value}</span>
      </span>
      <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
