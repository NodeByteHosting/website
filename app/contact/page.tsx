import { Contact } from "@/components/Layouts/Contact/contact"
import { Navigation } from "@/components/Static/navigation"
import { Footer } from "@/components/Static/footer"

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navigation />
      <Contact />
      <Footer />
    </main>
  )
}