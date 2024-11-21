// React
import { FC, useContext } from "react";
// Styles
import s from "./styles/Advantages.module.scss";
// Animations
import { motion } from "framer-motion";
// Icons
import { Gem, Crown, Rocket, Server, Gamepad2, Shield } from "lucide-react";
// Providers
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";

export const Advantages: FC = ({ }) => {
  const { targetRef } = useContext(useButtonScrollContext);
  const DATA_CARDS = [
    {
      icon: <Server strokeWidth={1.5} size={24} />,
      title: "High-Performance VPS",
      content:
        "Our Virtual Private Servers (VPS) are designed to provide high performance, reliability, and security for your business or gaming needs. Enjoy scalable resources and 99.6% uptime guarantee.",
    },
    {
      icon: <Gamepad2 strokeWidth={1.5} size={24} />,
      title: "Dedicated Minecraft Servers",
      content:
        "Experience seamless gaming with our dedicated Minecraft servers. We offer powerful hardware and optimized configurations to ensure a lag-free and enjoyable gaming experience.",
    },
    {
      icon: <Shield strokeWidth={1.5} size={24} />,
      title: "Top-Notch Security",
      content:
        "Security is our top priority. Our servers are equipped with advanced security measures to protect your data and ensure your peace of mind. Enjoy DDoS protection and regular security updates.",
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
    <section
      ref={targetRef}
      className={`${s.Advantages} bg-dark`}
    >
      <div className="container">
        <section className={s.Wrapper}>
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2, once: true }}
            className={s.Header}
          >
            <motion.h3 variants={animation} custom={1} className="text-green">
              Our Advantages
            </motion.h3>
            <motion.h2
              variants={animation}
              custom={2}
              className="text-white"
            >
              Why choose us?
            </motion.h2>
            <motion.p variants={animation} custom={3} className="text-gray">
              At NodeByte Hosting, we provide top-notch virtual private servers (VPS) and Minecraft servers tailored to meet your needs. Our services ensure high performance, reliability, and security for your business or gaming experience.
            </motion.p>
          </motion.section>
          <section className={s.Content}>
            {DATA_CARDS.map((card, i) => (
              <motion.article
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: "some", once: true }}
                variants={animation}
                custom={i}
                className={`${s.Card} shadow bg-dark_gray hover:bg-black_secondary`}
                key={i}
              >
                <div className={` text-white`}>{card.icon}</div>
                <h3 className="text-white">{card.title}</h3>
                <p className="text-gray">{card.content}</p>
              </motion.article>
            ))}
          </section>
        </section>
      </div>
    </section>
  );
};
