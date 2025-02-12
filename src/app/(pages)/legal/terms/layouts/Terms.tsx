'use client';

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { FC, useEffect } from 'react';
import { MarkdownProvider } from '@/providers/MarkdownProvider';
import { logErrorToDiscord } from "@/src/app/utils/logError";
import ErrorLayout from "@/components/Static/ErrorLayout";
import { PageHero } from "@/components/PageHero/UsePageHero";
import { fetchLegalPages } from '@/src/fetchers/legal';
import { useSWRClient } from '@/providers/SWR/config';

export const TermsOfService: FC = ({ }) => {
    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    const { data, error } = useSWRClient(
        {
            repoOwner: 'NodeByteHosting',
            repoName: 'assets/contents/markdown',
            filePath: `legal/terms.md?ref=main`,
            slug,
            type: 'page',
        },
        fetchLegalPages
    );

    const content = data?.content || 'Loading...';

    useEffect(() => {
        if (error) {
            logErrorToDiscord({
                title: 'Error: failed to fetch!',
                message: error.message,
                page: pathname,
                source: 'TermsOfService',
                status: 500,
            });
        }
    }, [error, pathname]);

    return (
        <>
            <PageHero
                title="Terms of Service"
                text="The stuff no one wants to read but everyone should know."
                sup={{ title1: "Last updated", title2: "2024 -", title3: "11 -", title4: "20" }}
            />
            {error || !data ? (
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