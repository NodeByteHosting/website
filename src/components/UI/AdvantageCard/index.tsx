"use client";
import React from "react";
import s from "@/pages/home/components/advantages/styles/Advantages.module.scss";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "tailwind";

interface AdvantageCardProps {
    icon: React.ReactNode;
    title: string;
    content: string;
    borderRadius?: string;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
}

const MovingBorder = ({
    children,
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
    [key: string]: any;
}) => {
    const pathRef = useRef<any>();
    const progress = useMotionValue<number>(0);

    useAnimationFrame((time) => {
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
        }
    });

    const x = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val).x
    );
    const y = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val).y
    );

    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <rect
                    fill="none"
                    width="100%"
                    height="100%"
                    rx={rx}
                    ry={ry}
                    ref={pathRef}
                />
            </svg>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

const AdvantageCard: React.FC<AdvantageCardProps> = ({
    icon,
    title,
    content,
    borderRadius = "1rem", // Reduced border radius
    duration,
    className,
    containerClassName,
    borderClassName,
}) => {
    return (
        <div
            className={cn(
                `bg-transparent relative text-xl overflow-hidden shadow bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] transition-all hover:scale-105`,
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
        >
            <div
                className="absolute inset-0 rounded-[1rem]" // Reduced border radius
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="20%" ry="20%"> // Adjusted rx and ry
                    <div
                        className={cn(
                            "h-12 w-auto opacity-[0.8] bg-[radial-gradient(#42d392_60%,#2C74B3_40%)]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            <div
                className={cn(
                    "relative bg-slate-900/[0.] border border-slate-800 backdrop-blur-2xl text-white flex flex-col items-start justify-center w-full h-full text-base antialiased p-6", // Changed items-center to items-start
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,

                }}
            >
                <div className={`${s.Card} flex items-center -mb-4 -mt-4`}>
                    <div className={`text-white mr-2 left-0`}>{icon}</div>
                    <h3 className="text-lg text-white">{title}</h3>
                </div>
                <p className="text-gray">{content}</p>
            </div>
        </div>
    );
};

export default AdvantageCard;