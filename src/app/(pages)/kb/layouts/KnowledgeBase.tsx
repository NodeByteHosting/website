'use client';

import Link from 'next/link';
import { useEffect, useState, FC } from 'react';
import { motion } from "framer-motion";
import { ArticleTitleBanner } from "../components/ArticleTitleBanner";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MdArticle } from 'react-icons/md';

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
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        const fetchSections = async () => {
            const res = await fetch('/api/kb');
            const data = await res.json();

            if (data.status === 'OK') {
                setSections(data.articles);
            } else {
                console.error('Failed to fetch articles:', data.message);
            }
        }

        fetchSections();
    }, []);

    return (
        <>
            <ArticleTitleBanner
                title="Knowledge Base"
                text="Find answers to your questions."
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sections.map((section, index) => (
                            <Link href={`/kb/${section.slug}`}>
                                <article key={index} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
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
                </div>
            </motion.section>
        </>
    );
};