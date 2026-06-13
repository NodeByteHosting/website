import { Metadata } from "next"
import { Hero } from "@/packages/ui/components/Layouts/Home/hero"
import { Features } from "@/packages/ui/components/Layouts/Home/features"
import { About } from "@/packages/ui/components/Layouts/Home/about"
import { Services } from "@/packages/ui/components/Layouts/Home/services"
import { FAQ } from "@/packages/ui/components/Layouts/Home/faq"
import { ScrollToHash } from "@/packages/ui/components/scroll-to-hash"

export const metadata: Metadata = {
  title: "Home",
  description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
}

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