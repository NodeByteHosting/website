"use client";

import { ChevronUp } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { useScrollTop } from "@/src/hooks/useScrollTop";
import s from "styling/modules/BtnTop/global.module.scss";

export const BtnTop: FC = ({ }) => {
  const [isScroll, setScroll] = useState<boolean>(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY != 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, [isScroll]);
  return (
    <button
      onClick={useScrollTop}
      className={`${s.BtnTop} ${isScroll ? s.Active : ""
        } shadow-md w-10 h-10 rounded-full fixed right-5 bottom-5 `}
    >
      <ChevronUp className={"text-white "} strokeWidth={1.5} size={24} />
    </button>
  );
};
