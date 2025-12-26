import { Metadata } from "next"
import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Badge } from "@/packages/ui/components/ui/badge"
import { ChangelogList } from "@/packages/changelog/components"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  
  return {
    title: `${t("changelog.title")}`,
    description: t("changelog.description"),
  }
}

export default async function ChangelogPage() {
  const t = await getTranslations()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">            
            <Badge variant="outline" className="mb-4">
              {t("changelog.badge")}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("changelog.title")}{" "}
              <span className="text-primary">{t("changelog.titleHighlight")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("changelog.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Changelog Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ChangelogList />
        </div>
      </section>
    </div>
  )
}
