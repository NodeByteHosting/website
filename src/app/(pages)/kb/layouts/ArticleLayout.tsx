'use client';

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { MarkdownProvider } from '../../../../providers/MarkdownProvider';
import { logErrorToDiscord } from "@/src/app/utils/logError";
import ErrorLayout from "../../../components/Static/ErrorLayout";
import { PageHero } from "@/src/app/components/PageHero/UsePageHero";

export const ArticleLayout: FC = ({ }) => {
    const [content, setContent] = useState<string>('Loading...');
    const [title, setTitle] = useState<string>('Loading...');
    const [description, setDescription] = useState<string>('Loading...');

    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    useEffect(() => {
        if (!slug) return;

        const fetchContent = async () => {
            const response = await fetch(`/api/kb/article?slug=${slug}`);
            const data = await response.json();

            if (data.status === 'OK') {
                setContent(data.article);
                setTitle(data.title);
                setDescription(data.description);
            } else {
                setTitle('Error: failed to fetch!');
                setDescription(data.message);
                setContent(data.message);
                logErrorToDiscord({
                    title: 'Error: failed to fetch!',
                    message: data.message,
                    page: pathname,
                    source: 'ArticleLayout',
                    status: 500,
                })
            }
        };

        fetchContent();
    }, [slug]);

    return (
        <>
            <PageHero
                title={title}
                text={description}
            />
            {title === 'Error: failed to fetch!' ? (
                <motion.section className="py-16 bg-dark">
                    <ErrorLayout />
                </motion.section>
            ) : (
                <motion.section className="py-16 bg-dark">
                    <div className="container text-white markdown-body">
                        <MarkdownProvider content={content} />
                    </div>
                </motion.section>
            )}
        </>
    );
};