import { AboutPage } from "@/packages/ui/components/Layouts/About"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NodeByte Hosting - Fast, reliable, and affordable game server and VPS hosting built for communities and businesses.",
}

export default function About() {
  return <AboutPage />
}
