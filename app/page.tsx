import { Hero } from "@/packages/ui/components/Layouts/Home/hero"
import { Features } from "@/packages/ui/components/Layouts/Home/features"
import { About } from "@/packages/ui/components/Layouts/Home/about"
import { Services } from "@/packages/ui/components/Layouts/Home/services"
import { FAQ } from "@/packages/ui/components/Layouts/Home/faq"
import { ScrollToHash } from "@/packages/ui/components/scroll-to-hash"

export default function Home() {
  return (
    <>
      <ScrollToHash />
      <Hero />
      <About />
      <Features />
      <Services />
      <FAQ />
    </>
  )
}