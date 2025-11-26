import type { Metadata } from "next";
import ServicesHero from '@/src/components/Layouts/games/mc/Hero';
import ButtonScrollProvider from "providers/ButtonScroll";
import WhyChooseUs from "@/src/components/Layouts/games/mc/Benefits";
import ServersList from "@/src/components/Layouts/games/mc/Servers";
import { FAQ } from "@/src/components/Layouts/games/mc/GeneralFAQs";
import { absoluteUrl } from "hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "Minecraft Hosting",
    description: "Minecraft Hosting Services.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "Services",
        description: "Minecraft Hosting Services.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "Services",
        description: "Minecraft Hosting Services.",
        images: "/banner.png"

    },
    metadataBase: absoluteUrl()
}


export default function StatusPage() {
    return (
        <>
            <ButtonScrollProvider>
                <ServicesHero />
                <WhyChooseUs />
                <ServersList />
                <FAQ />
            </ButtonScrollProvider>
        </>
    )
}