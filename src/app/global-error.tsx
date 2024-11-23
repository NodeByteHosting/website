"use client";

import Link from "next/link";
import { IoBookSharp } from "react-icons/io5";
import { GiDatabase } from "react-icons/gi";
import { MdHomeFilled } from "react-icons/md";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { PageHero } from "@/src/app/components/PageHero/UsePageHero";
import { BiSolidUserVoice } from "react-icons/bi";
import ErrorLayout from "./components/Static/ErrorLayout";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <>
            <html>
                <body
                    className="bg-gradient-to-br from-grey-900 via-dark_gray to-black border-gray-200"
                    suppressHydrationWarning
                    suppressContentEditableWarning
                >
                    <PageHero
                        text="Oops, something went wrong."
                        title="Internal Server Error"
                    />
                    <ErrorLayout />
                </body>
            </html>
        </>
    );
}
