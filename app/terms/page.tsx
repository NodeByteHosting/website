import { Terms } from "@/components/terms"
import { Navigation } from "@/components/Static/navigation"
import { Footer } from "@/components/Static/footer"

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navigation />
      <Terms />
      <Footer />
    </main>
  )
}