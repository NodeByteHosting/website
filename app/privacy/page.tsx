import { Privacy } from "@/components/privacy"
import { Navigation } from "@/components/Static/navigation"
import { Footer } from "@/components/Static/footer"

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navigation />
      <Privacy />
      <Footer />
    </main>
  )
}