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
            title: "What operating systems do you support?",
            text: "We support a wide range of operating systems including Ubuntu, Debian, CentOS, Fedora, and Windows Server. You can choose the OS that best suits your needs during deployment.",
        },
        {
            title: "Do I get full root/administrator access?",
            text: "Yes! You get complete root/administrator access to your VPS. This means you can install any software, configure system settings, and manage your server resources as needed.",
        },
        {
            title: "What kind of hardware do you use?",
            text: "Our VPS servers run on high-performance AMD Ryzen™ 9 processors with DDR4 RAM and NVMe SSD storage. This ensures excellent performance for all your applications.",
        },
        {
            title: "How is the network protection?",
            text: "We provide enterprise-grade DDoS protection for all VPS servers. Our network is monitored 24/7, and we maintain multiple redundant connections to ensure high availability.",
        },
        {
            title: "What kind of support do you offer?",
            text: "We offer 24/7 technical support through Discord, email, and support tickets. Our team can assist with server setup, network issues, OS installation, and general troubleshooting.",
        },
        {
            title: "Can I upgrade my VPS resources?",
            text: "Yes, you can easily scale your VPS resources up or down through our control panel. This includes CPU cores, RAM, and storage space. Changes are typically applied within minutes.",
        }
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
                                className="text-green"
                            >
                                VPS Hosting FAQs
                            </motion.h3>
                            <motion.h2
                                variants={animation}
                                custom={2}
                                className="text-white"
                            >
                                Common Questions
                            </motion.h2>
                            <motion.p variants={animation} custom={3} className="text-white/50">
                                Everything you need to know about our VPS hosting services.
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
                        <Image src={"/FAQ/img.png"} width={1000} height={1000} alt="VPS Hosting FAQ" />
                    </figure>
                </section>
            </div>
        </section>
    );
};