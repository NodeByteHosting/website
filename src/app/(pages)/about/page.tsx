import { Metadata } from "next";
import { PageHero } from "components/PageHero";
import { AboutUs } from "components/Layouts/About";
import ButtonScrollProvider from "providers/ButtonScroll";


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