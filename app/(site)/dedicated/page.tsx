import { MailIcon, MessageCircleIcon } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { PlanGrid } from "@/components/plan-card";
import { Section } from "@/components/section";
import { plansIn } from "@/lib/catalog";
import { LINKS } from "@/lib/site";
import { buttonStyles } from "@/lib/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  description:
    "Dedicated servers and custom hardware from NodeByte for heavy game networks and production workloads. Tell us what you need and we'll put together a quote.",
  title: "Dedicated servers",
};

const DedicatedPage = async () => {
  const plans = await plansIn("dedi", "dedicated-servers");
  return (
    <>
      <PageHero
        actions={
          <>
            <a className={buttonStyles.primary} href={LINKS.ticket}>
              <MailIcon />
              Request a quote
            </a>
            <a className={buttonStyles.outline} href={LINKS.discord}>
              <MessageCircleIcon />
              Ask on Discord
            </a>
          </>
        }
        description="Need more than a VPS can give? We build dedicated servers to order for large game networks and production workloads. Tell us what you're running and we'll put together a quote."
        eyebrow="Dedicated servers"
        title="Bare metal, built around you"
      />
      {plans.length > 0 && (
        <Section title="Available now">
          <PlanGrid plans={plans} />
        </Section>
      )}
      <Section title="What to include in your request">
        <ul className="text-muted-foreground grid max-w-3xl list-disc gap-2 pl-5">
          <li>What you&apos;ll run, and roughly how many players or users</li>
          <li>The CPU, memory and storage you think you need</li>
          <li>Your preferred location: Newcastle, UK or New York, US</li>
          <li>Your budget and when you need it</li>
        </ul>
      </Section>
    </>
  );
};

export default DedicatedPage;
