import type { Metadata } from "next";
import ButtonScrollProvider from "providers/ButtonScroll";
import ServicesHero from 'components/Layouts/Services/vps/Hero';
import WhyChooseUs from "components/Layouts/Services/vps/Benefits";
import ServersList from "components/Layouts/Services/vps/Servers";
import { FAQ } from "components/Layouts/Services/vps/GeneralFAQs";
import { absoluteUrl } from "hooks/absoluteUrl";

export const metadata: Metadata = {
    title: "Services",
    description: "View the current real-time status of our services.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "Services",
        description: "View the current real-time status of our services.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "Services",
        description: "View the current real-time status of our services.",
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