'use client';

import { FC, useContext } from "react";
import { motion } from "framer-motion";
import AdvantageCard from "ui/AdvantageCard";
import s from "styling/modules/Advantages/global.module.scss";
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";
import { Cpu, Gamepad2, Shield, Settings, Clock, DollarSign } from "lucide-react";

const WhyChooseUs: FC = () => {
    const { targetRef } = useContext(useButtonScrollContext);
    const BENEFITS_LIST = [
        {
            icon: <Cpu strokeWidth={1.5} size={24} />,
            title: "High Performance",
            content: "Experience lag-free gameplay with our high-performance servers, optimized for low latency and high tick rates.",
        },
        {
            icon: <Gamepad2 strokeWidth={1.5} size={24} />,
            title: "Modded Support",
            content: "Play your favorite modpacks and plugins with ease. Our servers support a wide range of mods and plugins for endless customization.",
        },
        {
            icon: <Shield strokeWidth={1.5} size={24} />,
            title: "DDoS Protection",
            content: "Keep your Minecraft server safe with our enterprise grade DDoS protection, ensuring your players can connect without interruption.",
        },
        {
            icon: <Settings strokeWidth={1.5} size={24} />,
            title: "Easy Management",
            content: "Control your Minecraft server through our intuitive panel. Install plugins, manage players, and configure settings with just a few clicks.",
        },
        {
            icon: <Clock strokeWidth={1.5} size={24} />,
            title: "Instant Setup",
            content: "Get your Minecraft server up and running in minutes with our automated setup process. No technical knowledge required.",
        },
        {
            icon: <DollarSign strokeWidth={1.5} size={24} />,
            title: "Flexible Plans",
            content: "Choose from a variety of plans to suit your needs, you can even upgrade or downgrade your plan at any time.",
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
                            You won't regret it!
                        </motion.h3>
                        <motion.h2
                            variants={animation}
                            custom={2}
                            className="text-white"
                        >
                            Why Choose Our Hosting?
                        </motion.h2>
                        <motion.p variants={animation} custom={3} className="text-white/50">
                            Experience premium Minecraft hosting with features designed for the perfect gameplay experience.
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