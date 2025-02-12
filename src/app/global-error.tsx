"use client";

import { PageHero } from "@/src/app/components/PageHero/UsePageHero";
import ErrorLayout from "./components/Static/ErrorLayout";
import type { Metadata } from "next";
import { absoluteUrl } from "../hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "500",
    description: "Whoops, something just ain't right here.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "500",
        description: "Whoops, something just ain't right here.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "500",
        description: "Whoops, something just ain't right here.",
        images: "/banner.png"

    },
    metadataBase: absoluteUrl()
}


export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <>
            <html>
                <body
                    className="bg-gradient-to-br from-grey-900 via-dark_gray to-black border-gray-200"
                    suppressHydrationWarning
                    suppressContentEditableWarning
                >
                    <PageHero
                        text="Oops, something went wrong."
                        title="Internal Server Error"
                    />
                    <ErrorLayout />
                </body>
            </html>
        </>
    );
}
