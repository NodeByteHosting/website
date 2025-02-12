'use client';

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { MarkdownProvider } from '../../../../providers/MarkdownProvider';
import { logErrorToDiscord } from "@/src/app/utils/logError";
import ErrorLayout from "../../../components/Static/ErrorLayout";
import { PageHero } from "@/src/app/components/PageHero/UsePageHero";
import { githubFetcher } from '@/lib/githubFethcer';
import { useSWRClient } from '@/providers/SWR/config';
import LoadingSkeleton from './LoadingSkeleton';

export const ArticleLayout: FC = ({ }) => {
    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    const { data, error, isLoading } = useSWRClient(
        {
            repoOwner: 'NodeByteHosting',
            repoName: 'assets/contents',
            jsonPath: `markdown/kb/articles.json?ref=main`,
            slug,
            type: 'page',
        },
        githubFetcher
    );

    const content = data?.article || 'Loading...';
    const title = error ? 'Internal Error' : isLoading ? 'Loading...' : data?.title || 'Loading...';
    const description = error ? `Error: ${error.message}` || 'An error occurred while fetching the article.' : isLoading ? 'Please wait while we fetch the article.' : data?.description || '';

    useEffect(() => {
        if (error) {
            logErrorToDiscord({
                title: 'Error: failed to fetch!',
                message: error.message,
                page: pathname,
                source: 'ArticleLayout',
                status: 500,
            });
        }
    }, [error, pathname]);

    return (
        <>
            <PageHero
                title={title}
                text={description}
            />
            {error ? (
                <motion.section className="py-16 bg-dark">
                    <ErrorLayout />
                </motion.section>
            ) : isLoading ? (
                <motion.section className="py-16 bg-dark">
                    <LoadingSkeleton />
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