import { githubFetcher } from '@/src/fetchers/github';
import { ArticleSectionLayout } from '../layouts/ArticleSections';
import type { Metadata } from "next";
import { absoluteUrl } from '@/src/hooks/absoluteUrl';

export default async function KnowledgeBase() {
    return <ArticleSectionLayout />
}

type Props = {
    params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).section;
    const section = await githubFetcher({
        repoOwner: 'NodeByteHosting',
        repoName: 'assets/contents',
        jsonPath: 'markdown/kb/articles.json?ref=main',
        slug,
        type: 'section',
    });

    return {
        title: section.section,
        description: section.about,
        openGraph: {
            type: 'website',
            title: section.section,
            description: section.about,
            url: `https://nodebyte.dev/kb/${slug}`,
            siteName: 'NodeByte Hosting',
            images: '/banner.png'
        },
        twitter: {
            card: 'summary_large_image',
            creator: '@TheRealToxicDev',
            title: section.section,
            description: section.about,
            images: '/banner.png',
        },
        metadataBase: absoluteUrl()
    };
}