import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Calendar, User, Tag, Pencil } from "lucide-react";
import { cn } from "@/packages/core/lib/utils";
import { Badge } from "@/packages/ui/components/ui/badge";
import { Button } from "@/packages/ui/components/ui/button";
import { Separator } from "@/packages/ui/components/ui/separator";

interface ArticleMeta {
  title: string;
  description: string;
  tags?: string[];
  author?: string;
  lastUpdated?: string;
  readingTime: number;
}

interface AdjacentArticle {
  slug: string;
  category: string;
  title: string;
}

interface KBArticleProps {
  meta: ArticleMeta;
  content: string;
  previousArticle?: AdjacentArticle | null;
  nextArticle?: AdjacentArticle | null;
  editUrl?: string;
  className?: string;
  translations: {
    minRead: string;
    updated: string;
    previous: string;
    next: string;
  };
}

export function KBArticle({
  meta,
  content,
  previousArticle,
  nextArticle,
  editUrl,
  className,
  translations,
}: KBArticleProps) {
  return (
    <article className={cn("max-w-none", className)}>
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {meta.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">{meta.description}</p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {meta.readingTime} {translations.minRead}
          </span>
          {meta.lastUpdated && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {translations.updated}{" "}
              {new Date(meta.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {meta.author && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {meta.author}
            </span>
          )}
        </div>

        {/* Tags */}
        {meta.tags && meta.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <Separator className="mb-8" />

      {/* Article Content */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-mt-24
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-3
          prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2
          prose-p:leading-7 prose-p:text-foreground/90
          prose-a:text-primary prose-a:no-underline prose-a:font-medium prose-a:decoration-primary/40 prose-a:underline-offset-4 prose-a:transition-colors
          prose-a:hover:text-primary/85 prose-a:hover:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-ul:my-4 prose-ol:my-4
          prose-li:my-1
          prose-table:border prose-table:rounded-lg prose-table:overflow-hidden
          prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
          prose-td:px-4 prose-td:py-2 prose-td:border-t
          prose-img:rounded-lg prose-img:shadow-lg
          prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Separator className="my-8" />

      {/* Article Footer */}
      <footer className="space-y-6">
        {/* Edit link */}
        {editUrl && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit this page
              </a>
            </Button>
          </div>
        )}

        {/* Navigation */}
        {(previousArticle || nextArticle) && (
          <nav className="flex flex-col sm:flex-row gap-4">
            {previousArticle ? (
              <Link
                href={`/kb/${previousArticle.category}/${previousArticle.slug}`}
                className="flex-1 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex h-full flex-col rounded-lg border bg-card/60 p-4 transition-colors group-hover:border-primary/35 group-hover:bg-primary/5">
                  <span className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    {translations.previous}
                  </span>
                  <span className="font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {previousArticle.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextArticle ? (
              <Link
                href={`/kb/${nextArticle.category}/${nextArticle.slug}`}
                className="flex-1 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex h-full flex-col items-end rounded-lg border bg-card/60 p-4 text-right transition-colors group-hover:border-primary/35 group-hover:bg-primary/5">
                  <span className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {translations.next}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <span className="font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {nextArticle.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </footer>
    </article>
  );
}

export default KBArticle;
