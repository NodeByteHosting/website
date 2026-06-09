"use client"

import { Rocket, GitBranch, Calendar } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/packages/ui/components/ui/card"
import { formatRelativeTime } from "../lib/changelog"

interface ChangelogStatsProps {
  totalReleases: number
  repositories: string[]
  lastUpdated: string | null
}

export function ChangelogStats({ totalReleases, repositories, lastUpdated }: ChangelogStatsProps) {
  const t = useTranslations()

  const stats = [
    {
      icon: Rocket,
      label: t("changelog.stats.totalReleases"),
      value: totalReleases.toString(),
    },
    {
      icon: GitBranch,
      label: t("changelog.stats.repositories"),
      value: repositories.length.toString(),
    },
    {
      icon: Calendar,
      label: t("changelog.stats.latestUpdate"),
      value: lastUpdated ? formatRelativeTime(lastUpdated) : '-',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
