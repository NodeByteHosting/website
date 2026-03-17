import type { Metadata } from "next"
import { Contact } from "@/packages/ui/components/Layouts/Contact/contact"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the NodeByte Hosting team. We offer 24/7 support via Discord and our ticketing system for all game server and VPS hosting queries.",
}

export default function ContactPage() {
  return <Contact />
}