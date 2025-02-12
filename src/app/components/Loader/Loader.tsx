"use client";

import "./styles/Loader.css";

import { FC, useEffect, useState } from "react";

export const Loader: FC = ({ }) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    setIsLoading(true);
  };
  return (
    <>
      {isLoading ? (
        <section className={`loader bg-gradient-to-tl from-grey-900 via-dark_gray to-black border-gray-200`}>
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
};
