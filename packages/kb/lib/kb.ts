// Knowledge Base markdown processing utilities
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import readingTime from 'reading-time'
import fs from 'fs'
import path from 'path'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KBArticleMeta {
  slug: string
  title: string
  description: string
  /** Immediate parent category display name */
  category: string
  /** Immediate parent directory name (last segment of categoryPath) */
  categorySlug: string
  /** Full relative path from content root, e.g. "games/minecraft" */
  categoryPath: string
  tags?: string[]
  author?: string
  lastUpdated: string
  readingTime: number
  excerpt?: string
  order: number
}

export interface KBArticle {
  meta: {
    title: string
    description: string
    tags?: string[]
    author?: string
    lastUpdated?: string
  }
  content: string
  readingTime: number
}

export interface KBCategory {
  slug: string
  /** Full relative path from content root, e.g. "games/minecraft" */
  path: string
  /** Parent path, empty string for top-level categories */
  parentPath: string
  title: string
  description: string
  icon: string
  order: number
  /** Direct article count (not counting subcategory articles) */
  articleCount: number
  /** Total article count including all subcategories (recursive) */
  totalCount: number
  subcategories: KBCategory[]
}

/** Sidebar node — category with articles and nested subcategories */
export interface SidebarItem {
  slug: string
  path: string
  title: string
  icon: string
  order: number
  articles: { slug: string; title: string; order: number; categoryPath: string }[]
  subcategories: SidebarItem[]
}

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

// ─── Config ───────────────────────────────────────────────────────────────────

const KB_CONTENT_PATH = path.join(process.cwd(), 'packages', 'kb', 'content')

// ─── Markdown processing ──────────────────────────────────────────────────────

export async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor-link'] },
    })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  return result.toString()
}

