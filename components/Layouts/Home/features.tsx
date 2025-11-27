import React from "react"
import { Shield, Zap, Globe, Lock, Eye, Server } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade mitigation and automatic scrubbing to keep servers online under attack.",
    tag: "Security",
    color: "from-primary to-accent",
  },
  {
    icon: Zap,
    title: "Low Latency Network",
    description: "Optimized routes, private backbone links, and regional POPs for minimal ping.",
    tag: "Performance",
    color: "from-accent to-primary",
  },
  {
    icon: Server,
    title: "Instant Setup",
    description: "One-click server templates, automated mod installs, and fast provisioning.",
    tag: "Deploy",
    color: "from-secondary to-primary",
  },
  {
    icon: Globe,
    title: "Global Locations",
    description: "Multiple regions and edge POPs to keep players close and latency low.",
    tag: "Global",
    color: "from-primary to-secondary",
  },
  {
    icon: Eye,
    title: "Control Panel",
    description: "A powerful UI for console access, file management, backups, and metrics.",
    tag: "Manage",
    color: "from-accent to-secondary",
  },
  {
    icon: Lock,
    title: "24/7 Support",
    description: "Human-first support with expert ops available any time, for installs and troubleshooting.",
    tag: "Support",
    color: "from-primary to-accent",
  },
]

function Sparkline({ color = "rgba(96,165,250,0.9)" }: { color?: string }) {
  // small decorative sparkline — static path for now
  return (
    <svg className="w-20 h-6" viewBox="0 0 80 20" preserveAspectRatio="none" aria-hidden>
      <path d="M0 12 C16 6, 36 16, 80 6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Built for <span className="text-primary">Hosting</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            NodeByte combines enterprise-grade infrastructure with gamer-friendly tooling — instant servers,
            low-latency routing, DDoS protection, and an easy control panel so you can focus on playing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-0 text-white shadow-sm`}>
                    <feature.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{feature.tag}</div>
                  </div>
                </div>
                <div className="hidden sm:block opacity-60 group-hover:opacity-100 transition-opacity"> 
                  <Sparkline color={index % 2 === 0 ? "rgba(96,165,250,0.9)" : "rgba(236,72,153,0.9)"} />
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4">{feature.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <a className="text-sm text-primary hover:underline" href="#download">Learn more</a>
                <div className="text-xs text-muted-foreground">Trusted by gamers • SLA</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-primary">
            <a href="#download">See Hosting Plans</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
