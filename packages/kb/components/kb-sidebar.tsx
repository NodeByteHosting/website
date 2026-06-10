"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  Gamepad2,
  CreditCard,
  Users,
  Shield,
  Settings,
  HelpCircle,
  Server,
  ChevronDown,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/packages/core/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/packages/ui/components/ui/collapsible";
import { ScrollArea } from "@/packages/ui/components/ui/scroll-area";
import { useState } from "react";

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Gamepad2,
  CreditCard,
  Users,
  Shield,
  Settings,
  HelpCircle,
  Server,
};

export interface SidebarCategory {
  slug: string;
  title: string;
  icon: string;
  order: number;
  articles: {
    slug: string;
    title: string;
    order: number;
  }[];
}

interface KBSidebarProps {
  categories: SidebarCategory[];
  className?: string;
}

export function KBSidebar({ categories, className }: KBSidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    // Open the category that contains the current article
    const currentCategory = categories.find((cat) =>
      pathname.includes(`/kb/${cat.slug}`)
    );
    return currentCategory ? [currentCategory.slug] : [];
  });

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  const sortedCategories = categories.toSorted((a, b) => a.order - b.order);

  return (
    <ScrollArea className={cn("h-[calc(100vh-8rem)]", className)}>
      <nav className="space-y-2 pr-3">
        {sortedCategories.map((category) => {
          const Icon = iconMap[category.icon] || HelpCircle;
          const isOpen = openCategories.includes(category.slug);
          const isCategoryActive = pathname.includes(`/kb/${category.slug}`);
          const sortedArticles = category.articles.toSorted(
            (a, b) => a.order - b.order
          );

          return (
            <Collapsible
              key={category.slug}
              open={isOpen}
              onOpenChange={() => toggleCategory(category.slug)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isCategoryActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  {category.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-1.5">
                <ul className="ml-4 space-y-1 border-l border-border/70 pl-2">
                  {sortedArticles.map((article) => {
                    const articlePath = `/kb/${category.slug}/${article.slug}`;
                    const isActive = pathname === articlePath;

                    return (
                      <li key={article.slug}>
                        <Link
                          href={articlePath}
                          className={cn(
                            "flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-sm leading-snug transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isActive
                              ? "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-2">{article.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </ScrollArea>
  );
}

export default KBSidebar;
