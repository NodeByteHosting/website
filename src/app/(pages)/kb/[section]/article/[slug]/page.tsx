import { ArticleLayout } from '../../../layouts/ArticleLayout';
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://nodebyte.host';
    const section = await fetch(`${baseUrl}/api/kb/article?slug=${slug}`);
    const data = await section.json();

    return {
        title: data.title,
        description: data.description,
    }
}


export default async function KnowledgeBase() {
    return <ArticleLayout />
}