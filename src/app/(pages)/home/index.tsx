import { FC } from "react";
import { FAQ } from "./sections/FAQ/FAQ";
import { Hero } from "./sections/hero/Hero";
import { Reviews } from "./sections/reviews/Reviews";
import { Services } from "./sections/services/Services";
import { Advantages } from "./sections/advantages/Advantages";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";

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