export function extractHeadings(html: string): TableOfContentsItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>(?:<a[^>]*>)?([^<]*)/g
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    const text = match[3].trim()
    if (id && text) headings.push({ id, text, level })
  }

  return headings
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function readMeta(absDir: string): { title?: string; description?: string; icon?: string; order?: number } {
  const metaPath = path.join(absDir, '_meta.json')
  if (!fs.existsSync(metaPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  } catch {
    return {}
  }
}

// ─── Category tree ────────────────────────────────────────────────────────────

/**
 * Returns categories at `parentPath` (relative to content root).
 * Each category recursively includes its subcategories.
 * Pass no argument to get top-level categories.
 */
export async function getCategories(parentPath = ''): Promise<KBCategory[]> {
  const baseAbs = parentPath
    ? path.join(KB_CONTENT_PATH, ...parentPath.split('/'))
    : KB_CONTENT_PATH

  if (!fs.existsSync(baseAbs)) return []

  const dirs = fs.readdirSync(baseAbs, { withFileTypes: true }).filter(d => d.isDirectory())
  const categories: KBCategory[] = []

  for (const dir of dirs) {
    const catPath = parentPath ? `${parentPath}/${dir.name}` : dir.name
    const catAbs = path.join(baseAbs, dir.name)
    const fileMeta = readMeta(catAbs)

    const meta = {
      title: fileMeta.title ?? titleFromSlug(dir.name),
      description: fileMeta.description ?? '',
      icon: fileMeta.icon ?? 'FileText',
      order: fileMeta.order ?? 999,
    }

    const directArticleCount = fs.readdirSync(catAbs)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx')).length

    const subcategories = await getCategories(catPath)
    const totalCount = directArticleCount + subcategories.reduce((s, c) => s + c.totalCount, 0)

    categories.push({
      slug: dir.name,
      path: catPath,
      parentPath,
      ...meta,
      articleCount: directArticleCount,
      totalCount,
      subcategories,
    })
  }

  return categories.sort((a, b) => (a.order || 999) - (b.order || 999))
}

/**
 * Find the category node for a given path like ["games", "minecraft"].
 * Returns null if not found.
 */
export async function getCategoryAtPath(segments: string[]): Promise<KBCategory | null> {
  if (segments.length === 0) return null

  const categories = await getCategories()
  let current: KBCategory | undefined = categories.find(c => c.slug === segments[0])

  for (let i = 1; i < segments.length; i++) {
    if (!current) return null
    current = current.subcategories.find(c => c.slug === segments[i])
  }

  return current ?? null
}

// ─── Articles ─────────────────────────────────────────────────────────────────

/**
 * Returns direct articles in a category (not recursing into subcategories).
 * `categoryPath` is the full relative path, e.g. "games/minecraft".
 */
export async function getArticlesByCategory(categoryPath: string): Promise<KBArticleMeta[]> {
  const catAbs = path.join(KB_CONTENT_PATH, ...categoryPath.split('/'))

  if (!fs.existsSync(catAbs)) return []

  const files = fs.readdirSync(catAbs).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  const categorySlug = categoryPath.split('/').pop() ?? categoryPath
  const fileMeta = readMeta(catAbs)
  const categoryTitle = fileMeta.title ?? titleFromSlug(categorySlug)

  const articles: KBArticleMeta[] = []

  for (const file of files) {
    const filePath = path.join(catAbs, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    const stats = readingTime(fileContent)
    const slug = file.replace(/\.mdx?$/, '')

    const excerpt = content
      .replace(/^#.*$/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/[*_`\[\]]/g, '')
      .trim()
      .slice(0, 200)

    articles.push({
      slug,
      title: data.title || titleFromSlug(slug),
      description: data.description || '',
      category: categoryTitle,
      categorySlug,
      categoryPath,
      tags: data.tags || [],
      author: data.author,
      lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
      readingTime: Math.ceil(stats.minutes),
      excerpt,
      order: data.order ?? 999,
    })
  }

  return articles.sort((a, b) => (a.order || 999) - (b.order || 999))
}

/**
 * Returns a single article.
 * `categoryPath` is the full relative path, e.g. "games/minecraft".
 */
export async function getArticle(categoryPath: string, articleSlug: string): Promise<KBArticle | null> {
  const catAbs = path.join(KB_CONTENT_PATH, ...categoryPath.split('/'))

  let filePath = path.join(catAbs, `${articleSlug}.md`)
  if (!fs.existsSync(filePath)) filePath = path.join(catAbs, `${articleSlug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const stats = readingTime(fileContent)
  const htmlContent = await processMarkdown(content)

  return {
    meta: {
      title: data.title || titleFromSlug(articleSlug),
      description: data.description || '',
      tags: data.tags || [],
      author: data.author,
      lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
    },
    content: htmlContent,
    readingTime: Math.ceil(stats.minutes),
  }
}

/**
 * Returns all articles across all categories and subcategories (recursive).
 * Used for search and the "recently updated" list.
 */
export async function getAllArticles(parentPath = ''): Promise<KBArticleMeta[]> {
  const categories = await getCategories(parentPath)
  const results: KBArticleMeta[] = []

  for (const cat of categories) {
    const direct = await getArticlesByCategory(cat.path)
    results.push(...direct)
    if (cat.subcategories.length > 0) {
      const nested = await getAllArticles(cat.path)
      results.push(...nested)
    }
  }

  return results
}

// ─── Path resolution ──────────────────────────────────────────────────────────

/**
 * Determines what a URL path points to.
 * Returns "category" if the path is a directory, "article" if it's a markdown file, null otherwise.
 */
export function resolvePath(segments: string[]): 'category' | 'article' | null {
  if (segments.length === 0) return 'category'

  const absPath = path.join(KB_CONTENT_PATH, ...segments)
  if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) return 'category'

  // Check as article: all-but-last = category dir, last = slug
  const categoryAbs = segments.length > 1
    ? path.join(KB_CONTENT_PATH, ...segments.slice(0, -1))
    : KB_CONTENT_PATH
  const slug = segments[segments.length - 1]

  if (
    fs.existsSync(path.join(categoryAbs, `${slug}.md`)) ||
    fs.existsSync(path.join(categoryAbs, `${slug}.mdx`))
  ) {
    return 'article'
  }

  return null
}

/**
 * Returns all valid URL path segments for generateStaticParams.
 * Includes both category paths (directories) and article paths (files).
 */
export function getAllPaths(): string[][] {
  const results: string[][] = []

  function walk(absDir: string, prefix: string[]) {
    if (!fs.existsSync(absDir)) return
    const entries = fs.readdirSync(absDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.name === '_meta.json' || entry.name.startsWith('.')) continue

      if (entry.isDirectory()) {
        const newPrefix = [...prefix, entry.name]
        results.push(newPrefix)
        walk(path.join(absDir, entry.name), newPrefix)
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        results.push([...prefix, entry.name.replace(/\.mdx?$/, '')])
      }
    }
  }

  walk(KB_CONTENT_PATH, [])
  return results
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

async function buildSidebarItem(cat: KBCategory): Promise<SidebarItem> {
  const articles = await getArticlesByCategory(cat.path)
  const subcategories = await Promise.all(cat.subcategories.map(buildSidebarItem))

  return {
    slug: cat.slug,
    path: cat.path,
    title: cat.title,
    icon: cat.icon,
    order: cat.order,
    articles: articles.map(a => ({
      slug: a.slug,
      title: a.title,
      order: a.order,
      categoryPath: a.categoryPath,
    })),
    subcategories,
  }
}

/** Builds the full sidebar tree with articles at every level. */
export async function getSidebarTree(): Promise<SidebarItem[]> {
  const categories = await getCategories()
  return Promise.all(categories.map(buildSidebarItem))
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchArticles(query: string): Promise<KBArticleMeta[]> {
  const articles = await getAllArticles()
  const lowerQuery = query.toLowerCase()

  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
