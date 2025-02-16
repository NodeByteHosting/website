import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import s from "styling/modules/FAQS/global.module.scss";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const FAQ: FC = ({ }) => {
  const itemClasses = {
    base: "p-0",
    title:
      "text-white font-semibold text-sm md:font-medium  md:text-md ml-4",
    content: "text-gray text-sm md:text-md",
  };
  const DATA_ACCORDION = [
    {
      title: "What is a Virtual Private Server (VPS)?",
      text: "A Virtual Private Server (VPS) is a virtualized server that acts like a dedicated server within a larger physical server. It provides dedicated resources and greater control compared to shared hosting, making it ideal for businesses and developers who need reliable and scalable hosting solutions.",
    },
    {
      title: "How do I set up my VPS?",
      text: "Setting up your VPS is straightforward. Once you purchase a VPS plan, you will receive login credentials and access to a control panel where you can manage your server. You can install your preferred operating system, configure settings, and deploy applications as needed.",
    },
    {
      title: "What are the benefits of using a dedicated Minecraft server?",
      text: "A dedicated Minecraft server offers better performance, reliability, and customization options compared to shared hosting. It allows you to have full control over server settings, mods, and plugins, ensuring a smooth and enjoyable gaming experience for you and your players.",
    },
    {
      title: "How secure are your servers?",
      text: "Security is our top priority. Our servers are equipped with advanced security measures, including DDoS protection, firewalls, and regular security updates.",
    },
    {
      title: "Do you offer customer support?",
      text: "Yes, we offer 24/7 customer support to assist you with any issues or questions you may have. Our dedicated support team is available via discord, email and support tickets to ensure that you receive timely and effective assistance.",
    },
    {
      title: "Can I upgrade or downgrade my VPS plan?",
      text: "Yes, our VPS plans are scalable, allowing you to upgrade or downgrade your plan as needed. You can easily adjust your resources through the control panel to accommodate your changing requirements.",
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
    <section className={`${s.FAQ} bg-dark`}>
      <div className="container">
        <section className={s.Wrapper}>
          <section className={s.Content}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2, once: true }}
              className={s.Header}
            >
              <motion.h3
                variants={animation}
                custom={1}
                className="text-green "
              >
                Additional information
              </motion.h3>
              <motion.h2
                variants={animation}
                custom={2}
                className="text-white"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p variants={animation} custom={3} className="text-white/50">
                Anything else you need to know? We have the answers.
              </motion.p>
            </motion.div>
            <Accordion
              fullWidth
              className={`${s.Accordion} mt-10 px-0 `}
              itemClasses={itemClasses}
            >
              {DATA_ACCORDION.map((item, i) => (
                <AccordionItem
                  classNames={{
                    base: "shadow bg-dark_gray hover:bg-black_secondary",
                  }}
                  className={`${s.AccordionItem} text-white ml-2`}
                  key={i}
                  title={item.title}
                >
                  <p className="ml-2">{item.text}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <figure className={s.Image}>
            <Image src={"/FAQ/img.png"} width={1000} height={1000} alt="" />
          </figure>
        </section>
      </div>
    </section>
  );
};
