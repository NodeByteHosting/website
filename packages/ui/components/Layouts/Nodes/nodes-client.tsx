"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import {
  Server,
  MapPin,
  Info,
  Globe,
  Network,
  Zap,
  Cpu,
  Activity,
  MemoryStick,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/packages/ui/components/ui/card"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Button } from "@/packages/ui/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/packages/ui/components/ui/accordion"
import { Alert, AlertDescription } from "@/packages/ui/components/ui/alert"
import type { PublicNode } from "@/packages/core/constants/node-types"
import { NODE_MONITOR_MAP, LOCATION_MONITOR_MAP } from "@/packages/core/constants/status-mapping"
import { useNodeStatus } from "@/packages/core/hooks/use-node-status"
import type { StatusApiMonitor } from "@/app/api/status/route"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { LINKS } from "@/packages/core/constants/links"

interface ExtendedNode extends PublicNode {
  cpu?: string
  ramType?: string
  uptime?: number
}

const STATIC_NODES: ExtendedNode[] = [
  {
    id: 1,
    name: "NEWC-GAME1",
    locationCode: "Newcastle, UK",
    isMaintenanceMode: false,
    memory: 1310089,
    disk: 1811000,
    uptime: 99.9,
  },
  {
    id: 2,
    name: "NEWY-GAME1",
    locationCode: "New York, USA",
    isMaintenanceMode: false,
    memory: 65104,
    disk: 512000,
    uptime: 99.8,
  },
  {
    id: 3,
    name: "HEL-VPS1",
    locationCode: "Helsinki, FI",
    isMaintenanceMode: false,
    memory: 65104,
    disk: 512000,
    uptime: 99.8,
  },
]

// ─── Location data ───────────────────────────────────────────────────────────

interface DataCentreLocation {
  id: string
  city: string
  area?: string      // datacenter suburb / campus name
  country: string
  flag: string
  region: "Europe" | "Americas" | "Asia-Pacific"
  primary?: boolean
}

