'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FC, useEffect, useState, useContext } from 'react';
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";
import { Avatar, AvatarFallback, AvatarImage } from "ui/Avatar";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { reviewsList } from '@/src/constants/reviewContent';
import s from "../advantages/styles/Advantages.module.scss";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ui/Card";
import { Button } from 'ui/Button/Standard';
import { cn } from "tailwind";

export interface Review {
    image: string;
    name: string;
    date: string;
    comment: string;
    rating: number;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

export const Reviews: FC = () => {
    const [reviews, setReviews] = useState<Review[]>(reviewsList);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { targetRef } = useContext(useButtonScrollContext);
    const [expandedReview, setExpandedReview] = useState<number | null>(null);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, []);

    const handleNext = () => {
        if (currentIndex < reviews.length - 1) {
            setDirection(1);
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    const toggleReadMore = (index: number) => {
        if (index === currentIndex) {
            setExpandedReview(expandedReview === index ? null : index);
        }
    };

    const getCarouselReviews = () => {
        const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        const nextIndex = (currentIndex + 1) % reviews.length;

        return [
            reviews[prevIndex],
            reviews[currentIndex],
            reviews[nextIndex],
        ];
    };

    const carouselReviews = getCarouselReviews();

    return (
        <section ref={targetRef} className={`${s.Advantages} bg-grey-800`}>
            <div className="container">
                <section className={s.Wrapper}>
                    <motion.section initial="hidden" whileInView="visible" viewport={{ amount: 0.2, once: true }} className={s.Header}>
                        <motion.h3 className="text-green">Check these out</motion.h3>
                        <motion.h2 className="text-white">Customer Reviews</motion.h2>
                        <motion.p className="text-gray">Here are some of the reviews we have received from our satisfied customers.</motion.p>
                    </motion.section>
                    <section className="mt-10 flex flex-col items-center relative overflow-hidden w-full">
                        <div className="flex w-full justify-center relative overflow-hidden h-auto">
                            <Button size="icon" variant="gradient" onClick={handlePrevious} disabled={currentIndex === 0} className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-lg z-10">
                                <ArrowLeft className="h-4 w-4" color="white" />
                            </Button>
                            <div className="flex w-full justify-center relative">
                                <AnimatePresence initial={false} custom={direction}>
                                    {carouselReviews.map((review, index) => {
                                        const isActive = index === 1;
                                        return (
                                            <motion.div
                                                key={index}
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{ duration: 0.5 }}
                                                className={cn(
                                                    "w-full max-w-md lg:max-w-lg flex-shrink-0 -mx-36",
                                                    { "z-20": isActive, "z-10": !isActive }
                                                )}
                                                style={{ transform: isActive ? 'scale(1)' : 'scale(0.9)', filter: isActive ? 'none' : 'blur(4px)' }}
                                            >
                                                <Card className="rounded-lg border border-green/20 shadow bg-black_secondary hover:bg-dark_gray bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')]">
                                                    <CardContent className="pt-6 pb-0 text-white/50">
                                                        <div className="flex gap-1 pb-6">
                                                            {[...Array(Math.round(review.rating))].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 fill-green text-blue" />
                                                            ))}
                                                        </div>
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>
                                                            {expandedReview === currentIndex ? review.comment : `${review.comment.substring(0, 170)}...`}
                                                            <button
                                                                onClick={() => toggleReadMore(currentIndex)}
                                                                className="text-transparent bg-clip-text bg-gradient-to-br from-blue to-green hover:underline ml-2"
                                                            >
                                                                {expandedReview === currentIndex ? 'Read Less' : 'Read More'}
                                                            </button>
                                                        </p>
                                                    </CardContent>
                                                    <CardHeader>
                                                        <div className="flex flex-row items-center gap-4">
                                                            <Avatar>
                                                                <AvatarImage src={review.image} alt={review.name} />
                                                                <AvatarFallback className="bg-gradient-to-br from-blue to-green text-white">{review.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <CardTitle className="text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">{review.name}</CardTitle>
                                                                <CardDescription className="text-white/50">{review.date}</CardDescription>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                            <Button size="icon" variant="gradient" onClick={handleNext} disabled={currentIndex >= reviews.length - 1} className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-lg z-10">
                                <ArrowRight className="h-4 w-4" color="white" />
                            </Button>
                        </div>
                        <div className="flex justify-center w-full mt-4 relative z-20 gap-4 lg:hidden">
                            <Button size="icon" variant="gradient" onClick={handlePrevious} disabled={currentIndex === 0}>
                                <ArrowLeft className="h-4 w-4" color="white" />
                            </Button>
                            <Button size="icon" variant="gradient" onClick={handleNext} disabled={currentIndex === reviews.length - 1}>
                                <ArrowRight className="h-4 w-4" color="white" />
                            </Button>
                        </div>
                    </section>
                </section>
            </div>
        </section>
    );
};