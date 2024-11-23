'use client';

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ArticleTitleBanner } from "../../kb/components/ArticleTitleBanner";
import { MarkdownProvider } from '../../../../providers/MarkdownProvider';
import { logErrorToDiscord } from "@/src/app/utils/logError";
import ErrorLayout from "../../../components/Static/ErrorLayout";

export const PostLayout: FC = ({ }) => {
    const [content, setContent] = useState<string>('Loading...');
    const [title, setTitle] = useState<string>('Loading...');
    const [description, setDescription] = useState<string>('Loading...');
    const [isError, setIsError] = useState<boolean>(false);

    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    useEffect(() => {
        if (!slug) return;

        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/blog/post?slug=${slug}`);
                const data = await response.json();

                if (data.status === 'OK') {
                    setContent(data.post.content);
                    setTitle(data.post.title);
                    setDescription(data.post.excerpt || data.post.description || '');
                    setIsError(false);
                } else {
                    setTitle('Error: failed to fetch!');
                    setDescription(data.message);
                    setContent(data.message);
                    setIsError(true);
                    logErrorToDiscord({
                        title: 'Error: failed to fetch!',
                        message: data.message,
                        status: 500,
                        page: pathname,
                        source: 'PostLayout'
                    });
                }
            } catch (error) {
                setTitle('Error: failed to fetch!');
                setDescription('Failed to fetch the post content.');
                setContent('Failed to fetch the post content.');
                setIsError(true);
                logErrorToDiscord({
                    title: 'Error: failed to fetch!',
                    message: 'Failed to fetch the post content.',
                    status: 500,
                    page: pathname,
                    source: 'PostLayout'
                });
            }
        };

        fetchContent();
    }, [slug]);

    return (
        <>
            <ArticleTitleBanner
                title={title}
                text={description}
            />
            {title === 'Error: failed to fetch!' ? (
                <motion.section className="py-16 bg-dark">
                    <ErrorLayout />
                </motion.section>
            ) : (
                <motion.section className="py-16 bg-dark">
                    <div className="container text-white">
                        <MarkdownProvider content={content} />
                    </div>
                </motion.section>
            )}
        </>
    );
};