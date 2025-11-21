import type { Metadata } from "next";
import ServicesHero from '@/src/components/Layouts/games/rust/Hero';
import ButtonScrollProvider from "providers/ButtonScroll";
import WhyChooseUs from "@/src/components/Layouts/games/rust/Benefits";
import ServersList from "@/src/components/Layouts/games/rust/Servers";
import { FAQ } from "@/src/components/Layouts/games/rust/GeneralFAQs";
import { absoluteUrl } from "hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "Rust Hosting",
    description: "Rust Hosting Services.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "Rust Hosting",
        description: "Rust Hosting Services.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "Rust Hosting",
        description: "Rust Hosting Services.",
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