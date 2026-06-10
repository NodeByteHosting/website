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

// Types
export interface KBArticleMeta {
  slug: string
  title: string
  description: string
  category: string
  categorySlug: string
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
  title: string
  description: string
  icon: string
  articleCount: number
  order: number
}

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

// Base path for KB content
const KB_CONTENT_PATH = path.join(process.cwd(), 'packages', 'kb', 'content')

/**
 * Process markdown content to HTML
 */
export async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['anchor-link'],
      },
    })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  return result.toString()
}

/**
 * Extract headings from HTML content for table of contents
 */
export function extractHeadings(html: string): TableOfContentsItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>(?:<a[^>]*>)?([^<]*)/g
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    const text = match[3].trim()

    if (id && text) {
      headings.push({ id, text, level })
    }
  }

  return headings
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<KBCategory[]> {
  if (!fs.existsSync(KB_CONTENT_PATH)) {
    return []
  }

  const categoryDirs = fs.readdirSync(KB_CONTENT_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())

  const categories: KBCategory[] = []

  for (const dir of categoryDirs) {
    const categoryPath = path.join(KB_CONTENT_PATH, dir.name)
    const metaPath = path.join(categoryPath, '_meta.json')

    let meta = {
      title: dir.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: '',
      icon: 'FileText',
      order: 999,
    }

    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, 'utf-8')
      meta = { ...meta, ...JSON.parse(metaContent) }
    }

    // Count articles
    const articleCount = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx')).length

    categories.push({
      slug: dir.name,
      title: meta.title,
      description: meta.description,
      icon: meta.icon,
      order: meta.order,
      articleCount,
    })
  }

  return categories.sort((a, b) => (a.order || 999) - (b.order || 999))
}

/**
 * Get all articles in a category
 */
export async function getArticlesByCategory(categorySlug: string): Promise<KBArticleMeta[]> {
  const categoryPath = path.join(KB_CONTENT_PATH, categorySlug)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  const files = fs.readdirSync(categoryPath)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))

  const articles: KBArticleMeta[] = []

  for (const file of files) {
    const filePath = path.join(categoryPath, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    const stats = readingTime(fileContent)
    const slug = file.replace(/\.mdx?$/, '')

    // Get category meta for title
    const metaPath = path.join(categoryPath, '_meta.json')
    let categoryTitle = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      categoryTitle = meta.title || categoryTitle
    }

    // Create excerpt from content (first 150 chars of plain text)
    const excerpt = content
      .replace(/^#.*$/gm, '') // Remove headings
      .replace(/\n+/g, ' ')  // Replace newlines with spaces
      .replace(/[*_`\[\]]/g, '') // Remove markdown formatting
      .trim()
      .slice(0, 200)

    articles.push({
      slug,
      title: data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: data.description || '',
      category: categoryTitle,
      categorySlug,
      tags: data.tags || [],
      author: data.author,
      lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
      readingTime: Math.ceil(stats.minutes),
      excerpt,
      order: data.order || 999,
    })
  }

  return articles.sort((a, b) => (a.order || 999) - (b.order || 999))
}

/**
 * Get a single article by category and slug
 */
export async function getArticle(categorySlug: string, articleSlug: string): Promise<KBArticle | null> {
  const categoryPath = path.join(KB_CONTENT_PATH, categorySlug)
  
  // Try .md first, then .mdx
  let filePath = path.join(categoryPath, `${articleSlug}.md`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(categoryPath, `${articleSlug}.mdx`)
  }
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const stats = readingTime(fileContent)
  const htmlContent = await processMarkdown(content)

  return {
    meta: {
      title: data.title || articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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
 * Get all articles (for search)
 */
export async function getAllArticles(): Promise<KBArticleMeta[]> {
  const categories = await getCategories()
  const articleArrays = await Promise.all(
    categories.map((cat) => getArticlesByCategory(cat.slug))
  )
  return articleArrays.flat()
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<KBArticleMeta[]> {
  const articles = await getAllArticles()
  const lowerQuery = query.toLowerCase()

  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
