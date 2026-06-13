import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/packages/core/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface KBBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function KBBreadcrumb({ items, className }: KBBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        href="/kb"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Knowledge Base</span>
      </Link>

      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default KBBreadcrumb;
