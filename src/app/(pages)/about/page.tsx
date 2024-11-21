import type { Metadata } from "next";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import { PulseTitleBanner } from "./components/PulseTitleBanner";
import { AboutUs } from "./components/aboutus/AboutUsC";


export const metadata: Metadata = {
    title: 'About Us',
    description:
        'What about us?',
    openGraph: {
        type: 'website',
        'locale': 'en_US',
        url: 'https://nodebyte.host'
    },
    twitter: {
        site: '@NodeByteHosting',
        card: 'summary_large_image',
        creator: '@TheRealToxicDev',
        images: ['/banner.png']
    }
};


export default function AboutPage() {
    return(
        <>
            <ButtonScrollProvider>
                <PulseTitleBanner
                    title="About Us"
                    text="What about us?"
                />

                <AboutUs />
            </ButtonScrollProvider>
        </>
    )
}