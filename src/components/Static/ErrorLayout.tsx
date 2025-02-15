"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { ERROR_PAGE_LINKS } from "utils/errorLinks";
import { DynamicIcon } from "providers/DynamicIcon";

interface DynamicIconProps {
    iconName: string;
    size?: number;
    color?: string;
}

export default function ErrorLayout() {
    return (
        <>
            <motion.section className="py-16 bg-dark">
                <div className="container">
                    <section className="grid md:grid-cols-5 gap-4">
                        {ERROR_PAGE_LINKS.map((card, i) => (
                            <Link
                                key={i}
                                href={card.href}
                                className="relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg p-4 transition-background"
                            >
                                <div className="text-gradient-4 border-1 border-gray/20 rounded-md inline-block p-2">
                                    <DynamicIcon iconName={card.icon} />
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
