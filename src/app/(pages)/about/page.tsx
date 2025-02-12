import { Metadata } from "next";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import { PageHero } from "../../components/PageHero/UsePageHero";
import { AboutUs } from "./layouts/AboutUsC";


export const metadata: Metadata = {
    title: 'About Us',
    description: 'What about us?'
};


export default function AboutPage() {
    return (
        <>
            <ButtonScrollProvider>
                <PageHero
                    title="About Us"
                    text="What about us?"
                />

                <AboutUs />
            </ButtonScrollProvider>
        </>
    )
}