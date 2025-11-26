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

// add import for the existing widget
import TrustpilotWidget from './TrustpilotWidget';

export const Footer: FC = () => {
  const pathname = usePathname();

  const TP_BUSINESS_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID;

  // Load Trustpilot script dynamically only if a business id is set
  useEffect(() => {
    if (!TP_BUSINESS_ID) return;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) { /* ignore cleanup errors */ }
    };
  }, [TP_BUSINESS_ID]);

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
            <div className={s.Brand}>
              <Link className={s.Logo} href={"/"}>
                <Logo />
                <span translate="no" className="-ml-6">odeByte</span>
              </Link>

              {/* Social icons placed directly under branding */}
              <div className={s.BrandSocial}>
                {DATA_SOCIAL_ICONS.map((item, i) => (
                  <Tooltip
                    key={i}
                    size="sm"
                    placement="bottom"
                    showArrow
                    content={item.title}
                  >
                    <Link target="_blank" href={item.href} aria-label={item.title}>
                      {item.icon}
                    </Link>
                  </Tooltip>
                ))}
              </div>
            </div>

            <ul className={s.Actions}>
              {BASE_LINKS.map((item, i) => (
                <li key={i}>
                  <h5 className="text-white">{item.title}</h5>
                  <div>
                    {item.links.map((link, i) => (
                      // prefer explicit disabled flag; if disabled render plain text
                      link.disabled ? (
                        <span key={i} className="text-white/50">
                          {link.value}
                        </span>
                      ) : link.href ? (
                        <Link
                          key={i}
                          className="text-white/50 hover:text-gradient-4"
                          href={link.href}
                        >
                          {link.value}
                        </Link>
                      ) : (
                        <span key={i} className="text-white/50">
                          {link.value}
                        </span>
                      )
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className={s.Subscribe}>
              {/**<h5 className="text-white">Subscribe to our newsletter</h5>
              <p className="text-white/50">
                This is under Development!
              </p>
              <FooterForm />*/}
              <div className={s.TrustpilotContainer}>
                <TrustpilotWidget />
                <a
                  href="https://uk.trustpilot.com/review/nodebyte.host"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white mt-2"
                >
                  Read our reviews
                </a>
              </div>
            </div>
          </section>
        </section>
      </div>
      <section className={`${s.Copyright} bg-gray/5 border-t-1 border-gray/10`}>
        <div className="text-gray">
          <Link href="https://nodebyte.co.uk" className="hover:underline">&copy; 2025 NodeByte LTD | All Rights Reserved | </Link><Link href="https://find-and-update.company-information.service.gov.uk/company/15432941" className="hover:underline">Registered Number: 15432941</Link>
        </div>
      </section>
    </footer>
  );
};
