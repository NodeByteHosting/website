"use client";

import { FC } from "react";
import s from "./styles/Footer.module.scss";
import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import { Logo } from "@/src/app/components/UI/Logo/Logo";
import { FooterForm } from "./form";
import { BsGithub, BsTwitterX, BsDiscord, } from "react-icons/bs"
import { SiTrustpilot } from "react-icons/si";
import { BASE_LINKS } from "./utils/BaseLinks";

export const Footer: FC = ({ }) => {
  const DATA_SOCIAL_ICONS = [
    {
      title: "GitHub",
      href: "https://github.com/NodeByteHosting",
      icon: <BsGithub className="w-6 h-6 text-white" />,
    },

    {
      title: "Discord",
      href: "https://discord.gg/nodebyte",
      icon: <BsDiscord className="w-6 h-6 text-white" />,
    },
    {
      title: "Twitter",
      href: "https://twitter.com/NodeByteHosting",
      icon: <BsTwitterX className="w-6 h-6 text-white" />,
    },
    {
      title: "Trustpilot",
      href: "https://uk.trustpilot.com/review/nodebyte.host",
      icon: <SiTrustpilot className="w-6 h-6 text-white" />,
    },
  ];
  return (
    <footer
      className={`${s.Footer} bg-gradient-to-tl from-grey-900 via-dark_gray to-black border-gray-200 px-4 lg:px-6 py-2.5 `}
    >
      <div className="container ">
        <section className={`${s.Wrapper}`}>
          <section className={s.Content}>
            <Link className={s.Logo} href={"/"}>
              <Logo />
              <span translate="no" className="-ml-6">odeByte</span>
            </Link>
            <ul className={s.Actions}>
              {BASE_LINKS.map((item, i) => (
                <li key={i}>
                  <h5 className="text-white">{item.title}</h5>
                  <div>
                    {item.links.map((link, i) => (
                      <Link
                        key={i}
                        className="text-white/50 hover:text-gradient-4"
                        href={link.href}
                      >
                        {link.value}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div className={s.Subscribe}>
              <h5 className="text-white">Subscribe to our newsletter</h5>
              <p className="text-white/50">
                Stay updated on new releases and features, guides, and case
                studies.
              </p>
              <FooterForm />
              <div className={s.Social}>
                {DATA_SOCIAL_ICONS.map((item, i) => (
                  <Tooltip
                    key={i}
                    size="sm"
                    placement="bottom"
                    showArrow
                    content={item.title}
                  >
                    <Link target="_blank" href={item.href}>
                      {item.icon}
                    </Link>
                  </Tooltip>
                ))}
              </div>
            </div>

          </section>
        </section>
      </div>
      <section className={`${s.Copyright} bg-gray/5 border-t-1 border-gray/10`}>
        <div className="text-gray">
          &copy; 2024 NodeByte LTD | All rights reserved.
        </div>
      </section>
    </footer>
  );
};
