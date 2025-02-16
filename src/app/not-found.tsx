"use client";

import type { Metadata } from "next";
import { absoluteUrl } from "hooks/absoluteUrl";
import ErrorLayout from "components/Static/ErrorLayout";
import { PageHero } from "components/PageHero";

export const metadata: Metadata = {
  title: "404",
  description: "Whatever it is you seek to find, doesn't exist at this location.",
  openGraph: {
    url: "https://nodebyte.host",
    title: "404",
    description: "Whatever it is you seek to find, doesn't exist at this location.",
    images: "/logo.png",
    siteName: "NodeByte Hosting",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@TheRealToxicDev",
    title: "404",
    description: "Whatever it is you seek to find, doesn't exist at this location.",
    images: "/banner.png"

  },
  metadataBase: absoluteUrl()
}

export default function NotFoundPage() {
  return (
    <>
      <PageHero

        text="Whoops! Looks like you&apos;ve followed a broken link or entered a URL that doesn't exist on this site."
        title="Page Not Found"
      />
      <ErrorLayout />
    </>
  );
}
