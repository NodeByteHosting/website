import { AboutPage } from "@/packages/ui/components/Layouts/About"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NodeByte Hosting who we are, what we stand for, and why thousands of players and developers trust us for game server and VPS hosting.",
}

export default function About() {
  return <AboutPage />
}
