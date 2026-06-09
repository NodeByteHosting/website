"use client"

import { Card } from "@/packages/ui/components/ui/card"
import { 
  CheckCircle2, 
  Sparkles, 
  Settings, 
  Cpu, 
  Shield, 
  Zap, 
  HardDrive, 
  Users, 
  Server, 
  Map, 
  Globe 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const iconMap = {
  Settings: Settings,
  Cpu: Cpu,
  Shield: Shield,
  Zap: Zap,
  HardDrive: HardDrive,
  Users: Users,
  Server: Server,
  Map: Map,
  Globe: Globe,
  Sparkles: Sparkles,
}

interface Feature {
  title: string
  description: string
  icon: keyof typeof iconMap
  highlights: string[]
}

interface GameFeaturesProps {
  gameName: string
  features: Feature[]
}

export function GameFeatures({ gameName, features }: GameFeaturesProps) {
  const t = useTranslations()
  
  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            <span>{t("gamePage.features.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("gamePage.features.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {gameName} {t("gamePage.features.titleSuffix")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("gamePage.features.description", { game: gameName })}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                "hover:border-primary/30 transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5"
              )}
            >
              <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {(() => {
                    const IconComponent = iconMap[feature.icon]
                    return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : null
                  })()}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
