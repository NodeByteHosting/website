import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getCategories,
  getArticle,
  getArticlesByCategory,
  extractHeadings,
  getAllArticles,
} from "@/packages/kb/lib/kb";
import { KBBreadcrumb } from "@/packages/kb/components/kb-breadcrumb";
import { KBArticle } from "@/packages/kb/components/kb-article";
import { KBTableOfContents } from "@/packages/kb/components/kb-toc";
import { KBSidebar, SidebarCategory } from "@/packages/kb/components/kb-sidebar";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    article: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, article } = await params;
  const articleData = await getArticle(category, article);

  if (!articleData) {
    return {
      title: "Article Not Found | Knowledge Base",
    };
  }

  return {
    title: `${articleData.meta.title} | Knowledge Base`,
    description: articleData.meta.description,
    keywords: articleData.meta.tags,
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    category: article.categorySlug,
    article: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const t = await getTranslations();
  const { category, article } = await params;
  const articleData = await getArticle(category, article);

  if (!articleData) {
    notFound();
  }

  const categories = await getCategories();
  const categoryData = categories.find((c) => c.slug === category);
  const articlesInCategory = await getArticlesByCategory(category);

  // Prepare sidebar data
  const sidebarCategories: SidebarCategory[] = await Promise.all(
    categories.map(async (cat) => {
      const catArticles = await getArticlesByCategory(cat.slug);
      return {
        slug: cat.slug,
        title: cat.title,
        icon: cat.icon,
        order: cat.order,
        articles: catArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          order: a.order,
        })),
      };
    })
  );

  // Extract headings for TOC
  const headings = extractHeadings(articleData.content);

  // Find adjacent articles for navigation
  const sortedArticles = [...articlesInCategory].sort((a, b) => a.order - b.order);
  const currentIndex = sortedArticles.findIndex((a) => a.slug === article);
  const previousArticle =
    currentIndex > 0
      ? {
          slug: sortedArticles[currentIndex - 1].slug,
          category,
          title: sortedArticles[currentIndex - 1].title,
        }
      : null;
  const nextArticle =
    currentIndex < sortedArticles.length - 1
      ? {
          slug: sortedArticles[currentIndex + 1].slug,
          category,
          title: sortedArticles[currentIndex + 1].title,
        }
      : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <KBBreadcrumb
          items={[
            {
              label: categoryData?.title || category,
              href: `/kb/${category}`,
            },
            { label: articleData.meta.title },
          ]}
          className="mb-8"
        />

        <div className="flex gap-8">
          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <KBSidebar categories={sidebarCategories} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <KBArticle
              meta={{
                ...articleData.meta,
                readingTime: articleData.readingTime,
              }}
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

          {/* Table of Contents - Hidden on mobile and tablet */}
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
  );
}
