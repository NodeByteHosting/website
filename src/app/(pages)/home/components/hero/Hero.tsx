import { FC } from "react";
import { motion } from "framer-motion";
import s from "./styles/Hero.module.scss";
import dynamic from "next/dynamic";

const CobeGlobe = dynamic(() => import("@/components/UI/Earth/Globe").then(mod => mod.CobeGlobe));

export const Hero: FC = ({ }) => {
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
            <motion.h2
              custom={1}
              variants={animation}
              className="text-white "
            >
              <div className="border-1 border-gray/20 rounded-full py-2 px-3 bg-black_secondary">
                Welcome to the{" "}
                <span className="font-bold">exciting </span>
                new <span className="font-bold">NodeByte </span> experience!
              </div>
            </motion.h2>
            <motion.h1
              custom={2}
              variants={animation}
              translate="no"
              className="text-white"
            >
              NodeByte Hosting
            </motion.h1>
            <motion.p custom={3} variants={animation} className="text-white/70">
              Fast, reliable, scalable and secure hosting services for your business or gaming experience.{" "}
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