const LOCATIONS: DataCentreLocation[] = [
  // Europe — United Kingdom
  { id: "ncl", city: "Newcastle",     country: "United Kingdom", flag: "🇬🇧", region: "Europe", primary: true },
  { id: "lon", city: "London",        area: "Erith",             country: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  // Europe — France
  { id: "bor", city: "Bordeaux",      country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "cro", city: "Croix",         country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "gra", city: "Gravelines",    country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "grn", city: "Grenoble",      country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "par", city: "Paris",         country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "rbx", city: "Roubaix",       country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "sbg", city: "Strasbourg",    country: "France",         flag: "🇫🇷", region: "Europe" },
  { id: "tur", city: "Tours",         country: "France",         flag: "🇫🇷", region: "Europe" },
  // Europe — Germany
  { id: "fal", city: "Falkenstein",   area: "Limburg",           country: "Germany",        flag: "🇩🇪", region: "Europe" },
  { id: "fra", city: "Frankfurt",     country: "Germany",        flag: "🇩🇪", region: "Europe" },
  // Europe — Finland
  { id: "hel", city: "Helsinki",      country: "Finland",        flag: "🇫🇮", region: "Europe", primary: true },
  // Europe — Italy
  { id: "mil", city: "Milan",         country: "Italy",          flag: "🇮🇹", region: "Europe" },
  // Europe — Poland
  { id: "waw", city: "Warsaw",        area: "Ożarów",            country: "Poland",         flag: "🇵🇱", region: "Europe" },
  // Americas — Canada
  { id: "bhs", city: "Montréal",      area: "Beauharnois",       country: "Canada",         flag: "🇨🇦", region: "Americas" },
  { id: "tor", city: "Toronto",       area: "Cambridge",         country: "Canada",         flag: "🇨🇦", region: "Americas" },
  // Americas — United States
  { id: "hil", city: "Seattle",       area: "Hillsboro, OR",     country: "United States",  flag: "🇺🇸", region: "Americas" },
  { id: "vhv", city: "Washington DC", area: "Vint Hill, VA",     country: "United States",  flag: "🇺🇸", region: "Americas" },
  { id: "newy", city: "New York",     area: "Secaucus, NJ",      country: "United States",  flag: "🇺🇸", region: "Americas" },
  // Asia-Pacific
  { id: "sgp", city: "Singapore",     country: "Singapore",      flag: "🇸🇬", region: "Asia-Pacific" },
  { id: "syd", city: "Sydney",        country: "Australia",      flag: "🇦🇺", region: "Asia-Pacific" },
  { id: "mum", city: "Mumbai",        country: "India",          flag: "🇮🇳", region: "Asia-Pacific" },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatSize(mib: number): string {
  if (mib >= 1024 * 1024) return `${(mib / 1024 / 1024).toFixed(1)} TB`
  if (mib >= 1024) return `${(mib / 1024).toFixed(0)} GB`
  return `${mib} MiB`
}

const LIVE_STATE_STYLES: Record<string, { label: string; dot: string; border: string; badge: string }> = {
  up: { label: "Online", dot: "bg-green-400 animate-pulse", border: "hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5", badge: "border-green-500/30 text-green-400 bg-green-500/5" },
  degraded: { label: "Degraded", dot: "bg-amber-400", border: "hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5", badge: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
  maintenance: { label: "Maintenance", dot: "bg-amber-400", border: "hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5", badge: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
  down: { label: "Offline", dot: "bg-red-400", border: "hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5", badge: "border-red-500/30 text-red-400 bg-red-500/5" },
}

function resolveNodeState(node: ExtendedNode, live: StatusApiMonitor | null) {
  if (live && live.status in LIVE_STATE_STYLES) {
    return LIVE_STATE_STYLES[live.status]
  }
  return node.isMaintenanceMode
    ? { label: "Maintenance", dot: "bg-amber-400", border: "hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5", badge: "border-amber-500/30 text-amber-400 bg-amber-500/5" }
    : { label: "Online", dot: "bg-green-400 animate-pulse", border: "hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5", badge: "border-green-500/30 text-green-400 bg-green-500/5" }
}

function groupByCountry(locations: DataCentreLocation[]) {
  const map = new Map<string, DataCentreLocation[]>()
  for (const loc of locations) {
    if (!map.has(loc.country)) map.set(loc.country, [])
    map.get(loc.country)!.push(loc)
  }
  return Array.from(map.entries()).map(([country, locs]) => ({
    country,
    flag: locs[0].flag,
    locations: locs,
  }))
}


function NodeCard({ node, live }: { node: ExtendedNode; live: StatusApiMonitor | null }) {
  const state = resolveNodeState(node, live)
  const uptime = live?.uptime30dPct ?? node.uptime

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300",
        state.border,
        state.label !== "Online" && "opacity-80",
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", state.dot.includes("green") ? "bg-green-500" : state.dot.includes("red") ? "bg-red-500" : "bg-amber-500")} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
              state.label === "Online" ? "bg-green-500/10 text-green-400" : state.label === "Offline" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400",
            )}>
              <Server className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold font-mono truncate">{node.name}</CardTitle>
              {node.locationCode && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{node.locationCode}</span>
                </div>
              )}
            </div>
          </div>
          <Badge variant="outline" className={cn("shrink-0 gap-1.5 text-xs", state.badge)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", state.dot)} />
            {state.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-0">
        {node.cpu && (
          <div className="flex items-center justify-between text-xs gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <Cpu className="w-3 h-3" /> CPU
            </span>
            <span className="font-mono font-medium text-right truncate">{node.cpu}</span>
          </div>
        )}
        {node.ramType && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <MemoryStick className="w-3 h-3" /> RAM Type
            </span>
            <span className="font-mono font-medium">{node.ramType}</span>
          </div>
        )}
        {live?.latency && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <Zap className="w-3 h-3" /> Ping
            </span>
            <span className="font-mono font-medium">{live.latency.avg}ms avg</span>
          </div>
        )}
        {uptime !== undefined && uptime !== null && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <Activity className="w-3 h-3" /> Uptime
            </span>
            <span className={cn("font-mono font-medium", uptime >= 99.9 ? "text-green-400" : "text-amber-400")}>
              {uptime.toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── LocationCountryRow ──────────────────────────────────────────────────────

function LocationCountryRow({
  country,
  flag,
  locations,
  findMonitor,
}: {
  country: string
  flag: string
  locations: DataCentreLocation[]
  findMonitor: (name: string) => StatusApiMonitor | null
}) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-border/70 hover:bg-card/40 transition-all duration-200">
      <span className="text-2xl leading-none mt-0.5 select-none shrink-0">{flag}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground mb-2">{country}</p>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => {
            const monitorName = LOCATION_MONITOR_MAP[loc.id]
            const live = monitorName ? findMonitor(monitorName) : null
            const liveState = live ? LIVE_STATE_STYLES[live.status] : null
            return (
              <span
                key={loc.id}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border",
                  loc.primary
                    ? "border-primary/40 text-primary bg-primary/8 font-medium"
                    : "border-border/50 text-muted-foreground bg-muted/30",
                )}
              >
                {liveState && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", liveState.dot)} />}
                {loc.city}
                {loc.area && <span className="opacity-50">· {loc.area}</span>}
                {loc.primary && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "Where can I deploy my server?",
    answer:
      `We offer hosting across ${LOCATIONS.length} data centre locations in Europe (UK, France, Germany, Finland, Italy, Poland), the Americas (Canada, United States), and Asia-Pacific (Singapore, Australia, India). All game server and VPS plans let you select your preferred location at checkout.`,
  },
  {
    question: "Which location is best for me?",
    answer:
      "Choose the location closest to you or the majority of your users. For UK and European customers, Newcastle, London, or Paris work well. For North America, Montréal (Canada East) or Washington DC (US East) are great options. Singapore or Mumbai cover South and Southeast Asia, and Sydney covers Australia and Oceania.",
  },
  {
    question: "Can I change my server location after ordering?",
    answer:
      "Location changes after ordering require a fresh deployment. Open a support ticket and our team will help migrate your server to a new node in your preferred location.",
  },
  {
    question: "What does \u2018Maintenance\u2019 mean for a node?",
    answer:
      "When a node is in maintenance mode it is temporarily unavailable for new deployments while we perform scheduled upgrades or hardware work. Existing servers may be paused or migrated during this time. Affected customers are always notified in advance.",
  },
  {
    question: "How do you choose which node my server runs on?",
    answer:
      "After you select a data centre location at checkout, we automatically assign your server to the best available node in that location based on current capacity and load. You cannot select a specific node directly.",
  },
  {
    question: "Is DDoS protection included?",
    answer:
      "Yes. All services include DDoS protection as standard. Our mitigation automatically detects and absorbs attacks to keep your server online and running smoothly.",
  },
]

// ─── Main export ─────────────────────────────────────────────────────────────

export function NodesClient() {
  const nodes = STATIC_NODES
  const { findMonitor } = useNodeStatus()
  const nodeLiveStates = nodes.map((node) => {
    const monitorName = NODE_MONITOR_MAP[node.name]
    return monitorName ? findMonitor(monitorName) : null
  })
  const onlineCount = nodeLiveStates.filter(
    (live, i) => (live ? live.status === "up" : !nodes[i].isMaintenanceMode),
  ).length
  const maintenanceCount = nodes.length - onlineCount
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false)

  return (
    <div className="relative overflow-hidden">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 text-foreground/[0.02] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_10%,black_40%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 70% 25%, hsl(var(--primary) / 0.08) 0%, transparent 100%), radial-gradient(ellipse 42% 35% at 25% 60%, hsl(var(--accent) / 0.08) 0%, transparent 100%)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 sm:pt-36 pb-24 sm:pb-32 space-y-20">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Network className="w-4 h-4" />
            <span>Hosting Infrastructure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Nodes &{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Locations
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Our active server nodes and every data centre location available at checkout.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {[
              { label: "Total Nodes", value: nodes.length },
              { label: "Online", value: onlineCount, color: "text-green-400" },
              { label: "In Maintenance", value: maintenanceCount, color: "text-amber-400" },
              { label: "Data Center Partners", value: "10+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={cn("text-2xl font-bold tabular-nums", stat.color)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Node grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border/40" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-primary" />
              Active Nodes
            </p>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {nodes.map((node, i) => (
              <NodeCard key={node.id} node={node} live={nodeLiveStates[i]} />
            ))}
          </div>
        </section>

        {/* ── Locations */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Globe className="w-4 h-4" />
              <span>Available Locations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Deploy Anywhere{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Globally
              </span>
            </h2>
            <p className="text-muted-foreground">
              {LOCATIONS.length} data centre locations across 3 regions. Select your preferred location at checkout.
            </p>
          </div>

          {(["Europe", "Americas", "Asia-Pacific"] as const).map((region) => {
            const regionLocs = LOCATIONS.filter((l) => l.region === region)
            const countryGroups = groupByCountry(regionLocs)
            return (
              <div key={region} className="max-w-4xl mx-auto space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/30" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {region} &middot; {regionLocs.length} location{regionLocs.length !== 1 && "s"}
                  </p>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
                <div className="space-y-2">
                  {countryGroups.map(({ country, flag, locations }) => (
                    <LocationCountryRow
                      key={country}
                      country={country}
                      flag={flag}
                      locations={locations}
                      findMonitor={findMonitor}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Info className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Common{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-muted-foreground">
              Everything about our nodes and choosing the right location for your service.
            </p>
          </div>

          {hydrated ? (
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${i}`}
                  className="border border-border/50 rounded-xl px-5 bg-card/30 backdrop-blur-sm data-[state=open]:border-primary/30 data-[state=open]:bg-card/50"
                >
                  <AccordionTrigger className="text-left text-sm font-medium py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={faq.question} className="border border-border/50 rounded-xl px-5 h-[52px] bg-card/30 animate-pulse" />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Zap className="w-4 h-4" />
            <span>Get Started</span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Ready to deploy? Browse our plans and pick your preferred location at checkout.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="default" size="lg" className="gap-2 rounded-full">
              <Link href="/games">Game Hosting</Link>
            </Button>
            <Button asChild variant="default" size="lg" className="gap-2 rounded-full">
              <Link href="/vps">VPS Hosting</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-full">
              <Link href={LINKS.discord} target="_blank" rel="noopener noreferrer">
                Join Discord
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <a href={LINKS.status} target="_blank" rel="noopener noreferrer">
                View Status Page
              </a>
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
