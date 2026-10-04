"use client"

import { ArrowRight, Bot, Code2, Cpu, DatabaseBackup, HardDrive, MemoryStick, PackageX, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/packages/ui/components/ui/button"
import { PlanCard as PlanCardShell, type PlanSpec } from "@/packages/ui/components/ui/plan-card"
import { PlanInfoRow } from "@/packages/ui/components/ui/plan-info-row"
import { Price } from "@/packages/ui/components/ui/price"
import type { DiscordBotPlanSpec } from "@/packages/core/types/servers/discord-bot"

function formatRam(mb: number): string {
  return mb >= 1024 ? `${Math.round((mb / 1024) * 100) / 100} GB` : `${mb} MB`
}

function formatStorage(gb: number): string {
  return gb < 1 ? `${Math.round(gb * 1024)} MB` : `${gb} GB`
}

function PlanCard({ plan }: { plan: DiscordBotPlanSpec }) {
  const specs: PlanSpec[] = [{ icon: MemoryStick, value: formatRam(plan.ramMB), label: "RAM" }]
  if (plan.vcpu != null) specs.push({ icon: Cpu, value: `${plan.vcpu}`, label: plan.vcpu === 1 ? "vCPU" : "vCPUs" })
  if (plan.storageGB != null) specs.push({ icon: HardDrive, value: formatStorage(plan.storageGB), label: "SSD Storage" })
  if (plan.backups != null) specs.push({ icon: DatabaseBackup, value: `${plan.backups}`, label: plan.backups === 1 ? "Backup" : "Backups" })

  return (
    <PlanCardShell
      name={plan.name}
      subtitle={plan.worksWith ? `Works with ${plan.worksWith}` : null}
      priceGBP={plan.priceGBP}
      prices={plan.prices}
      popular={plan.popular}
      outOfStock={plan.stock === "out_of_stock"}
      url={plan.url}
      specs={specs}
      features={[
        { icon: Shield, text: "DDoS Protection" },
        { icon: Zap, text: "Instant Setup" },
      ]}
      extra={
        plan.features.length > 0 && (
          <ul className="space-y-1.5">
            {plan.features.map((feature) => (
              <li key={feature} className="text-xs text-muted-foreground">
                {feature}
              </li>
            ))}
          </ul>
        )
      }
      infoLabel="Plan Info"
      info={
        <PlanInfoRow
          label="Setup Fee"
          value={plan.setupFeeGBP > 0 ? <Price amount={plan.setupFeeGBP} prices={plan.setupFees} /> : "None"}
        />
      }
    />
  )
}

export function DiscordBotsHub({ plans }: { plans: DiscordBotPlanSpec[] }) {
  const sorted = [...plans].sort((a, b) => a.priceGBP - b.priceGBP)

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 text-foreground/2 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_60%_at_50%_10%,black_40%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 70% 25%, hsl(var(--primary) / 0.08) 0%, transparent 100%)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 sm:pt-36 pb-24 sm:pb-32 space-y-12">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Bot className="w-4 h-4" />
            <span>Discord Bot Hosting</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Keep Your Bot{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Online 24/7
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Affordable, always-on hosting for Discord bots. Upload your code, pick your runtime, and let it run, with backups included.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Code2, text: "Node.js, Python, Java, Go & Rust" },
              { icon: Zap, text: "Instant Setup" },
              { icon: Shield, text: "DDoS Protected" },
              { icon: DatabaseBackup, text: "Backups Included" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 border border-destructive/20 rounded-2xl bg-card/20">
              <PackageX className="w-10 h-10 text-destructive/60" />
              <p className="font-medium">No bot hosting plans in stock right now</p>
              <p className="text-sm text-muted-foreground">Check back soon, or get in touch and we&apos;ll help you find a fit.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {sorted.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold">Need more power for a bigger bot?</p>
                <p className="text-sm text-muted-foreground">
                  Large or sharded bots run great on a VPS. Get in touch and we&apos;ll help you size it.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" className="gap-2 rounded-full" asChild>
                  <Link href="/vps">View VPS</Link>
                </Button>
                <Button size="sm" className="gap-2 rounded-full" asChild>
                  <Link href="/contact">Contact Us <ArrowRight className="w-3.5 h-3.5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
