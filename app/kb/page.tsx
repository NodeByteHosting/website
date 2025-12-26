import { Metadata } from "next";
import { Book, HelpCircle, MessageSquare, Ticket } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCategories, getAllArticles } from "@/packages/kb/lib/kb";
import { KBCategoryGrid } from "@/packages/kb/components/kb-category-card";
import { KBSearch } from "@/packages/kb/components/kb-search";
import { KBArticleList } from "@/packages/kb/components/kb-article-card";
import { Button } from "@/packages/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/packages/ui/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("kb.title")}`,
    description: t("kb.description"),
  };
}

export default async function KnowledgeBasePage() {
  const t = await getTranslations();
  const categories = await getCategories();
  const allArticles = await getAllArticles();

  // Get recent articles (last 5 by date)
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = new Date(a.lastUpdated || 0).getTime();
      const dateB = new Date(b.lastUpdated || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  // Prepare search data
  const searchArticles = allArticles.map((article) => ({
    slug: article.slug,
    category: article.categorySlug,
    title: article.title,
    description: article.description,
    excerpt: article.excerpt || "",
    tags: article.tags || [],
    readingTime: article.readingTime,
    score: 0,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("kb.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t("kb.description")}
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <KBSearch articles={searchArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t("kb.browseByCategory")}</h2>
          </div>
          <KBCategoryGrid categories={categories} />
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("kb.recentlyUpdated")}
              </h2>
            </div>
            <KBArticleList articles={recentArticles} showCategory />
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("kb.help.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("kb.help.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("kb.help.discord.title")}</CardTitle>
                <CardDescription>
                  {t("kb.help.discord.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a
                    href="https://discord.gg/wN58bTzzpW"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("kb.help.discord.button")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("kb.help.ticket.title")}</CardTitle>
                <CardDescription>
                  {t("kb.help.ticket.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <a
                    href="https://billing.nodebyte.host/submitticket.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("kb.help.ticket.button")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("kb.help.faq.title")}</CardTitle>
                <CardDescription>
                  {t("kb.help.faq.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/#faq">{t("kb.help.faq.button")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
