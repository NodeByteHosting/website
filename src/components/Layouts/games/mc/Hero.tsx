'use client';

import { FC } from "react";
import { motion } from "framer-motion";
import s from "styling/modules/Hero/global.module.scss";
import { CobeGlobe } from "ui/Earth/Globe";

const ServicesHero: FC = () => {
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
            className={`${s.Hero} relative bg-black bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')]`}
        >
            <div className="absolute bottom-0 left-0 w-full h-20 "></div>
            <div className="container relative z-10">
                <section className={s.Wrapper}>
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className={s.Content}
                    >
                        <motion.h1
                            custom={2}
                            variants={animation}
                            translate="no"
                            className="text-white"
                        >
                            Minecraft Servers
                        </motion.h1>
                        <motion.p custom={3} variants={animation} className="text-white/70">
                            We offer some of the best, cheapest and most reliable Minecraft servers on the market.
                        </motion.p>
                    </motion.section>
                </section>
            </div>
            <div className="absolute inset-0 bg-black opacity-50 z-0">
                <CobeGlobe />
            </div>
        </section>
    );
};

export default ServicesHero;