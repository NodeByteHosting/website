import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { COMPANY, LINKS } from "@/lib/site";
import { buttonStyles } from "@/lib/ui";

export const metadata: Metadata = {
  description:
    "NodeByte started in 2024 as a small group of gamers and ops engineers who wanted hosting that was fast, reliable and easy to manage.",
  title: "About us",
};

const TIMELINE = [
  {
    text: "A small group of gamers and ops engineers set out to build the hosting we always wished existed, starting with game servers.",
    title: "NodeByte is founded",
    when: "2024",
  },
  {
    text: "More locations, DDoS protection on every plan, and a control panel that doesn't need a manual.",
    title: "Growing the platform",
    when: "Since then",
  },
  {
    text: "Full root Linux VPS plans join game servers, for developers, businesses and anyone who wants their own server.",
    title: "VPS hosting launches",
    when: "March 2026",
  },
  {
    text: "Object storage, Discord bot and voice hosting, and FiveM & RedM VPS plans with txAdmin preinstalled.",
    title: "More ways to host",
    when: "Today",
  },
];

const VALUES = [
  {
    text: "Low-latency routing, predictable performance and strong uptime, whether it's a game server or a VPS.",
    title: "Built for players",
  },
  {
    text: "Our Discord is where we answer questions, share updates and hear what to build next.",
    title: "Community first",
  },
  {
    text: "Clear terms, published SLAs and open-source tools. We'd rather show you how things work than hide it.",
    title: "Open by design",
  },
];

const AboutPage = () => (
  <>
    <PageHero
      actions={
        <>
          <a className={buttonStyles.primary} href={LINKS.discord}>
            Join our Discord
            <ArrowRightIcon />
          </a>
          <Link className={buttonStyles.outline} href="/contact">
            Contact us
          </Link>
        </>
      }
      description="NodeByte started as a small group of gamers and ops engineers who were tired of laggy servers, slow support and panels that needed a manual. So we built the hosting we wanted to use."
      eyebrow="About NodeByte"
      title="Hosting built by people who play"
    />

    <Section title="What we stand for">
      <div className="grid gap-10 md:grid-cols-3">
        {VALUES.map((value) => (
          <div className="flex flex-col gap-2" key={value.title}>
            <h3 className="text-lg font-semibold">{value.title}</h3>
            <p className="text-muted-foreground">{value.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section className="border-t" title="Our story so far">
      <ol className="relative flex max-w-3xl flex-col gap-10 border-l pl-8">
        {TIMELINE.map((step) => (
          <li className="relative" key={step.title}>
            <span className="bg-primary ring-background absolute top-1.5 -left-[2.4rem] size-3 rounded-full ring-4" />
            <span className="text-link font-mono text-sm">{step.when}</span>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-1">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>

    <Section className="border-t" title="The company">
      <p className="text-muted-foreground max-w-3xl">
        NodeByte Hosting is run by {COMPANY.name}, a UK registered company
        (company number {COMPANY.number}), registered with the Information
        Commissioner&apos;s Office ({COMPANY.ico}).
      </p>
    </Section>
  </>
);

export default AboutPage;
