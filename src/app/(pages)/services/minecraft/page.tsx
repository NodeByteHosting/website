import { Metadata } from "next";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import { PageHero } from "../../../components/PageHero/UsePageHero";


export const metadata: Metadata = {
    title: 'About Us',
    description: 'What about us?'
};


export default function AboutPage() {
    return (
        <>
            <ButtonScrollProvider>
                <PageHero
                    title="Minecraft Hosting"
                    text="Grab yourself a Minecraft server and start playing with your friends."
                />

            </ButtonScrollProvider>
        </>
    )
}