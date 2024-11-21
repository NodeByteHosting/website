"use client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import s from "./CookieModal.module.scss";
// NextUI
import { Button } from "@nextui-org/react";
import { FaGithubAlt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { X } from "lucide-react";

export const CookieModal: FC = ({}) => {
  const [isClose, setClose] = useState(true);
  useEffect(() => {
    const storedValue = window.sessionStorage.getItem("bannerCookie");
    if (storedValue !== null) {
      setClose(JSON.parse(storedValue));
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("bannerCookie", JSON.stringify(isClose));
  }, [isClose]);
  return (
    <>
      {isClose && (
        <section
          className={`${s.CookieModal} left-0 bottom-0  md:rounded-md bg-black/50 fixed md:bottom-5 md:left-5 p-4 border-t-1 md:border-1 border-gray/20 backdrop-blur-md`}
        >
          <X
            onClick={() => setClose(false)}
            size={15}
            className="absolute top-[10px] right-[10px] text-white cursor-pointer z-[20]"
          />
          <section>
            <h4 className="text-[18px] font-semibold text-white">
              Cookie Consent
            </h4>
            <p className="text-xs md:text-sm font-normal text-white/50 leading-6">
              We may use cookies to provide you with the best possible experience.
              They also allow us to analyze user behavior in order to constantly
              improve the website for you.
            </p>
            <div>
            <Button
                onClick={() => setClose(false)}
                radius="sm"
                className="text-xs md:text-sm bg-dark text-white font-medium mr-3 dark:bg-black_secondary"
              >
                <Link href="/privacy">Learn More</Link>
              </Button>
              <Button
                onClick={() => setClose(false)}
                radius="sm"
                className="text-xs md:text-sm bg-green/50 text-white font-medium mr-3 dark:bg-black_secondary"
              >
                Accept All
              </Button>
              <Button
                onClick={() => setClose(false)}
                radius="sm"
                className="shadow text-xs md:text-sm bg-red-800/50 font-medium text-white "
              >
                Reject All
              </Button>
            </div>
          </section>
        </section>
      )}
    </>
  );
};
