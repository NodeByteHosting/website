import { FC } from "react";
import ButtonScrollProvider from "@/src/providers/ButtonScroll";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./components/hero/Hero").then(mod => mod.Hero));
const Advantages = dynamic(() => import("./components/advantages/Advantages").then(mod => mod.Advantages));
const Services = dynamic(() => import("./components/services/Services").then(mod => mod.Services));
const FAQ = dynamic(() => import("./components/FAQ/FAQ").then(mod => mod.FAQ));
const Reviews = dynamic(() => import("./components/reviews/Reviews").then(mod => mod.Reviews));

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
