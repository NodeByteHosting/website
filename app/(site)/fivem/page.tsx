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
    "FiveM and RedM VPS hosting with txAdmin and MariaDB preinstalled. Full root access, a dedicated IPv4 and NVMe storage for ESX, QBCore, Qbox, VORP and RSG servers.",
  title: "FiveM & RedM VPS hosting",
};

const INCLUDED = [
  {
    text: "Your server comes with txAdmin installed. The setup link and PIN are emailed to you as soon as it's ready.",
    title: "txAdmin preinstalled",
  },
  {
    text: "MariaDB is ready to go for ESX, QBCore, Qbox, VORP and RSG.",
    title: "MariaDB preinstalled",
  },
  {
    text: "Install anything you like alongside your server, from web panels to Discord bots.",
    title: "Full root access",
  },
  {
    text: "A public IPv4 address that's yours alone, never shared with other customers.",
    title: "Dedicated IPv4",
  },
  {
    text: "Fast NVMe storage keeps resource starts and database queries quick.",
    title: "NVMe storage",
  },
  {
    text: "The Elite plan has dedicated cores that are never shared, for large OneSync servers.",
    title: "Dedicated cores on Elite",
  },
];

const FAQ_ITEMS = [
  {
    answer:
      "No. These are VPS plans, so you manage your server through txAdmin and SSH. If you'd rather have a web panel, our managed game servers are a better fit.",
    question: "Is there a game panel?",
  },
  {
    answer:
      "Yes. Every plan runs either. Choose FiveM or RedM when you set up txAdmin.",
    question: "Can I run RedM as well as FiveM?",
  },
  {
    answer:
      "Starter suits development and small communities. Standard handles a typical ESX, QBCore or VORP server. Pick Pro or Elite for busy roleplay servers with heavy scripts, MLOs and custom vehicles.",
    question: "Which plan do I need?",
  },
  {
    answer:
      "Yes. You'll need your own Cfx.re server key from the Cfx.re portal, which you add in txAdmin during setup.",
    question: "Do I need a license key?",
  },
];

const FivemPage = async () => {
  const plans = await plansFor("fivem");
  return (
    <>
      <PageHero
        actions={
          <>
            <a className={buttonStyles.primary} href="#plans">
              See plans
              <ArrowRightIcon />
            </a>
            <Link className={buttonStyles.outline} href="/games">
              Prefer a managed panel?
            </Link>
          </>
        }
        description="A VPS built for roleplay servers, with txAdmin and MariaDB ready the moment it boots. Full root access, a dedicated IPv4 and NVMe storage."
        eyebrow="FiveM & RedM"
        title="Roleplay servers, ready for txAdmin"
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(plans)}
        />
      </PageHero>

      <Section id="plans" title="Plans">
        <PlanGrid featureLimit={4} highlight="cfx-vps-standard" plans={plans} />
      </Section>

      <Section
        className="border-t"
        eyebrow="Included"
        title="Everything a roleplay server needs"
      >
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

export default FivemPage;
