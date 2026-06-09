import { Globe, Shield, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type HeroStat = {
  icon: "shield" | "zap" | "globe"
  value: string
  label: string
  description: string
  color: "primary" | "accent"
}

const icons = {
  shield: Shield,
  zap: Zap,
  globe: Globe,
}

export function HeroStats({ stats }: { stats: readonly HeroStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
      {stats.map((stat) => {
        const Icon = icons[stat.icon]

        return (
          <div
            key={stat.label}
            className={cn(
              "group relative p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm",
              "hover:border-primary/30 hover:bg-card/50 transition-all duration-300",
              "hover:shadow-lg hover:shadow-primary/5"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                stat.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
            <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{stat.description}</p>
          </div>
        )
      })}
    </div>
  )
}
