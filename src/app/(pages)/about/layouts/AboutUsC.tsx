"use client";

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
            <motion.h2 variants={animation} custom={1} className="text-white">
              Welcome to NodeByte Hosting
            </motion.h2>
            <motion.p variants={animation} custom={2} className="text-white mt-4">
              Founded in January 2024 by Connor and Harley, NodeByte Hosting was created with a vision to revolutionize the hosting industry. Based in the United Kingdom, we specialize in delivering fast, reliable, and scalable hosting solutions tailored to meet the unique needs of businesses, gaming communities, and organizations worldwide.
            </motion.p>
            <motion.p variants={animation} custom={3} className="text-white mt-4">
              At NodeByte, we believe in empowering our clients with cutting-edge technology and unparalleled support. Our services are built on state-of-the-art infrastructure, ensuring lightning-fast performance and unmatched reliability. Whether you're launching a personal project, growing a business, or managing a high-traffic gaming server, our solutions are designed to scale seamlessly with your needs.
            </motion.p>
            <motion.p variants={animation} custom={4} className="text-white mt-4">
              What sets us apart is our commitment to customer success. Our dedicated team of experts works around the clock to provide proactive support and ensure your hosting experience is nothing short of exceptional. From robust security measures to seamless migrations, we handle the technical complexities so you can focus on what matters most—your goals.
            </motion.p>
            <motion.p variants={animation} custom={5} className="text-white mt-4">
              Join thousands of satisfied clients who trust NodeByte Hosting to power their digital journeys. Experience the perfect blend of performance, reliability, and innovation, all backed by a team that truly cares about your success.
            </motion.p>
            <motion.p variants={animation} custom={6} className="text-white mt-4">
              Ready to take your hosting to the next level? Discover what makes NodeByte the premier choice for businesses and individuals worldwide. Let us be your trusted partner in hosting excellence.
            </motion.p>
          </motion.section>
        </section>
      </div>
    </section>
  );
};
