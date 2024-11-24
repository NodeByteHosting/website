import { FC } from "react";
import { Hero } from "./components/hero/Hero";
import { Advantages } from "./components/advantages/Advantages";
import { Services } from "./components/services/Services";
import { FAQ } from "./components/FAQ/FAQ";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import { Reviews } from "./components/reviews/Reviews";

export const HomePage: FC = ({ }) => {
  return (
    <>
      <ButtonScrollProvider>
        <Hero />
        <Advantages />
        <Services />
        <FAQ />
        <Reviews />
      </ButtonScrollProvider>
    </>
  );
};
