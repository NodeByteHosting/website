import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import {
  resolvePath,
  getAllPaths,
  getCategoryAtPath,
  getArticlesByCategory,
  getArticle,
  extractHeadings,
  getSidebarTree,
  type KBCategory,
} from "@/packages/kb/lib/kb"
import { KBBreadcrumb } from "@/packages/kb/components/kb-breadcrumb"
import { KBArticleList } from "@/packages/kb/components/kb-article-card"
import { KBCategoryGrid } from "@/packages/kb/components/kb-category-card"
import { KBArticle } from "@/packages/kb/components/kb-article"
import { KBTableOfContents } from "@/packages/kb/components/kb-toc"
import { KBSidebar } from "@/packages/kb/components/kb-sidebar"
import {
  Rocket,
  Gamepad2,
  CreditCard,
  Users,
  Shield,
  Settings,
  HelpCircle,
  Server,
  FileText,
  Blocks,
  Wrench,
  BookOpen,
  Network,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Rocket, Gamepad2, CreditCard, Users, Shield, Settings,
  HelpCircle, Server, FileText, Blocks, Wrench, BookOpen, Network,
}

interface KBDynamicPageProps {
  params: Promise<{ path: string[] }>
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

async function buildBreadcrumbs(
  segments: string[],
  articleTitle?: string,
): Promise<{ label: string; href?: string }[]> {
  const items: { label: string; href?: string }[] = []

  for (let i = 0; i < segments.length; i++) {
    const isLast = i === segments.length - 1
    const partialSegments = segments.slice(0, i + 1)
    const href = isLast ? undefined : `/kb/${partialSegments.join("/")}`

    if (!isLast || resolvePath(partialSegments) === "category") {
      // Category segment — fetch its title
      const cat = await getCategoryAtPath(partialSegments)
      items.push({ label: cat?.title ?? segments[i], href })
    } else {
      // Last segment is an article — use provided title or fallback
      items.push({ label: articleTitle ?? segments[i] })
    }
  }

  return items
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const paths = getAllPaths()
  return paths.map((p) => ({ path: p }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: KBDynamicPageProps): Promise<Metadata> {
  const { path: segments } = await params
  const kind = resolvePath(segments)

  if (kind === "category") {
    const cat = await getCategoryAtPath(segments)
    if (!cat) return { title: "Not Found | Knowledge Base" }
    return {
      title: `${cat.title} | Knowledge Base`,
      description: cat.description,
    }
  }

  if (kind === "article") {
    const categoryPath = segments.slice(0, -1).join("/")
    const articleSlug = segments[segments.length - 1]
    const article = await getArticle(categoryPath, articleSlug)
    if (!article) return { title: "Not Found | Knowledge Base" }
    return {
      title: `${article.meta.title} | Knowledge Base`,
      description: article.meta.description,
      keywords: article.meta.tags,
    }
  }

  return { title: "Not Found | Knowledge Base" }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function KBDynamicPage({ params }: KBDynamicPageProps) {
  const { path: segments } = await params
  const kind = resolvePath(segments)

  if (kind === null) notFound()

  // ── Category page ──────────────────────────────────────────────────────────
  if (kind === "category") {
    const [t, categoryData, articles] = await Promise.all([
      getTranslations(),
      getCategoryAtPath(segments),
      getArticlesByCategory(segments.join("/")),
    ])

    if (!categoryData) notFound()

    const breadcrumbs = await buildBreadcrumbs(segments)
    const Icon = iconMap[categoryData.icon] ?? HelpCircle

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <KBBreadcrumb items={breadcrumbs} className="mb-8" />

          {/* Category header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {categoryData.title}
                </h1>
                {categoryData.description && (
                  <p className="text-muted-foreground mt-1">{categoryData.description}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {categoryData.totalCount} {t("kb.articles")}
            </p>
          </div>

          {/* Subcategories */}
          {categoryData.subcategories.length > 0 && (
            <section className="mb-10">
              {articles.length > 0 && (
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
              )}
              <KBCategoryGrid categories={categoryData.subcategories} />
            </section>
          )}

          {/* Direct articles */}
          {articles.length > 0 && (
            <section>
              {categoryData.subcategories.length > 0 && (
                <h2 className="text-xl font-semibold mb-4">Articles</h2>
              )}
              <KBArticleList articles={articles} />
            </section>
          )}

          {/* Empty state */}
          {articles.length === 0 && categoryData.subcategories.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("kb.empty.title")}</h3>
              <p className="text-muted-foreground">{t("kb.empty.description")}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Article page ───────────────────────────────────────────────────────────
  const categorySegments = segments.slice(0, -1)
  const articleSlug = segments[segments.length - 1]
  const categoryPath = categorySegments.join("/")

  const [t, articleData, sidebarTree, articlesInCategory] = await Promise.all([
    getTranslations(),
    getArticle(categoryPath, articleSlug),
    getSidebarTree(),
    getArticlesByCategory(categoryPath),
  ])

  if (!articleData) notFound()

  const breadcrumbs = await buildBreadcrumbs(segments, articleData.meta.title)
  const headings = extractHeadings(articleData.content)

  const sortedArticles = articlesInCategory.toSorted((a, b) => a.order - b.order)
  const currentIndex = sortedArticles.findIndex((a) => a.slug === articleSlug)
  const previousArticle = currentIndex > 0
    ? { slug: sortedArticles[currentIndex - 1].slug, categoryPath, title: sortedArticles[currentIndex - 1].title }
    : null
  const nextArticle = currentIndex < sortedArticles.length - 1
    ? { slug: sortedArticles[currentIndex + 1].slug, categoryPath, title: sortedArticles[currentIndex + 1].title }
    : null

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <KBBreadcrumb items={breadcrumbs} className="mb-8" />

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <KBSidebar categories={sidebarTree} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <KBArticle
              meta={{ ...articleData.meta, readingTime: articleData.readingTime }}
              content={articleData.content}
              previousArticle={previousArticle}
              nextArticle={nextArticle}
              translations={{
                minRead: t("kb.minRead"),
                updated: t("kb.updated"),
                previous: t("kb.previous"),
                next: t("kb.next"),
              }}
            />
          </main>

          {/* Table of contents */}
          {headings.length > 2 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                <KBTableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
