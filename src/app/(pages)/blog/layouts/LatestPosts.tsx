'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { PulseTitleBanner } from '../../announcements/components/PulseTitleBanner';
import { FaBlogger, FaCalendarAlt } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

interface Post {
    slug: string;
    title: string;
    author: string;
    content: string;
    tags: string[];
    date: string;
    [key: string]: any;
}

export const LatestPosts: FC = ({ }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch('/api/blog')
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'OK') {
                    setPosts(data.posts);
                }
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <>
            <PulseTitleBanner
                title="NodeByte Blog"
                text="Stay updated with the latest blog posts."
            />
            <motion.section className="py-16 bg-dark">
                <div className="container">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any, i: any) => (
                            <article key={i} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-4 text-gray-500">
                                        <span className="bg-dark text-white text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                                            <FaBlogger className="mr-1 w-3 h-3" />
                                            {post.tags[0]}
                                        </span>
                                        <span className="text-sm flex items-center text-white/50">
                                            <FaCalendarAlt className="mr-1 text-white/50" />
                                            {post.publishDate}
                                        </span>
                                    </div>
                                    <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="mb-6 font-light text-white/50">
                                        {post.excerpt}...
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex items-center">
                                        <img className="w-7 h-7 rounded-full" src="/logo.png" alt="NodeByte Logo" />
                                        <span className="font-medium text-white">
                                            {post.author ? post.author : 'System'}
                                        </span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                        Read more
                                        <FiExternalLink className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </motion.section>
        </>
    );
};