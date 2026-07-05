"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Rocket, Gamepad2, CreditCard, Users, Shield, Settings,
  HelpCircle, Server, FileText, Blocks, Wrench, BookOpen, Network,
  ChevronDown, type LucideIcon,
} from "lucide-react"
import { cn } from "@/packages/core/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/packages/ui/components/ui/collapsible"
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area"
import { useState } from "react"
import type { SidebarItem } from "@/packages/kb/lib/kb"

const iconMap: Record<string, LucideIcon> = {
  Rocket, Gamepad2, CreditCard, Users, Shield, Settings,
  HelpCircle, Server, FileText, Blocks, Wrench, BookOpen, Network,
}

// Re-export for backward compatibility
export type { SidebarItem as SidebarCategory }

interface KBSidebarProps {
  categories: SidebarItem[]
  className?: string
}

// ─── Recursive node renderer ──────────────────────────────────────────────────

interface SidebarNodeProps {
  item: SidebarItem
  pathname: string
  depth?: number
}

function SidebarNode({ item, pathname, depth = 0 }: SidebarNodeProps) {
  const Icon = iconMap[item.icon] ?? HelpCircle
  const categoryPrefix = `/kb/${item.path}`
  const isCategoryActive = pathname.startsWith(categoryPrefix)

  const [isOpen, setIsOpen] = useState(() => isCategoryActive)

  const sortedArticles = item.articles.toSorted((a, b) => a.order - b.order)
  const sortedSubs = item.subcategories.toSorted((a, b) => a.order - b.order)
  const hasChildren = sortedArticles.length > 0 || sortedSubs.length > 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground",
          depth > 0 && "text-sm font-medium",
          isCategoryActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
        )}
        style={{ paddingLeft: depth > 0 ? `${0.75 + depth * 0.75}rem` : undefined }}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.title}</span>
        </span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        )}
      </CollapsibleTrigger>

      {hasChildren && (
        <CollapsibleContent className="pt-0.5">
          <ul
            className="ml-4 space-y-0.5 border-l border-border/70 pl-2"
            style={{ marginLeft: depth > 0 ? `${1 + depth * 0.75}rem` : undefined }}
          >
            {/* Subcategories first */}
            {sortedSubs.map((sub) => (
              <li key={sub.slug}>
                <SidebarNode item={sub} pathname={pathname} depth={depth + 1} />
              </li>
            ))}

            {/* Then direct articles */}
            {sortedArticles.map((article) => {
              const articlePath = `/kb/${article.categoryPath}/${article.slug}`
              const isActive = pathname === articlePath

              return (
                <li key={article.slug}>
                  <Link
                    href={articlePath}
                    className={cn(
                      "flex min-h-8 items-center gap-2 rounded-md px-3 py-1.5 text-sm leading-snug transition-colors",
                      "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-2">{article.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function KBSidebar({ categories, className }: KBSidebarProps) {
  const pathname = usePathname()
  const sorted = categories.toSorted((a, b) => a.order - b.order)

  return (
    <ScrollArea className={cn("h-[calc(100vh-8rem)]", className)}>
      <nav className="space-y-1 pr-3">
        {sorted.map((category) => (
          <SidebarNode key={category.slug} item={category} pathname={pathname} />
        ))}
      </nav>
    </ScrollArea>
  )
}

export default KBSidebar
