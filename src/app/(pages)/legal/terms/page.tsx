import { TermsOfService } from "./layouts/Terms";
import type { Metadata } from "next";
import { absoluteUrl } from "hooks/absoluteUrl";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Stay up to date with our terms of service.",
  openGraph: {
    url: "https://nodebyte.host",
    title: "Terms of Service",
    description: "Stay up to date with our terms of service.",
    images: "/logo.png",
    siteName: "NodeByte Hosting",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@TheRealToxicDev",
    title: "Terms of Service",
    description: "Stay up to date with our terms of service.",
    images: "/banner.png"

  },
  metadataBase: absoluteUrl()
}

export default function TOS() {
  return <TermsOfService />
}
