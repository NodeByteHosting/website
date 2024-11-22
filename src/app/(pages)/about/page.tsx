import { Metadata } from "next";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import { PulseTitleBanner } from "./components/PulseTitleBanner";
import { AboutUs } from "./components/aboutus/AboutUsC";


export const metadata: Metadata = {
    title: 'About Us',
    description: 'What about us?'
};


export default function AboutPage() {
    return (
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