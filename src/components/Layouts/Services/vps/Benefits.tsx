'use client';

import { FC, useContext } from "react";
import { motion } from "framer-motion";
import AdvantageCard from "ui/AdvantageCard";
import s from "styling/modules/Advantages/global.module.scss";
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";
import { Cpu, Server, Shield, Terminal, Clock, DollarSign } from "lucide-react";

const WhyChooseUs: FC = () => {
    const { targetRef } = useContext(useButtonScrollContext);
    const BENEFITS_LIST = [
        {
            icon: <Cpu strokeWidth={1.5} size={24} />,
            title: "Powerful Hardware",
            content: "Experience exceptional performance with our AMD Ryzen™ 9 processors and DDR4 RAM, ensuring your applications run smoothly.",
        },
        {
            icon: <Server strokeWidth={1.5} size={24} />,
            title: "Full Root Access",
            content: "Get complete control over your VPS with root access. Install any software, configure your server, and manage resources as needed.",
        },
        {
            icon: <Shield strokeWidth={1.5} size={24} />,
            title: "DDoS Protection",
            content: "Keep your services online with our enterprise-grade DDoS protection, ensuring your applications remain accessible 24/7.",
        },
        {
            icon: <Terminal strokeWidth={1.5} size={24} />,
            title: "Multiple OS Options",
            content: "Choose from a variety of Linux distributions and Windows Server options to match your specific requirements.",
        },
        {
            icon: <Clock strokeWidth={1.5} size={24} />,
            title: "Instant Deployment",
            content: "Get your VPS up and running in minutes with our automated deployment system. Quick, efficient, and hassle-free.",
        },
        {
            icon: <DollarSign strokeWidth={1.5} size={24} />,
            title: "Scalable Resources",
            content: "Start small and scale up as needed. Easily upgrade your CPU, RAM, and storage to match your growing demands.",
        },
    ];

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
            className={`${s.Advantages} bg-dark`}
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
                            Enterprise-Grade VPS
                        </motion.h3>
                        <motion.h2
                            variants={animation}
                            custom={2}
                            className="text-white"
                        >
                            Why Choose Our VPS?
                        </motion.h2>
                        <motion.p variants={animation} custom={3} className="text-white/50">
                            Experience premium VPS hosting with features designed for optimal performance and reliability.
                        </motion.p>
                    </motion.section>
                    <section className={s.Content}>
                        {BENEFITS_LIST.map((card, i) => (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ amount: "some", once: true }}
                                variants={animation}
                                custom={i}
                                key={i}
                            >
                                <AdvantageCard
                                    icon={card.icon}
                                    title={card.title}
                                    content={card.content}
                                    duration={Math.floor(Math.random() * 10000) + 10000}
                                    borderRadius="0.4rem"
                                    className="flex-1 border-blue/50"
                                />
                            </motion.div>
                        ))}
                    </section>
                </section>
            </div>
        </section>
    );
};

export default WhyChooseUs;