import { FC, useContext } from "react";
import { motion } from "framer-motion";
import AdvantageCard from "ui/AdvantageCard";
import s from "styling/modules/Advantages/global.module.scss";
import { useButtonScrollContext } from "@/src/providers/ButtonScroll";
import { Server, Gamepad2, Shield, Settings, Clock, DollarSign } from "lucide-react";

export const Advantages: FC = ({ }) => {
  const { targetRef } = useContext(useButtonScrollContext);
  const DATA_CARDS = [
    {
      icon: <Server strokeWidth={1.5} size={24} />,
      title: "VPS Excellence",
      content: "Achieve unparalleled performance and reliability with our VPS solutions, boasting scalable resources and a 99.6% uptime.",
    },
    {
      icon: <Gamepad2 strokeWidth={1.5} size={24} />,
      title: "Minecraft Bliss",
      content: "Enjoy lag-free gaming on our robust Minecraft servers, optimized for an extraordinary and immersive experience.",
    },
    {
      icon: <Shield strokeWidth={1.5} size={24} />,
      title: "Ironclad Security",
      content: "Stay protected with cutting-edge security features, including DDoS protection and frequent updates to guard your data.",
    },
    {
      icon: <Settings strokeWidth={1.5} size={24} />,
      title: "Effortless Control",
      content: "Manage your servers with ease using our intuitive panels, designed for seamless and user-friendly operation.",
    },
    {
      icon: <Clock strokeWidth={1.5} size={24} />,
      title: "Reliable Support",
      content: "Receive 24/7 assistance from our expert support team, ready to resolve your issues anytime, day or night.",
    },
    {
      icon: <DollarSign strokeWidth={1.5} size={24} />,
      title: "Value for Money",
      content: "Get top-tier hosting services at competitive prices, ensuring you receive the best value without compromising quality.",
    },
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
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: "some", once: true }}
                variants={animation}
                custom={i}
                key={i}
              >
                <AdvantageCard
                  icon={card.icon}
                  title={card.title}
                  content={card.content}
                  duration={Math.floor(Math.random() * 10000) + 10000}
                  borderRadius="0.4rem"
                  className="flex-1 border-blue/50"
                />
              </motion.div>
            ))}
          </section>
        </section>
      </div>
    </section>
  );
};