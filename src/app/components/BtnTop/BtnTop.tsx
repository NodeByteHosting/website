"use client";

import { FC, useState, useEffect } from "react";
import s from "./styles/BtnTop.module.scss";
import { ChevronUp } from "lucide-react";
import { useScrollTop } from "@/src/hooks/useScrollTop";

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
