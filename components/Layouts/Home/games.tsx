import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Monitor, Server, Cloud, PartyPopper } from "lucide-react"

export function Download() {
  return (
    <section id="download" className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Game <span className="text-primary">Servers</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Powerful, low latency game servers. Instant setup, control panel, and 24/7
            support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="w-full mb-4">
              <div className="py-4 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent">Minecraft • Dedicated</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-center">Minecraft Servers</h3>
              <p className="text-muted-foreground text-center mb-6">One click mod loaders, snapshots and plugins with dedicated reliable support.</p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
                <a href="/contact">View Prices</a>
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="w-full mb-4">
              <div className="py-4 text-center text-sm font-semibold text-white bg-gradient-to-r from-accent to-primary">Rust • High Performance</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-center">Rust Servers</h3>
              <p className="text-muted-foreground text-center mb-6">High performance Rust hosting with custom maps and mod support.</p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                <a href="/contact">View Prices</a>
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="w-full mb-4">
              <div className="py-4 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary/10 via-accent to-secondary">Upcoming • Stay Tuned</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 text-center">Something Exciting</h3>
              <p className="text-muted-foreground text-center mb-6">We are working on bringing you more exciting game servers and features. Stay tuned!</p>
              <Button className="w-full bg-transparent" size="lg" variant="ghost">
                Coming Soon
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
