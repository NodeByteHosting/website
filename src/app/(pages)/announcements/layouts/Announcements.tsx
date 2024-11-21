'use client';

import Link from 'next/link';
import { useEffect, useState, FC } from 'react';
import { motion } from "framer-motion";
import { PulseTitleBanner } from "../components/PulseTitleBanner";
import { FaBlogger, FaCalendarAlt } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Announcement {
    id: number;
    title: string;
    announcement: string;
    date: string;
}

function stripHtmlTags(str: string): string {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

export const Announcements: FC = ({ }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/support/announcements/get');
                const data = await response.json();
                if (data.status === 'OK') {
                    setAnnouncements(data.announcements);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <>
            <PulseTitleBanner
                title="Announcements"
                text="Stay updated with the latest announcements."
            />
            <motion.section className="py-16 bg-dark">
                <div className="container">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="relative shadow bg-dark_gray rounded-lg p-6">
                                    <Skeleton height={24} width={24} baseColor='#0A2540' highlightColor='#0000FF' />
                                    <div className="mt-4">
                                        <Skeleton height={20} width="80%" baseColor='#0A2540' highlightColor='#0000FF' />
                                        <Skeleton height={15} width="60%" baseColor='#0A2540' highlightColor='#0000FF' />
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="text-white">
                                Error fetching announcements. Please try again later.
                            </div>
                        ) : (
                            announcements.map((announcement, i) => (
                                <article key={i} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-4 text-gray-500">
                                            <span className="bg-dark text-white text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                                                <FaBlogger className="mr-1 w-3 h-3" />
                                                Announcement
                                            </span>
                                            <span className="text-sm flex items-center text-white/50">
                                                <FaCalendarAlt className="mr-1 text-white/50" />
                                                {announcement.date}
                                            </span>
                                        </div>
                                        <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
                                            <Link href={`/announcements/${announcement.id}`}>
                                                {announcement.title}
                                            </Link>
                                        </h2>
                                        <p className="mb-6 font-light text-white/50">
                                            {stripHtmlTags(announcement.announcement).split(' ').slice(0, 20).join(' ')}...
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex items-center space-x-4">
                                            <img className="w-7 h-7 rounded-full" src="/logo.png" alt="NodeByte Logo" />
                                            <span className="font-medium text-white">
                                                System
                                            </span>
                                        </div>
                                        <Link href={`/announcements/${announcement.id}`} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                            Read more
                                            <FiExternalLink className="ml-2 w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>
                </div>
            </motion.section>
        </>
    );
};