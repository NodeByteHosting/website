"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Download, ChevronDown, ChevronUp, Tag, GitBranch, User, Calendar, Package, Link2, Check } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardHeader } from "@/packages/ui/components/ui/card"
import { Badge } from "@/packages/ui/components/ui/badge"
import { Button } from "@/packages/ui/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/packages/ui/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui/components/ui/tooltip"
import { cn } from "@/packages/core/lib/utils"
import { type ChangelogRelease, extractSummary, formatFileSize, formatRelativeTime } from "../lib/changelog"

interface ChangelogCardProps {
  release: ChangelogRelease
  translations: {
    viewOnGithub: string
    publishedOn: string
    by: string
    assets: string
    downloadAsset: string
    noAssets: string
    preRelease: string
    latest: string
    draft: string
    copyLink: string
    linkCopied: string
  }
  isLatest?: boolean
  isLinked?: boolean
  className?: string
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  feature: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  bugfix: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
  improvement: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  breaking: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  security: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
}

const TYPE_LABELS: Record<string, string> = {
  feature: 'Feature',
  bugfix: 'Bug Fix',
  improvement: 'Improvement',
  breaking: 'Breaking',
  security: 'Security',
}

export function ChangelogCard({ release, translations, isLatest, isLinked, className }: ChangelogCardProps) {
  const [showAssets, setShowAssets] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [userExpanded, setUserExpanded] = useState(false)
  
  const summary = extractSummary(release.body)
  const hasLongBody = (release.body?.length || 0) > 300
  const typeColor = TYPE_COLORS[release.type || 'improvement']
  const publishedDate = new Date(release.published_at || release.created_at)
  
  const anchorId = `${release.repository.name}-${release.tag_name}`

  const expanded = userExpanded || (isLinked ?? false)

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${anchorId}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <Card id={anchorId} className={cn("transition-all hover:shadow-md scroll-mt-24", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Repository & Version */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link 
                href={release.repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>{release.repository.name}</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>{release.tag_name}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {linkCopied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{linkCopied ? translations.linkCopied : translations.copyLink}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold leading-tight">
              <a href={`#${anchorId}`} className="hover:text-primary transition-colors">
                {release.name || release.tag_name}
              </a>
            </h3>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isLatest && (
              <Badge variant="default" className="bg-primary">
                {translations.latest}
              </Badge>
            )}
            {release.prerelease && (
              <Badge variant="secondary">
                {translations.preRelease}
              </Badge>
            )}
            {release.draft && (
              <Badge variant="outline">
                {translations.draft}
              </Badge>
            )}
            {release.type && (
              <Badge 
                variant="secondary" 
                className={cn(typeColor.bg, typeColor.text, "border-0")}
              >
                {TYPE_LABELS[release.type]}
              </Badge>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={release.author.avatar_url} alt={release.author.login} />
              <AvatarFallback>{release.author.login[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{release.author.login}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span title={publishedDate.toLocaleDateString()}>
              {formatRelativeTime(release.published_at || release.created_at)}
            </span>
          </div>
          {release.assets.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span>{release.assets.length} {translations.assets.toLowerCase()}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary/Body */}
        {release.body && (
          <div className="mb-4 overflow-hidden">
            <div className={cn(
              "prose prose-sm dark:prose-invert max-w-none overflow-hidden",
              "prose-headings:font-semibold prose-headings:tracking-tight",
              "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
              "prose-p:text-muted-foreground prose-p:leading-relaxed",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:break-all",
              "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-code:break-all",
              "prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:max-w-full",
              "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
              "prose-strong:text-foreground",
              "[&_*]:break-words [&_a]:break-all",
              !expanded && hasLongBody && "line-clamp-4"
            )}>
              {expanded ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {release.body}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-muted-foreground">{summary}</p>
              )}
            </div>
            {hasLongBody && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserExpanded((v) => !v)}
                className="mt-2 h-7 px-2 text-xs"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show more
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Assets */}
        {release.assets.length > 0 && (
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAssets(!showAssets)}
              className="h-8 px-2 text-sm font-medium"
            >
              <Package className="h-4 w-4 mr-2" />
              {translations.assets} ({release.assets.length})
              {showAssets ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>

            {showAssets && (
              <div className="mt-3 space-y-2">
                {release.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(asset.size)} • {asset.download_count} downloads
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="ml-2 shrink-0"
                    >
                      <a 
                        href={asset.browser_download_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View on GitHub */}
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={release.html_url} target="_blank" rel="noopener noreferrer">
              {translations.viewOnGithub}
              <ExternalLink className="h-3.5 w-3.5 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
