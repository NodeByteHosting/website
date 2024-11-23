'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageHero } from '@/src/app/components/PageHero/UsePageHero';
import { CalendarIcon, EditIcon } from "lucide-react";
import { Blog, allBlogs } from "contentlayer/generated";

interface Post {
    slug: string;
    title: string;
    author: string;
    content: string;
    tags: string[];
    date: string;
    [key: string]: any;
}

export default function BlogsListPage() {
    const blogs = allBlogs.sort((a, b) =>
        new Date(a.date) < new Date(b.date) ? 1 : -1
    );

    return (
        <>
            <PageHero
                title="NodeByte Blog"
                text="Stay updated with the latest blog posts."
            />
            <motion.section className="py-16 bg-dark">
                <div className="container">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post: any, i: any) => (
                            <Link
                                href={post.url}
                                key={i}
                            >
                                <article key={i} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                    <Image
                                        alt={post.title}
                                        src={post.image}
                                        width={400}
                                        height={400 * (9 / 16)}
                                        className="rounded-xl w-full"
                                    />
                                    <div className="flex flex-col gap-4 mt-2">
                                        <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                                        <div className="flex flex-row gap-2 text-sm text-muted-foreground items-center">
                                            <CalendarIcon className="w-4 h-4 text-green" />
                                            <p className="bg-clip-text text-transparent bg-status-card-text">
                                                {new Date(post.date).toLocaleDateString(undefined, {
                                                    dateStyle: "medium",
                                                })}
                                            </p>
                                            <EditIcon className="ml-4 w-4 h-4 text-green" />
                                            <p className="bg-clip-text text-transparent bg-status-card-text">{post.author}</p>
                                        </div>
                                        <p className="text-white/50 text-sm md:text-base">
                                            {post.description}
                                        </p>
                                        <p className="bg-clip-text text-transparent bg-status-card-text font-medium mt-auto">
                                            {"Read More ->"}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </section>
                </div>
            </motion.section>
        </>
    );
}