'use client';

import Link from 'next/link';
import { motion } from "framer-motion";
import { useEffect, useState, FC } from 'react';
import { MdArticle } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { PageHero } from '@/src/app/components/PageHero/UsePageHero';

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
    const [articles, setArticles] = useState<Section['articles']>([]);
    const [section, setSection] = useState<Section>();

    const slug = usePathname().replace('/kb/', '');

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch(`/api/kb/section?slug=${slug}`);
            const data = await res.json();

            if (data.status === 'OK') {
                console.log(data)
                setArticles(data.articles);
                setSection(data);
            } else {
                console.error('Failed to fetch articles:', data.message);
            }
        }

        fetchArticles();
    }, []);

    return (
        <>
            <PageHero
                title={section?.section as string}
                text={section?.about as string}
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles?.map((article, index) => (
                            <Link href={`/kb/${article.section}/article/${article.slug}`}>
                                <article key={index} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
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
                </div>
            </motion.section>
        </>
    );
};