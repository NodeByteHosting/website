'use client'; // Tells next its a client component not server if you look at my other page layouts they all do this for a reason :wink:

import { FC } from "react";
import s from "../styles/aboutUs.module.scss";
import { motion } from "framer-motion";

export const AboutUs: FC = () => {
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
    <section className={`${s.Advantages} bg-dark`}>
      <div className="container">
        <section className={s.Wrapper}>
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2, once: true }}
            className={s.Header}
          >
            <motion.h2 variants={animation} custom={3} className="text-white">
              NodeByte Hosting was founded in January 2024 by Connor & Harley. Our mission is to deliver Fast, reliable, scalable and secure hosting services for your business or gaming experience.
            </motion.h2>
          </motion.section>
        </section>
      </div>
    </section>
  );
};
