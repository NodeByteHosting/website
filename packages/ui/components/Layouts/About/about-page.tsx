"use client"

import { Card } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { 
  Users, 
  Heart, 
  Code, 
  Gamepad2, 
  Sparkles, 
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Server,
  Clock,
  MessageCircle,
  Github,
  Twitter
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Logo } from "@/packages/ui/components/logo"

export function AboutPage() {
  const t = useTranslations()

  const values = [
    {
      icon: Gamepad2,
      title: t("aboutPage.values.players.title"),
      description: t("aboutPage.values.players.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code,
      title: t("aboutPage.values.community.title"),
      description: t("aboutPage.values.community.description"),
      gradient: "from-orange-500 to-rose-500",
    },
    {
      icon: Sparkles,
      title: t("aboutPage.values.open.title"),
      description: t("aboutPage.values.open.description"),
      gradient: "from-violet-500 to-blue-500",
    },
  ]

  const displayStats = [
    { value: "99.6%", label: t("aboutPage.stats.uptime"), icon: Server },
    { value: "50ms", label: t("aboutPage.stats.latency"), icon: Zap },
    { value: "24/7", label: t("aboutPage.stats.support"), icon: Clock },
    { value: "1000+", label: t("aboutPage.stats.servers"), icon: Globe },
  ]

  const timeline = [
    {
      year: "2024",
      title: t("aboutPage.timeline.founded.title"),
      description: t("aboutPage.timeline.founded.description"),
    },
    {
      year: "Q1/2 - 2025",
      title: t("aboutPage.timeline.growth.title"),
      description: t("aboutPage.timeline.growth.description"),
    },
    {
      year: "Q3/4 - 2025",
      title: t("aboutPage.timeline.expansion.title"),
      description: t("aboutPage.timeline.expansion.description"),
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Heart className="w-4 h-4" />
              <span>{t("aboutPage.badge")}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("aboutPage.hero.title")}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("aboutPage.hero.titleHighlight")}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("aboutPage.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full gap-2" asChild>
                <Link href="https://discord.gg/wN58bTzzpW" target="_blank">
                  <MessageCircle className="w-5 h-5" />
                  {t("aboutPage.hero.joinCommunity")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
                <Link href="/contact">
                  {t("aboutPage.hero.contactUs")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-accent/2 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
                <Sparkles className="w-4 h-4" />
                <span>{t("aboutPage.story.badge")}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {t("aboutPage.story.title")}
              </h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("aboutPage.story.paragraph1")}</p>
                <p>{t("aboutPage.story.paragraph2")}</p>
                <p>{t("aboutPage.story.paragraph3")}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {displayStats.map((stat) => (
                <Card
                  key={stat.label}
                  className={cn(
                    "p-6 border-border/50 bg-card/30 backdrop-blur-sm text-center",
                    "hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                  )}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-primary/2 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Heart className="w-4 h-4" />
              <span>{t("aboutPage.values.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("aboutPage.values.title")}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("aboutPage.values.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("aboutPage.values.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className={cn(
                  "group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm",
                  "hover:border-primary/30 transition-all duration-300"
                )}
              >
                <div className={cn("h-1.5 bg-linear-to-r", value.gradient)} />
                
                <div className="p-6 sm:p-8">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center mb-4 text-white",
                    value.gradient
                  )}>
                    <value.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-accent/2 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
              <Clock className="w-4 h-4" />
              <span>{t("aboutPage.timeline.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("aboutPage.timeline.title")}{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("aboutPage.timeline.titleHighlight")}
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border sm:-translate-x-1/2" />
              
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={cn(
                    "relative pl-12 sm:pl-0 pb-12 last:pb-0",
                    index % 2 === 0 ? "sm:pr-1/2 sm:text-right" : "sm:pl-1/2 sm:ml-auto"
                  )}
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-2.5 sm:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background sm:-translate-x-1/2",
                    "top-1"
                  )} />
                  
                  <Card className={cn(
                    "p-6 border-border/50 bg-card/30 backdrop-blur-sm inline-block",
                    "hover:border-primary/30 transition-all duration-300",
                    index % 2 === 0 ? "sm:mr-8" : "sm:ml-8"
                  )}>
                    <div className="text-sm font-semibold text-primary mb-1">{item.year}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-accent/2 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="max-w-4xl mx-auto border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-linear-to-r from-primary via-accent to-primary" />
            <div className="p-8 sm:p-12 text-center">
              <Logo size={64} className="mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t("aboutPage.cta.title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                {t("aboutPage.cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full gap-2" asChild>
                  <Link href="/games">
                    {t("aboutPage.cta.getStarted")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full gap-2" asChild>
                  <Link href="https://discord.gg/wN58bTzzpW" target="_blank">
                    <MessageCircle className="w-5 h-5" />
                    {t("aboutPage.cta.joinDiscord")}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
