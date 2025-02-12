'use client';

import Link from 'next/link';
import { FC } from 'react';
import { motion } from "framer-motion";
import { MdArticle } from 'react-icons/md';
import { PageHero } from '@/components/PageHero/UsePageHero';
import { githubFetcher } from '@/lib/githubFethcer';
import useSWR from 'swr';

interface Article {
    slug: string;
    title: string;
    description: string;
    path: string;
}

interface Section {
    slug: string;
    section: string;
    about: string;
    articles?: Article[];
}

export const KnowledgeBaseLayout: FC = ({ }) => {
    const { data, error } = useSWR(
        {
            repoOwner: 'NodeByteHosting',
            repoName: 'assets/contents',
            jsonPath: 'markdown/kb/articles.json?ref=main',
        },
        githubFetcher
    );

    const sections: Section[] = data || [];

    return (
        <>
            <PageHero
                title="Knowledge Base"
                text="Find answers to your questions."
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    {error ? (
                        <div className="text-center text-red-500 break-all">Error loading articles: {error.message}</div>
                    ) : !data ? (
                        <div className="text-center text-white">Loading...</div>
                    ) : sections.length === 0 ? (
                        <div className="text-center text-white">No articles available at the moment.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sections.map((section, index) => (
                                <Link key={index} href={`/kb/${section.slug}`}>
                                    <article className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-4 text-gray-500">
                                                <span className="text-sm flex items-center text-white/50">
                                                    <MdArticle className="mr-1 text-white/50" />
                                                    {section.articles?.length} Articles
                                                </span>
                                            </div>
                                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
                                                <Link href={`/kb/${section.slug}`}>
                                                    {section.section}
                                                </Link>
                                            </h2>
                                            <p className="mb-6 font-light text-white/50">
                                                {section.about}
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