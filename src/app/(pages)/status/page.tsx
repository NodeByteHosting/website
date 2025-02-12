import type { Metadata } from "next";
import { StatusLayout } from './layouts/Status';
import { absoluteUrl } from "@/hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "Status",
    description: "View the current real-time status of our services.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "Status",
        description: "View the current real-time status of our services.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "Status",
        description: "View the current real-time status of our services.",
        images: "/banner.png"

    },
    metadataBase: absoluteUrl()
}


export default function StatusPage() {
    return <StatusLayout />
}