import type React from "react"
import { Card } from "@/components/ui/card"
import { Users, Heart, Code } from "lucide-react"
import HeroGraphic from "./hero-graphic"

export function About() {
  return (
    <section id="about" className="py-20 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
              <Heart size={16} />
              <span>Our Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              Built for <span className="text-primary">Players & Devs</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              NodeByte started as a small group of gamers and ops engineers who wanted hosting that was fast, reliable,
              and easy to manage. We build infrastructure tuned for multiplayer: low latency routing, DDoS protection,
              and instant server provisioning so you can get playing fast.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We obsess over stability and developer experience. Whether you're running a modded Minecraft world or a
              Rust community server, our control panel and API make deployments and maintenance painless.
            </p>
          </div>
          <div className="relative items-center justify-center hidden lg:block">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl border border-border bg-card/30 p-6">
              <HeroGraphic />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border">
            <div className="w-full bg-transparent">
              <svg viewBox="0 0 1200 120" className="w-full h-16 block" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="b1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect width="1200" height="120" fill="url(#b1)" />
                <text x="40" y="76" fill="white" fontSize="18" fontWeight="700">Built for Players</text>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Built for Players</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our infrastructure prioritizes low-latency routing, predictable performance, and strong uptime so your
                communities stay online and responsive.
              </p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border">
            <div className="w-full bg-transparent">
              <svg viewBox="0 0 1200 120" className="w-full h-16 block" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="b2" x1="0" x2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <rect width="1200" height="120" fill="url(#b2)" />
                <text x="40" y="76" fill="white" fontSize="18" fontWeight="700">Community & Mods</text>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Community & Mod Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamless mod installs, snapshot support, and community tooling to help you run modded worlds and
                persistent servers with minimal effort.
              </p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-card/50 backdrop-blur-sm border-border sm:col-span-2 lg:col-span-1">
            <div className="w-full bg-transparent">
              <svg viewBox="0 0 1200 120" className="w-full h-16 block" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="b3" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <rect width="1200" height="120" fill="url(#b3)" />
                <text x="40" y="76" fill="white" fontSize="18" fontWeight="700">Open by Design</text>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Open by Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                We value transparency — from clear SLA commitments to open tooling. Our platform provides APIs and
                integrations to automate server workflows and manage deployments programmatically.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
