'use client';
import "atropos/css";

import { FC } from "react";
import Atropos from "atropos/react";
import { motion } from "framer-motion";
import s from "styling/modules/Services/global.module.scss";
import { DataCard } from "types/services";
import ServiceCard from "ui/Card/Service";
import { MINECRAFT_DATA_CARDS } from "consts/services/mcData";
import { AlertTriangle } from "lucide-react";

const ServersList: FC = () => {
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

    const NoServersMessage = () => (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: "some", once: true }}
            variants={animation}
            custom={1}
            className="flex flex-col items-center justify-center p-8 text-center"
        >
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
                Whoops! No Servers Available
            </h3>
            <p className="text-gray-400 max-w-md">
                We're currently out of stock. Please check back later or join our Discord
                to be notified when new servers become available.
            </p>
        </motion.div>
    );

    const renderCards = (dataCards: DataCard[]) => (
        <section className={s.Cards}>
            {dataCards.map((card, i) => (
                <Atropos
                    rotateTouch={false}
                    highlight={false}
                    shadow={false}
                    className="bg-transparent"
                    key={i}
                >
                    <motion.article
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: "some", once: true }}
                        variants={animation}
                        custom={i}
                    >
                        <ServiceCard
                            {...card}
                            borderRadius="0.5rem"
                            className="h-full"
                            containerClassName="h-full"
                        />
                    </motion.article>
                </Atropos>
            ))}
        </section>
    );

    return (
        <section className={`${s.Prices} bg-grey-800`} id="our-services">
            <div className="container">
                <section className={s.Wrapper}>
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.2, once: true }}
                        className={s.Header}
                    >
                        <motion.h2
                            variants={animation}
                            custom={2}
                            className="text-white"
                        >
                            Available Servers
                        </motion.h2>
                        <motion.p variants={animation} custom={3} className="text-gray">
                            Choose from a variety of servers to suit your needs.
                        </motion.p>
                    </motion.section>
                    {MINECRAFT_DATA_CARDS.length > 0
                        ? renderCards(MINECRAFT_DATA_CARDS)
                        : <NoServersMessage />
                    }
                </section>
            </div>
        </section>
    );
};

export default ServersList;