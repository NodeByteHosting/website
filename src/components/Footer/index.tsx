"use client";

import { FC, useEffect } from "react";
import Link from "next/link";
import { Logo } from "ui/Logo";
import { FooterForm } from "./form";
import { Tooltip } from "@nextui-org/react";
import { SiTrustpilot } from "react-icons/si";
import { BASE_LINKS } from "./utils/BaseLinks";
import { usePathname } from "next/navigation";
import { BsGithub, BsTwitterX, BsDiscord } from "react-icons/bs";

import s from "styling/modules/Footer/global.module.scss";

export const Footer: FC = () => {
  const pathname = usePathname();

  // Load Trustpilot script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (pathname.startsWith("/docs")) {
    return null;
  }

  const DATA_SOCIAL_ICONS = [
    {
      title: "GitHub",
      href: "https://github.com/NodeByteHosting",
      icon: <BsGithub className="w-6 h-6 text-white" />,
    },
    {
      title: "Discord",
      href: "https://discord.gg/nuh57Q69tq",
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
                This is under Development!
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

              {/* Example TrustBox container */}
              <div
                className="trustpilot-widget"
                data-locale="en-GB"
                data-template-id="53aa8807dec7e10d38f59f36"
                data-businessunit-id="YOUR_BUSINESS_UNIT_ID"
                data-style-height="150px"
                data-style-width="100%"
                data-theme="dark"
              >
                <a
                  href="https://uk.trustpilot.com/review/nodebyte.host"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Trustpilot
                </a>
              </div>
            </div>
          </section>
        </section>
      </div>
      <section className={`${s.Copyright} bg-gray/5 border-t-1 border-gray/10`}>
        <div className="text-gray">
          &copy; 2025 NodeByte LTD | <Link href="https://toxicdev.me" className="hover:underline">All Rights Reserved | </Link><Link href="https://find-and-update.company-information.service.gov.uk/company/15432941" className="hover:underline">Registered Number: 15432941</Link> | Tel: 03301334561 | <Link href="https://maps.app.goo.gl/iPZVk4URKJsLFaMV6" className="hover:underline">20 Wenlock Road, London, England, N1 7GU</Link>
        </div>
      </section>
    </footer>
  );
};
