"use client";
// React
import { FC } from "react";
// Animations
import { motion } from "framer-motion";
import s from "../../(pages)/home/components/hero/styles/Hero.module.scss";

type TTitleBannerPage = {
  supTitle: string;
  title: string;
  text: string;
};

export const TitleBannerPage: FC<TTitleBannerPage> = ({
  title,
  supTitle,
  text,
}) => {
  // Animation
  const animation = {
    hidden: {
      x: -30,
      opacity: 0,
    },
    visible: (custom: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: custom * 0.1, duration: 0.3, ease: "easeOut" },
    }),
  };
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`${s.Hero} bg-black bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] `}
    >
      <div className="container">
        <section>
          <motion.h3
            custom={1}
            variants={animation}
            className="text-gradient-3 font-normal"
          >
            {supTitle}
          </motion.h3>
          <motion.h2
            custom={2}
            variants={animation}
            className="text-white font-semibold text-3xl sm:text-4xl"
          >
            {title}
          </motion.h2>
          <motion.p
            custom={3}
            variants={animation}
            className="text-white/50 font-normal  text-sm sm:text-base"
          >
            {text}
          </motion.p>
        </section>
      </div>
    </motion.section>
  );
};
