import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { PARTNERS } from "@/lib/partners";
import type { PartnerTier } from "@/lib/partners";
import { buttonStyles } from "@/lib/ui";

export const metadata: Metadata = {
  description:
    "The companies, projects and communities NodeByte works with and hosts.",
  title: "Partners",
};

const TIERS: { description: string; tier: PartnerTier; title: string }[] = [
  {
    description: "Companies that support NodeByte.",
    tier: "sponsor",
    title: "Sponsors",
  },
  {
    description: "Companies and projects we work with.",
    tier: "partner",
    title: "Partners",
  },
  {
    description: "Servers and communities we host and support.",
    tier: "community",
    title: "Communities",
  },
];

const PartnersPage = () => (
  <>
    <PageHero
      actions={
        <Link className={buttonStyles.primary} href="/kb/partners/introduction">
          Become a partner
        </Link>
      }
      description="The companies, projects and communities we work with. Running a community or project that fits? We'd love to hear from you."
      eyebrow="Partners"
      title="In good company"
    />
    {TIERS.map(({ description, tier, title }) => {
      const entries = PARTNERS.filter((partner) => partner.tier === tier);
      if (!entries.length) {
        return null;
      }
      return (
        <Section description={description} key={tier} title={title}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((partner) => (
              <a
                className="bg-card hover:border-primary flex flex-col gap-4 rounded-2xl border p-6 transition-colors"
                href={partner.url}
                key={partner.id}
                rel="noopener"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <Image
                    alt=""
                    className="size-10 rounded-lg object-contain"
                    height={40}
                    src={partner.logo}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{partner.name}</span>
                    {partner.category && (
                      <span className="text-muted-foreground text-xs">
                        {partner.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {partner.description}
                </p>
              </a>
            ))}
          </div>
        </Section>
      );
    })}
  </>
);

export default PartnersPage;
