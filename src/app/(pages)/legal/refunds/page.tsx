import { RefundPolicyLayout } from "./layouts/Refunds";
import { Metadata } from "next";

const meta = {
  title: 'Refund Policy',
  description: 'The stuff no one wants to read but everyone should know.',
  url: 'https://nodebyte.host/refund',
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

export default function RefundPolicy() {
  return <RefundPolicyLayout />
}
