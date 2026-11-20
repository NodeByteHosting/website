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
    "Discord bot hosting for Node.js, Python, Java, Go and Rust bots, plus Lavalink and voice servers. Always online, with backups and an easy panel.",
  title: "Discord bot & voice hosting",
};

const INCLUDED = [
  {
    text: "Node.js, Python, Java, Go, Rust and more. Upload your code and start it from the panel.",
    title: "Any language",
  },
  {
    text: "Your bot stays online around the clock, without your PC running.",
    title: "Always on",
  },
  {
    text: "Backups keep your bot's files and config safe.",
    title: "Backups included",
  },
  {
    text: "Lavalink, TeamSpeak 3 and Mumble on dedicated voice plans.",
    title: "Voice and music",
  },
];

const FAQ_ITEMS = [
  {
    answer:
      "Small bots for a single server run comfortably on 256 to 512 MB. Bots in many servers, or ones that play music, need more.",
    question: "How much memory does my bot need?",
  },
  {
    answer:
      "Yes. Lavalink plans are built for music bots, and can also run TeamSpeak 3 or a small Mumble server.",
    question: "Can I host Lavalink?",
  },
];

const DiscordBotsPage = async () => {
  const [bots, voice] = await Promise.all([
    plansFor("bots"),
    plansFor("voice"),
  ]);
  return (
    <>
      <PageHero
        actions={
          <a className={buttonStyles.primary} href="#plans">
            See plans
            <ArrowRightIcon />
          </a>
        }
        description="Keep your Discord bots and Lavalink nodes online around the clock, for less than a coffee a month."
        eyebrow="Bots & voice"
        title="Your bot, online all the time"
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(bots)}
        />
      </PageHero>

      <Section
        description="For bots written in any language."
        id="plans"
        title="Bot hosting"
      >
        <PlanGrid plans={bots} />
      </Section>

      {voice.length > 0 && (
        <Section
          className="border-t"
          description="For Lavalink music nodes, TeamSpeak 3 and Mumble."
          title="Voice and music"
        >
          <PlanGrid featureLimit={4} plans={voice} />
        </Section>
      )}

      <Section className="border-t" eyebrow="Included" title="On every plan">
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

export default DiscordBotsPage;
