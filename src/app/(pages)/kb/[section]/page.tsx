import { githubFetcher } from '@/src/fetchers/github';
import { ArticleSectionLayout } from '../layouts/ArticleSections';
import type { Metadata } from "next";

type Params = {
    params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const slug = (await params).section;

    try {
        const section = await githubFetcher({
            repoOwner: 'NodeByteHosting',
            repoName: 'assets/contents',
            jsonPath: 'markdown/kb/articles.json?ref=main',
            slug,
            type: 'section',
        });

        return {
            title: section.section,
            description: section.about
        };
    } catch (err: unknown) {
        console.error(`Failed to fetch section: ${slug}`, (err as Error).message);

        return {
            title: 'Internal Error',
            description: 'An error occurred while fetching the section'
        }
    }
}

export default async function KnowledgeBase() {
    return <ArticleSectionLayout />
}