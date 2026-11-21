import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";

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
    "S3 compatible object storage from NodeByte, with free API requests, generous egress and self-service access keys. Works with rclone, Cyberduck, Veeam and more.",
  title: "Object storage",
};

const INCLUDED = [
  {
    text: "Use the S3 API with the tools you already know, such as rclone, Cyberduck and the AWS SDKs.",
    title: "S3 compatible",
  },
  {
    text: "No charges for API requests, however many your app makes.",
    title: "Free API requests",
  },
  {
    text: "Every plan includes a monthly egress allowance, from 200 GB to 2.5 TB.",
    title: "Generous egress",
  },
  {
    text: "Create and revoke access keys yourself from the client area.",
    title: "Self-service keys",
  },
  {
    text: "Point Veeam, TrueNAS and other backup tools at your bucket.",
    title: "Backup target",
  },
  {
    text: "The Hybrid plan moves older files to archive storage automatically after 14 days.",
    title: "Automatic archiving",
  },
];

const FAQ_ITEMS = [
  {
    answer:
      "Any tool that speaks the S3 API, including rclone, Cyberduck, the AWS CLI and SDKs, Veeam and TrueNAS.",
    question: "What can I use it with?",
  },
  {
    answer:
      "No. API requests are free on every plan. You only pay the monthly plan price, plus egress if you go over your allowance.",
    question: "Do you charge for requests?",
  },
  {
    answer:
      "In the client area, once your plan is active. You can create more keys up to your plan's limit.",
    question: "Where do I get my access keys?",
  },
];

const ObjectStoragePage = async () => {
  const plans = await plansFor("storage");
  return (
    <>
      <PageHero
        actions={
          <a className={buttonStyles.primary} href="#plans">
            See plans
            <ArrowRightIcon />
          </a>
        }
        description="S3 compatible storage for backups, media and app data, with free API requests and generous egress on every plan."
        eyebrow="Object storage"
        title="Storage that doesn't charge per request"
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(plans)}
        />
      </PageHero>

      <Section id="plans" title="Plans">
        <PlanGrid featureLimit={6} highlight="starter" plans={plans} />
      </Section>

      <Section
        className="border-t"
        eyebrow="Included"
        title="Built for real workloads"
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

export default ObjectStoragePage;
