import s from "../advantages/styles/Advantages.module.scss";
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";
import { FC, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Review {
    title: string;
    content: string;
    reviewer: string;
    reviewer_img: string;
    rating_img: string;
    date: string;
}

export const Reviews: FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { targetRef } = useContext(useButtonScrollContext);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                setReviews(data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const animation = {
        hidden: {
            y: 30,
            opacity: 0,
        },
        visible: (custom: number) => ({
            y: 0,
            opacity: 1,
            transition: { delay: custom * 0.1, duration: 0.3, ease: "easeOut" },
        }),
    };

    return (
        <section
            ref={targetRef}
            className={`${s.Advantages} bg-grey-800`}
        >
            <div className="container">
                <section className={s.Wrapper}>
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.2, once: true }}
                        className={s.Header}
                    >
                        <motion.h3 variants={animation} custom={1} className="text-green">
                            Check these out
                        </motion.h3>
                        <motion.h2
                            variants={animation}
                            custom={2}
                            className="text-white"
                        >
                            Customer Reviews
                        </motion.h2>
                        <motion.p variants={animation} custom={3} className="text-gray">
                            Here are some of the reviews we have received from our satisfied customers.
                        </motion.p>
                    </motion.section>
                    <section className="mt-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={index}
                                className="gap-3 py-6 sm:flex sm:items-start"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ amount: 0.2, once: true }}
                                variants={animation}
                                custom={index}
                            >
                                <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                                    <div className="flex items-center gap-0.5">
                                        <Image
                                            src={review.reviewer_img}
                                            alt={review.reviewer}
                                            width={44}
                                            height={44}
                                            className="rounded-full"
                                        />
                                        <p className="text-base font-semibold text-white">{review.reviewer}</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-sm font-normal text-white/50">{review.date}</p>
                                    </div>
                                </div>

                                <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                                    <p className="text-base font-normal text-white/50">{review.content}</p>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={review.rating_img}
                                            alt={`Rating: ${review.title}`}
                                            width={100}
                                            height={20}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </section>
                </section>
            </div>
        </section>
    );
};