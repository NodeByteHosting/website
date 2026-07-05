import Link from "next/link";
import { FileText, Clock, Calendar, User, ChevronRight } from "lucide-react";
import { cn } from "@/packages/core/lib/utils";
import { Badge } from "@/packages/ui/components/ui/badge";

export interface Article {
  slug: string;
  category: string;
  categorySlug: string;
  /** Full relative path used for URL construction, e.g. "games/minecraft" */
  categoryPath: string;
  title: string;
  description: string;
  tags?: string[];
  author?: string;
  lastUpdated: string;
  readingTime: number;
  order: number;
}

interface KBArticleCardProps {
  article: Article;
  showCategory?: boolean;
  className?: string;
  translations?: {
    minRead: string;
  };
}

export function KBArticleCard({
  article,
  showCategory = false,
  className,
  translations,
}: KBArticleCardProps) {
  return (
    <Link href={`/kb/${article.categoryPath}/${article.slug}`}>
      <article
        className={cn(
          "group relative flex items-start gap-4 p-5 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
          className
        )}
      >
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm group-hover:scale-105 transition-all duration-300 shrink-0">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {article.title}
            </h3>
            {showCategory && (
              <Badge variant="secondary" className="text-xs capitalize px-2 py-0.5">
                {article.category.replace(/-/g, " ")}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3.5 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
            {article.description}
          </p>

          <div className="flex items-center gap-x-4 gap-y-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-primary/70" />
              {article.readingTime} {translations?.minRead || "min read"}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary/70" />
              {new Date(article.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {article.author && (
              <span className="flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5 text-primary/70" />
                {article.author}
              </span>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3.5 flex-wrap">
              {article.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] font-medium px-2 py-0.5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors duration-300">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 4 && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  +{article.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center p-1 rounded-full group-hover:bg-primary/10 transition-colors duration-300 shrink-0">
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </article>
    </Link>
  );
}

interface KBArticleListProps {
  articles: Article[];
  showCategory?: boolean;
  className?: string;
}

export function KBArticleList({
  articles,
  showCategory = false,
  className,
}: KBArticleListProps) {
  const sortedArticles = articles.toSorted((a, b) => a.order - b.order);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {sortedArticles.map((article) => (
        <KBArticleCard
          key={`${article.category}/${article.slug}`}
          article={article}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}

export default KBArticleCard;
