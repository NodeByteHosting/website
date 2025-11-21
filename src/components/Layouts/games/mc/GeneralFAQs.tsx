"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import s from "styling/modules/FAQS/global.module.scss";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const FAQ: FC = ({ }) => {
    const itemClasses = {
        base: "p-0",
        title:
            "text-white font-semibold text-sm md:font-medium  md:text-md ml-4",
        content: "text-gray text-sm md:text-md",
    };

    const DATA_ACCORDION = [
        {
            title: "What Minecraft versions do you support?",
            text: "We support all major Minecraft versions, from legacy versions to the latest releases. This includes both Java Edition and Bedrock Edition servers, allowing you to choose the version that best suits your needs.",
        },
        {
            title: "Can I install custom plugins and mods?",
            text: "Yes! Our servers fully support custom plugins and mods. You can easily install popular modpacks like FTB, or add individual plugins through our intuitive control panel. We support various server types including Forge, Paper, Purpur, and more.",
        },
        {
            title: "How many players can join my server?",
            text: "The number of players depends on your chosen plan. Our plans range from 4GB RAM supporting 10-20 players, up to 32GB RAM supporting 100+ players. The actual capacity may vary based on installed plugins and mods.",
        },
        {
            title: "Do you offer automatic backups?",
            text: "Yes, we perform regular automatic backups of your Minecraft server. You can also create manual backups through our control panel at any time, ensuring your world and player data are always safe.",
        },
        {
            title: "What kind of support do you offer?",
            text: "We offer 24/7 customer support through Discord, email, and support tickets. Our team is experienced with Minecraft server hosting and can help with setup, plugin installation, troubleshooting, and any other issues you encounter.",
        },
        {
            title: "Can I switch between server types?",
            text: "Yes, you can easily switch between different server types (Paper, Forge, etc.) through our control panel. We also provide one-click installers for popular modpacks and server configurations.",
        }
    ];

    // Animation
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
        <section className={`${s.FAQ} bg-dark`}>
            <div className="container">
                <section className={s.Wrapper}>
                    <section className={s.Content}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ amount: 0.2, once: true }}
                            className={s.Header}
                        >
                            <motion.h3
                                variants={animation}
                                custom={1}
                                className="text-green "
                            >
                                Additional information
                            </motion.h3>
                            <motion.h2
                                variants={animation}
                                custom={2}
                                className="text-white"
                            >
                                Frequently Asked Questions
                            </motion.h2>
                            <motion.p variants={animation} custom={3} className="text-white/50">
                                Anything else you need to know? We have the answers.
                            </motion.p>
                        </motion.div>
                        <Accordion
                            fullWidth
                            className={`${s.Accordion} mt-10 px-0 `}
                            itemClasses={itemClasses}
                        >
                            {DATA_ACCORDION.map((item, i) => (
                                <AccordionItem
                                    classNames={{
                                        base: "shadow bg-dark_gray hover:bg-black_secondary",
                                    }}
                                    className={`${s.AccordionItem} text-white ml-2`}
                                    key={i}
                                    title={item.title}
                                >
                                    <p className="ml-2">{item.text}</p>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>
                    <figure className={s.Image}>
                        <Image src={"/FAQ/img.png"} width={1000} height={1000} alt="" />
                    </figure>
                </section>
            </div>
        </section>
    );
};
