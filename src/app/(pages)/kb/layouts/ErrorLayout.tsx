"use client";

import Link from "next/link";
import { IoBookSharp } from "react-icons/io5";
import { GiDatabase } from "react-icons/gi";
import { MdHomeFilled } from "react-icons/md";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { BiSolidUserVoice } from "react-icons/bi";

export default function ErrorLayout() {
    const DATA_CARDS = [
        {
            title: "Home",
            href: "/",
            suptTitle: "Return to Home page.",
            icon: <MdHomeFilled size={26} />,
        },
        {
            title: "Documentation",
            href: "https://docs.nodebyte.host",
            suptTitle: "Start integrating our products with your project.",
            icon: <IoBookSharp size={26} />,
        },
        {
            title: "Knowledge Base",
            href: "/kb",
            suptTitle: "Find answers to common questions.",
            icon: <GiDatabase size={26} />,
        },
        {
            title: "Get Support",
            href: "https://billing.nodebyte.host/submitticket.php",
            suptTitle: "Open a ticket to get help from our team.",
            icon: <BiSolidUserVoice size={26} />,
        },
        {
            title: "Blog",
            href: "https://nodebyte.co.uk/blog",
            suptTitle: "Read our latest news and articles.",
            icon: <PiContactlessPaymentFill size={26} />,
        },
    ];
    return (
        <>
            <motion.section className="py-16 bg-dark">
                <div className="container">
                    <section className="grid md:grid-cols-5 gap-4">
                        {DATA_CARDS.map((card, i) => (
                            <Link
                                key={i}
                                href={card.href}
                                className="relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg p-4 transition-background"
                            >
                                <div className="text-gradient-4 border-1 border-gray/20 rounded-md inline-block p-2">
                                    {card.icon}
                                </div>
                                <div className="mt-2">
                                    <h5 className="text-white font-medium">
                                        {card.title}
                                    </h5>
                                    <p className="text-white/50 text-sm">{card.suptTitle}</p>
                                </div>
                                <i className="absolute top-1 right-1 text-gray">
                                    <FiExternalLink />
                                </i>
                            </Link>
                        ))}
                    </section>
                </div>
            </motion.section>
        </>
    );
}
