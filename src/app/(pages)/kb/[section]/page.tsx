import { ArticleSectionLayout } from '../layouts/ArticleSections';
import { Metadata } from "next";

type Props = {
    params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const section = (await params).section;

    console.log('slug:', section);

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://nodebyte.host';
    const kbSection = await fetch(`${baseUrl}/api/kb/section?slug=${section}`);
    const data = await kbSection.json();

    return {
        title: data.section,
        description: data.about,
    }
}


export default async function KnowledgeBase() {
    return <ArticleSectionLayout />
}