import type { Metadata } from "next";
import { BytePanelLayout } from "components/Layouts/Bytepanel";
import { absoluteUrl } from "hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "BytePanel",
    description: "Check out all the latest features and updates to our BytePanel.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "BytePanel",
        description: "Check out all the latest features and updates to our BytePanel.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "BytePanel",
        description: "Check out all the latest features and updates to our BytePanel.",
        images: "/banner.png"

    },
    metadataBase: absoluteUrl()
}


export default function StatusPage() {
    return <BytePanelLayout />
}