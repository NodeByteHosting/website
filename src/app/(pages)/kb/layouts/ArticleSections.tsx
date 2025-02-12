'use client';

import Link from 'next/link';
import { motion } from "framer-motion";
import { FC } from 'react';
import { MdArticle } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { PageHero } from '@/src/app/components/PageHero/UsePageHero';
import { githubFetcher } from '@/src/fetchers/github';
import { useSWRClient } from '@/providers/SWR/config';
import ErrorLayout from '@/src/app/components/Static/ErrorLayout';
import LoadingSkeleton from './LoadingSkeleton';

interface Article {
    slug: string;
    title: string;
    description: string;
    section: string;
    path: string;
}

interface Section {
    slug: string;
    section: string;
    about: string;
    articles?: Article[];
}

export const ArticleSectionLayout: FC = ({ }) => {
    const slug = usePathname().replace('/kb/', '');

    const { data, error, isLoading } = useSWRClient(
        {
            repoOwner: 'NodeByteHosting',
            repoName: 'assets/contents',
            jsonPath: 'markdown/kb/articles.json?ref=main',
            slug,
            type: 'section',
        },
        githubFetcher
    );

    const section: Section = data || {};
    const articles: Article[] = section.articles || [];

    const pageTitle = error
        ? 'Internal Error'
        : isLoading
            ? 'Loading Articles...'
            : section.section
            || 'Loading...';

    const pageSubtitle = error
        ? `An error occurred: ${error.message}`
        : isLoading
            ? 'Please wait while we fetch the articles.'
            : section.about
            || 'Please wait while we fetch the articles.';

    return (
        <>
            <PageHero
                title={pageTitle}
                text={pageSubtitle}
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    {error ? (
                        <ErrorLayout />
                    ) : isLoading || !data ? (
                        <LoadingSkeleton />
                    ) : articles.length === 0 ? (
                        <div className="text-center text-white">No articles available at the moment.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article, index) => (
                                <Link key={index} href={`/kb/${article.section}/article/${article.slug}`}>
                                    <article className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-4 text-gray-500">
                                                <span className="text-sm flex items-center text-white/50">
                                                    <MdArticle className="mr-1 text-white/50" />
                                                    Article
                                                </span>
                                            </div>
                                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
                                                {article.title}
                                            </h2>
                                            <p className="mb-6 font-light text-white/50">
                                                {article.description}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>
        </>
    );
};