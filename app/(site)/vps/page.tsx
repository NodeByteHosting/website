import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Faq } from "@/components/faq";
import { FromPrice } from "@/components/from-price";
import { Included, PageHero } from "@/components/page-hero";
import { PlanGrid } from "@/components/plan-card";
import { Section } from "@/components/section";
import { fromPrice, plansFor } from "@/lib/products";
import { buttonStyles } from "@/lib/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  description:
    "Linux VPS hosting with full root access, a dedicated IPv4 and KVM virtualisation. Choose your OS, manage it from a full control panel and reinstall any time.",
  title: "VPS hosting",
};

const INCLUDED = [
  {
    text: "Install and run anything you like, with root access from the first boot.",
    title: "Full root access",
  },
  {
    text: "A public IPv4 address that's yours alone, never shared with other customers.",
    title: "Dedicated IPv4",
  },
  {
    text: "Pick from our OS templates and reinstall any time from your panel.",
    title: "Choose your OS",
  },
  {
    text: "Power controls, a browser console and rescue mode, all in one place.",
    title: "Full control panel",
  },
  {
    text: "Your resources are isolated from other customers by KVM.",
    title: "KVM virtualisation",
  },
  {
    text: "Attack traffic is filtered before it reaches your VPS.",
    title: "DDoS protection",
  },
];

const FAQ_ITEMS = [
  {
    answer:
      "Websites and web apps, Discord bots, databases, Docker stacks, a VPN, or a place to learn Linux. If it runs on Linux, it runs here.",
    question: "What can I run on a VPS?",
  },
  {
    answer:
      "You can, but for FiveM and RedM our FiveM & RedM VPS plans come with txAdmin and MariaDB preinstalled. For other games, managed game servers give you an easy web panel.",
    question: "Can I host a game server on a VPS?",
  },
  {
    answer:
      "Yes. Reinstall from the control panel at any time and choose a different OS template.",
    question: "Can I change the operating system?",
  },
];

const VpsPage = async () => {
  const plans = await plansFor("vps");
  return (
    <>
      <PageHero
        actions={
          <a className={buttonStyles.primary} href="#plans">
            See plans
            <ArrowRightIcon />
          </a>
        }
        description="Full root Linux virtual machines with a dedicated IPv4, KVM isolation and a control panel with a browser console and rescue mode."
        eyebrow="VPS hosting"
        title="A server that's all yours"
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(plans)}
        />
      </PageHero>

      <Section id="plans" title="Plans">
        <PlanGrid featureLimit={0} plans={plans} />
        <p className="text-muted-foreground mt-6 text-sm">
          Running FiveM or RedM?{" "}
          <Link className="text-link hover:underline" href="/fivem">
            Our FiveM & RedM VPS plans
          </Link>{" "}
          come with txAdmin preinstalled.
        </p>
      </Section>

      <Section className="border-t" eyebrow="Included" title="On every VPS">
        <Included items={INCLUDED} />
      </Section>

      <Section className="border-t" title="Common questions">
        <div className="max-w-3xl">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>
    </>
  );
};

export default VpsPage;
