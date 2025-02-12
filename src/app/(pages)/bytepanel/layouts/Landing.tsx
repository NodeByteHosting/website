'use client';

import { FC } from 'react';
import { motion } from "framer-motion";
import { PageHero } from '@/src/app/components/PageHero/UsePageHero';

export const BytePanelLanding: FC = ({ }) => {
    return (
        <>
            <PageHero
                title="BytePanel v2"
                text="Experience the next generation of game hosting with our new and improved panel."
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Introducing Our New Panel</h2>
                        <p className="text-lg text-white/70">
                            Our new game hosting panel is designed to provide you with the best hosting experience.
                            With a user-friendly interface, powerful features, and seamless performance,
                            you can manage your game servers with ease.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Feature 1</h3>
                            <p className="text-sm text-white mb-4">
                                Description of the first feature. Highlight the benefits and how it improves the user experience.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Feature 2</h3>
                            <p className="text-sm text-white mb-4">
                                Description of the second feature. Highlight the benefits and how it improves the user experience.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Feature 3</h3>
                            <p className="text-sm text-white mb-4">
                                Description of the third feature. Highlight the benefits and how it improves the user experience.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
};