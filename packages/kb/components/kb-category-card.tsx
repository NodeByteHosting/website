import Link from "next/link"
import {
  Rocket, Gamepad2, CreditCard, Users, Shield, Settings,
  HelpCircle, Server, FileText, Blocks, Wrench, BookOpen, Network,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/packages/core/lib/utils"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/packages/ui/components/ui/card"
import { Badge } from "@/packages/ui/components/ui/badge"
import type { KBCategory } from "@/packages/kb/lib/kb"

const iconMap: Record<string, LucideIcon> = {
  Rocket, Gamepad2, CreditCard, Users, Shield, Settings,
  HelpCircle, Server, FileText, Blocks, Wrench, BookOpen, Network,
}

// Re-export for callers that imported the old local Category type
export type { KBCategory as Category }

interface KBCategoryCardProps {
  category: KBCategory
  className?: string
}

export function KBCategoryCard({ category, className }: KBCategoryCardProps) {
  const Icon = iconMap[category.icon] ?? HelpCircle
  const count = category.totalCount

  return (
    <Link href={`/kb/${category.path}`}>
      <Card
        className={cn(
          "group h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1",
          className,
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-6 w-6" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {count} {count === 1 ? "article" : "articles"}
            </Badge>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {category.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-primary font-medium group-hover:underline">
            Browse articles →
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

interface KBCategoryGridProps {
  categories: KBCategory[]
  className?: string
}

export function KBCategoryGrid({ categories, className }: KBCategoryGridProps) {
  const sorted = categories.toSorted((a, b) => a.order - b.order)

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {sorted.map((category) => (
        <KBCategoryCard key={category.path} category={category} />
      ))}
    </div>
  )
}

export default KBCategoryCard
