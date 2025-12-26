import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories, getArticlesByCategory } from "@/packages/kb/lib/kb";
import { KBBreadcrumb } from "@/packages/kb/components/kb-breadcrumb";
import { KBArticleList } from "@/packages/kb/components/kb-article-card";
import {
  Rocket,
  Gamepad2,
  CreditCard,
  Users,
  Shield,
  Settings,
  HelpCircle,
  Server,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Gamepad2,
  CreditCard,
  Users,
  Shield,
  Settings,
  HelpCircle,
  Server,
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getCategories();
  const categoryData = categories.find((c) => c.slug === category);

  if (!categoryData) {
    return {
      title: "Category Not Found | Knowledge Base",
    };
  }

  return {
    title: `${categoryData.title} | Knowledge Base`,
    description: categoryData.description,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const t = await getTranslations();
  const { category } = await params;
  const categories = await getCategories();
  const categoryData = categories.find((c) => c.slug === category);

  if (!categoryData) {
    notFound();
  }

  const articles = await getArticlesByCategory(category);
  const Icon = iconMap[categoryData.icon] || HelpCircle;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <KBBreadcrumb
          items={[{ label: categoryData.title }]}
          className="mb-8"
        />

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {categoryData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {categoryData.description}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {articles.length} {t("kb.articles")}
          </p>
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <KBArticleList articles={articles} />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("kb.empty.title")}</h3>
            <p className="text-muted-foreground">
              {t("kb.empty.description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
