'use client';

import md from "markdown-it";
import { motion } from "framer-motion";
import { RefundPolicyTitleBanner } from "../components/TitleBanner";
import { FC, useEffect, useState } from 'react';


export const RefundPolicyLayout: FC = ({ }) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchContent = async () => {
            const response = await fetch('/api/legal/refunds');
            const data = await response.json();
            setContent(data.content);
        };

        fetchContent();
    }, []);

    return (
        <>
            <RefundPolicyTitleBanner
                title="Refund Policy"
                text="The stuff no one wants to read but everyone should know."
                updated="Last updated: 2024-11-20"
            />
            <motion.section className="py-16 bg-dark">
                <div
                    className="container text-white markdown-body"
                    dangerouslySetInnerHTML={{
                        __html: md({
                            html: true,
                            linkify: true,
                            typographer: true
                        }).render(content)
                    }}
                />
            </motion.section>
        </>
    );
};