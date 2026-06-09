"use client"

import { useState, useEffect } from "react"
import { RefreshCw, SearchX } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/packages/ui/components/ui/card"
import { Button } from "@/packages/ui/components/ui/button"
import { Skeleton } from "@/packages/ui/components/ui/skeleton"
import { ChangelogCard } from "./changelog-card"
import { ChangelogStats } from "./changelog-stats"
import { ChangelogPagination } from "./changelog-pagination"
import { ChangelogSearch } from "./changelog-search"
import { ChangelogFilters } from "./changelog-filters"
import { useChangelogReleases } from "../hooks/use-changelog"
import { filterReleases, type ChangelogFilters as Filters } from "../lib/changelog"
import { cn } from "@/packages/core/lib/utils"

interface ChangelogListProps {
  className?: string
}

const ITEMS_PER_PAGE = 4

export function ChangelogList({ className }: ChangelogListProps) {
  const t = useTranslations()
  const { releases, repositories, isLoading, error, lastUpdated, refetch } = useChangelogReleases()

  const [filters, setFilters] = useState<Filters>({
    search: "",
    repository: null,
    type: null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [linkedReleaseId, setLinkedReleaseId] = useState<string | null>(null)

  const filteredReleases = filterReleases(releases, filters)

  const totalPages = Math.ceil(filteredReleases.length / ITEMS_PER_PAGE)
  const safePage = Math.min(currentPage, Math.max(1, totalPages))
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedReleases = filteredReleases.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Handle URL hash for direct release linking
  useEffect(() => {
    if (releases.length === 0) return
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const releaseIndex = filteredReleases.findIndex(
      r => `${r.repository.name}-${r.tag_name}` === hash || r.tag_name === hash
    )
    if (releaseIndex === -1) return
    const page = Math.floor(releaseIndex / ITEMS_PER_PAGE) + 1
    queueMicrotask(() => {
      setLinkedReleaseId(hash)
      setCurrentPage(page)
    })
  }, [releases, filteredReleases])

  // Scroll to linked release when linkedReleaseId changes
  useEffect(() => {
    if (!linkedReleaseId) return
    const timer = setTimeout(() => {
      const element = document.getElementById(linkedReleaseId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [linkedReleaseId])

  const handleClearFilters = () => {
    setFilters({ search: "", repository: null, type: null })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[160px]" />
          </div>
        </div>

        {/* Release cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("", className)}>
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
              <RefreshCw className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("changelog.error.title")}</h3>
            <p className="text-muted-foreground mb-4">{t("changelog.error.description")}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("changelog.error.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <ChangelogStats totalReleases={releases.length} repositories={repositories} lastUpdated={lastUpdated} />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ChangelogSearch
          value={filters.search}
          onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
          placeholder={t("changelog.searchPlaceholder")}
          className="flex-1 max-w-md"
        />
        <ChangelogFilters
          repositories={repositories}
          selectedRepository={filters.repository}
          selectedType={filters.type}
          onRepositoryChange={(repo) => setFilters(prev => ({ ...prev, repository: repo }))}
          onTypeChange={(type) => setFilters(prev => ({ ...prev, type: type }))}
          onClearFilters={handleClearFilters}
          translations={{
            all: t("changelog.filters.all"),
            allTypes: t("changelog.filters.allTypes"),
            feature: t("changelog.filters.feature"),
            bugfix: t("changelog.filters.bugfix"),
            improvement: t("changelog.filters.improvement"),
            breaking: t("changelog.filters.breaking"),
            security: t("changelog.filters.security"),
          }}
        />
      </div>

      {/* Releases List */}
      {filteredReleases.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-muted rounded-full mb-4">
              <SearchX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("changelog.empty.title")}</h3>
            <p className="text-muted-foreground mb-4">{t("changelog.empty.description")}</p>
            <Button onClick={handleClearFilters} variant="outline">
              {t("changelog.empty.clearFilters")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedReleases.map((release, index) => {
              const releaseAnchorId = `${release.repository.name}-${release.tag_name}`
              return (
                <ChangelogCard
                  key={release.id}
                  release={release}
                  isLatest={currentPage === 1 && index === 0 && !filters.search && !filters.repository && !filters.type}
                  isLinked={linkedReleaseId === releaseAnchorId}
                  translations={{
                    viewOnGithub: t("changelog.release.viewOnGithub"),
                    publishedOn: t("changelog.release.publishedOn"),
                    by: t("changelog.release.by"),
                    assets: t("changelog.release.assets"),
                    downloadAsset: t("changelog.release.downloadAsset"),
                    noAssets: t("changelog.release.noAssets"),
                    preRelease: t("changelog.release.preRelease"),
                    latest: t("changelog.release.latest"),
                    draft: t("changelog.release.draft"),
                    copyLink: t("changelog.copyLink"),
                    linkCopied: t("changelog.linkCopied"),
                  }}
                />
              )
            })}
          </div>

          <ChangelogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            translations={{
              previous: t("changelog.pagination.previous"),
              next: t("changelog.pagination.next"),
            }}
          />
        </>
      )}
    </div>
  )
}
