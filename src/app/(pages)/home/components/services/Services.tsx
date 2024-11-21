// React
import { FC } from "react";
// Styles
import s from "./styles/Services.module.scss"
import "atropos/css";
// Animations
import { motion } from "framer-motion";
// Icons
import { Check } from "lucide-react";
// Components
import { ButtonGradient } from "@/src/app/components/UI/Button/ButtonGradient";
import Atropos from "atropos/react";
// Marquee
import Marquee from "react-fast-marquee";

export const Services: FC = ({ }) => {
  const DATA_CARDS = [
    {
      title: "Minecraft Servers",
      info: "Grab yourself a Minecraft server and start playing with your friends.",
      features: [
        {
          text: "99.9% Uptime SLA",
        },
        {
          text: "Pterodactyl Panel",
        },
        {
          text: "NeoProtect DDoS Protection",
        }
      ],
    },
    {
      title: "Virtual Private Servers",
      info: "Grab yourself a VPS and start hosting your own services.",
      features: [
        {
          text: "99.6% Uptime SLA",
        },
        {
          text: "Virtfusion Control Panel",
        },
        {
          text: "DDoS Protection",
        },
      ],
    }
  ];
  const DATA_ITEMS_MARQUEE = [
    { title: "Purpur" },
    { title: "BungeeCord" },
    { title: "Forge" },
    { title: "Bedrock" },
    { title: "Paper" },
    { title: "NeoForge" }
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
    <section className={`${s.Prices} bg-grey-800`} id="our-services">
      <div className="container">
        <section className={s.Wrapper}>
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2, once: true }}
            className={s.Header}
          >
            <motion.h2
              variants={animation}
              custom={2}
              className="text-white"
            >
              Our Services
            </motion.h2>
            <motion.p variants={animation} custom={3} className="text-gray">
              We currently offer a variety of services to help you get started.
            </motion.p>
          </motion.section>
          <section className={s.Cards}>
            {DATA_CARDS.map((card, i) => (
              <Atropos
                rotateTouch={false}
                highlight={false}
                shadow={false}
                className="bg-transparent"
                key={i}
              >
                <motion.article
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ amount: "some", once: true }}
                  variants={animation}
                  custom={i}
                  className={`${s.Card} rounded-lg border-1 border-gray/10 shadow bg-black_secondary hover:bg-dark_gray`}
                >
                  <h4 className="text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">
                    {card.title}
                  </h4>
                  <p className="text-white/50">{card.info}</p>
                  <ul className={s.Features}>
                    {card.features.map((item, i) => (
                      <li key={i}>
                        <i>
                          <Check
                            strokeWidth={2}
                            className="text-blue dark:text-green"
                            size={18}
                          />
                        </i>
                        <p className="text-white/50">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <ButtonGradient
                    radius="sm"
                    size="md"
                    value="Grab one now!"
                  />
                </motion.article>
              </Atropos>
            ))}
          </section>
          <section className={s.Integrations}>
            <h4 className="text-white/50 ">
              The following Minecraft Server Types are available:{" "}
            </h4>
            <Marquee autoFill className={s.marquee} speed={50}>
              <div className={s.introMarquee}>
                {DATA_ITEMS_MARQUEE.map((item, i) => (
                  <div className="opacity-20" key={i}>
                    <p className="text-white/90">{item.title}</p>
                  </div>
                ))}
              </div>
            </Marquee>
          </section>
        </section>
      </div>
    </section>
  );
};
