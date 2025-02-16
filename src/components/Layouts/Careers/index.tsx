'use client';

import { FC } from 'react';
import Link from 'next/link';
import Atropos from "atropos/react";
import { motion } from "framer-motion";
import { PageHero } from 'components/PageHero';
import { Check, InfoIcon } from "lucide-react";
import { ButtonGradient } from "components/UI/Button/ButtonGradient";
import s from "styling/modules/Careers/global.module.scss";

/**
 * Job details object.
 *
 * @property {string} location - Job location. Can be "Remote" or a specific location.
 * @property {string} status - Job status. Can be "Full-time", "Part-time", "Volunteer", etc.
 * @property {string} payment - Job payment. Can be "Salary", "Hourly", "Not applicable", etc.
 * @property {string|boolean} [key] - Additional job details. Can be a string or boolean.
 */
interface JobDetails {
    location: string;
    status: string;
    payment: string;
    [key: string]: string | boolean;
}

/**
 * Job card interface.
 *
 * @property {string} title - Job title.
 * @property {string} info - Job information.
 * @property {JobDetails} details - Job details.
 * @property {string} link - Job application link.
 */
interface JobCard {
    title: string;
    info: string;
    details: JobDetails;
    link: string;
}

const DATA_CARDS: JobCard[] = [];

/**
 * Animation configuration object for motion components.
 *
 * @property hidden - Initial state of the animation, with an offset on the y-axis and fully transparent.
 * @property visible - Function returning the visible state of the animation based on a custom parameter.
 *  - @param {number} custom - Custom delay multiplier for staggering animations.
 *  - @returns {object} - Visible state with no y-axis offset, full opacity, and a transition configuration.
 */
const animation = {
    hidden: { y: 30, opacity: 0 },
    visible: (custom: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: custom * 0.2, duration: 0.4, ease: "easeOut" },
    }),
};

export const CareersLanding: FC = ({ }) => {
    return (
        <>
            <PageHero
                title="Join our Team"
                text="We're looking for talented individuals to help us shape the future of hosting services."
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Work With Us?</h2>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            At NodeByte Hosting, we believe in fostering a collaborative and innovative work environment. Join us to be a part of a team that values creativity, growth, and making a real impact in the hosting industry.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Innovative Projects</h3>
                            <p className="text-sm text-white mb-4">
                                Work on cutting-edge projects that push the boundaries of hosting technology.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Collaborative Environment</h3>
                            <p className="text-sm text-white mb-4">
                                Join a team of passionate professionals who value collaboration and teamwork.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Growth Opportunities</h3>
                            <p className="text-sm text-white mb-4">
                                Take advantage of opportunities for personal and professional growth.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section className="py-16 bg-grey-800">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Culture</h2>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            At NodeByte Hosting, we foster a culture of innovation, collaboration, and growth. We believe in empowering our team members to achieve their best and make a real impact.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 relative shadow bg-dark hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Inclusive Environment</h3>
                            <p className="text-sm text-white mb-4">
                                We value diversity and strive to create an inclusive environment where everyone can thrive.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Continuous Learning</h3>
                            <p className="text-sm text-white mb-4">
                                We encourage continuous learning and provide opportunities for professional development.
                            </p>
                        </div>
                        <div className="p-6 relative shadow bg-dark hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">Work-Life Balance</h3>
                            <p className="text-sm text-white mb-4">
                                We believe in maintaining a healthy work-life balance to ensure the well-being of our team members.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
                        <p className="text-lg text-white/70">
                            Explore our current job openings and experience the next level of your career with NodeByte Hosting.
                        </p>
                    </div>
                    {DATA_CARDS.length > 0 ? (
                        <section className={`${s.Cards} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                            {DATA_CARDS.map((card, index) => (
                                <Atropos
                                    rotateTouch={false}
                                    highlight={false}
                                    shadow={false}
                                    key={index}
                                    className="bg-transparent"
                                >
                                    <motion.article
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={animation}
                                        custom={index}
                                        className={`${s.Card} p-6 border border-gray-700 bg-black_secondary rounded-lg shadow transition-all hover:scale-105`}
                                    >
                                        <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">
                                            {card.title}
                                        </h4>
                                        <p className="text-white/80 my-4">{card.info}</p>
                                        <ul className="mb-4">
                                            {Object.entries(card.details).map(([key, value], i) => (
                                                <li key={i} className="flex items-center mb-2 text-white/70">
                                                    <Check className="text-blue dark:text-green mr-2" size={18} />
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                    {" "}<span className="text-white/50 ml-1">{value.toString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <ButtonGradient
                                            radius="sm"
                                            size="md"
                                            value="Learn More"
                                            href={card.link}
                                        />
                                    </motion.article>
                                </Atropos>
                            ))}
                        </section>
                    ) : (
                        <div className="text-gray text-center text-sm flex items-center justify-center gap-2">
                            <InfoIcon />{" "}<p>No open positions available, please check back later or join our <Link href="https://discord.gg/NAphFuVm2V" className="text-green hover:text-blue">Discord Server</Link> and you can get notified when we are hiring.</p>
                        </div>
                    )}
                </div>
            </motion.section>
        </>
    );
};