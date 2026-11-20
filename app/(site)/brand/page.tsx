import { DownloadIcon } from "lucide-react";
import type { Metadata } from "next";

import { Logo } from "@/components/logo";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { buttonStyles } from "@/lib/ui";

export const metadata: Metadata = {
  description: "NodeByte logos, colours and guidelines for press and partners.",
  title: "Brand assets",
};

const COLOURS = [
  { name: "Navy", value: "oklch(0.155 0.03 235)" },
  { name: "Primary", value: "oklch(0.45 0.12 235)" },
  { name: "Accent", value: "oklch(0.55 0.12 200)" },
  { name: "Light", value: "oklch(0.97 0.02 230)" },
];

const BrandPage = () => (
  <>
    <PageHero
      description="Writing about NodeByte or listing us as a partner? Use these assets, and please don't stretch, recolour or redraw the logo."
      eyebrow="Brand"
      title="Brand assets"
    />
    <Section title="Logo">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-background flex aspect-[2/1] items-center justify-center rounded-2xl border">
          <Logo className="h-20 w-auto" />
        </div>
        <div className="flex aspect-[2/1] items-center justify-center rounded-2xl border bg-white text-[oklch(0.155_0.03_235)]">
          <Logo className="h-20 w-auto" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a className={buttonStyles.primary} download href="/logo.svg">
          <DownloadIcon />
          Logo (SVG)
        </a>
        <a className={buttonStyles.outline} download href="/logo.png">
          <DownloadIcon />
          Logo (PNG)
        </a>
      </div>
    </Section>
    <Section className="border-t" title="Colours">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {COLOURS.map((colour) => (
          <div className="overflow-hidden rounded-2xl border" key={colour.name}>
            <div
              className="aspect-[3/2]"
              style={{ background: colour.value }}
            />
            <div className="flex flex-col gap-0.5 p-4">
              <span className="font-medium">{colour.name}</span>
              <span className="text-muted-foreground font-mono text-xs">
                {colour.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
    <Section className="border-t" title="Name">
      <p className="text-muted-foreground max-w-3xl">
        Write NodeByte as one word with a capital N and B. The company is{" "}
        NodeByte LTD, and our hosting brand is NodeByte Hosting.
      </p>
    </Section>
  </>
);

export default BrandPage;
