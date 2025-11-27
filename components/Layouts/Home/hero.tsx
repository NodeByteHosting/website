"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, PartyPopper } from "lucide-react"
import Image from "next/image"
import HeroGraphic from "./hero-graphic"

export function Hero() {
  const handleDownloadClick = () => {
    const element = document.getElementById("download")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const [uptime, setUptime] = useState(0)
  const [ping, setPing] = useState(120)

  useEffect(() => {
    // animate uptime to 99.99 quickly
    let start: number | null = null
    const duration = 900
    const from = 97.5
    const to = 99.99
    function step(ts: number) {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / duration)
      const v = from + (to - from) * t
      setUptime(Number(v.toFixed(2)))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

    // animate ping down to ~50ms
    let pstart: number | null = null
    const pduration = 1000
    const pfrom = 120
    const pto = 50
    function pstep(ts: number) {
      if (!pstart) pstart = ts
      const t = Math.min(1, (ts - pstart) / pduration)
      const v = Math.round(pfrom + (pto - pfrom) * t)
      setPing(v)
      if (t < 1) requestAnimationFrame(pstep)
    }
    requestAnimationFrame(pstep)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <PartyPopper size={16} />
              <span>USE CODE <strong className="text-accent">WELCOME10</strong> ON YOUR FIRST ORDER!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-balance leading-tight">
              NodeByte<span className="text-primary"></span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto lg:mx-0">
              Fast, reliable, scalable and secure hosting services for your gaming experience. Launch dedicated and managed game servers (Minecraft, Rust) with instant setup, DDoS protection and global low-latency networking. Scalable plans, easy control panel, and 24/7 support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 bg-card/60 border border-border rounded-lg flex flex-col gap-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Shield className="text-primary" size={18} />
                  </div>
                  <svg className="w-20 h-6" viewBox="0 0 80 20" preserveAspectRatio="none">
                    <path d="M0 12 C20 4, 40 16, 80 6" fill="none" stroke="rgba(96,165,250,0.9)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{uptime}%</div>
                  <div className="text-sm text-muted-foreground">Uptime SLA</div>
                  <div className="text-xs text-muted-foreground mt-2">Enterprise redundancy keeping your servers online.</div>
                </div>
              </div>

              <div className="p-4 bg-card/60 border border-border rounded-lg flex flex-col gap-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
                    <Zap className="text-accent" size={18} />
                  </div>
                  <svg className="w-20 h-6" viewBox="0 0 80 20" preserveAspectRatio="none">
                    <path d="M0 14 C16 6, 36 8, 80 4" fill="none" stroke="rgba(236,72,153,0.9)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">≈{ping}ms</div>
                  <div className="text-sm text-muted-foreground">Avg. Ping</div>
                  <div className="text-xs text-muted-foreground mt-2">Optimized routing and global POPs for low-latency gameplay.</div>
                </div>
              </div>

              <div className="p-4 bg-card/60 border border-border rounded-lg flex flex-col gap-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Globe className="text-primary" size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                  <div className="text-xs text-muted-foreground mt-2">Expert help with installs, mods, and server ops anytime.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[600px] hidden lg:flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl animate-glow" />
              <HeroGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}