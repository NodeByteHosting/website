import { TermsOfService } from "./layouts/Terms";
import { Metadata } from "next";

const meta = {
  title: 'Terms of Service',
  description: 'The stuff no one wants to read but everyone should know.',
  url: 'https://nodebyte.host/terms',
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.url,
    siteName: 'NodeByte Hosting',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    card: 'summary_large_image'
  },
}

export default function TOS() {
  return <TermsOfService />
}
