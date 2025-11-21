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
            title: "Do you guys support Rust Modded Framework?",
            text: "Yes, we support Oxide/Umod plugins. This can be activated either from payment or later through the Game panel.",
        },
        {
            title: "How many players can join my server?",
            text: "It depends on the plan you choose. Our plans support a range of player slots, from 40 to 200+ players. You can also upgrade your plan at any time to increase player capacity. We do not limit the number of players that can join your server, but we recommend a maximum of 40 players for our Starter plan.",
        },
        {
            title: "Do you offer automatic backups?",
            text: "Yes, we perform regular automatic backups of your Rust server. You can also create manual backups through our control panel at any time, ensuring your world and player data are always safe.",
        },
        {
            title: "What kind of support do you offer?",
            text: "We offer 24/7 customer support through Discord, email, and support tickets.",
        },
        {
            title: "Do you guys offer Rust+ support?",
            text: "We do offer Rust+ support. To enable this, please contact our support team after purchasing your server and we will assist you in setting it up.",
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
