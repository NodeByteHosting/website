import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Faq } from "@/components/faq";
import { FromPrice } from "@/components/from-price";
import { Included, PageHero } from "@/components/page-hero";
import { PlanGrid } from "@/components/plan-card";
import { Section } from "@/components/section";
import { GAME_FAQ, GAME_INCLUDED } from "@/lib/game-content";
import { GAMES } from "@/lib/games";
import { fromPrice, plansFor } from "@/lib/products";
import { buttonStyles } from "@/lib/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  description:
    "Game server hosting for Minecraft, Rust, Hytale and Palworld. One set of plans for every game, with DDoS protection, daily backups and an easy web panel.",
  title: "Game server hosting",
};

const GamesPage = async () => {
  const plans = await plansFor("games");
  return (
    <>
      <PageHero
        actions={
          <a className={buttonStyles.primary} href="#plans">
            See plans
            <ArrowRightIcon />
          </a>
        }
        description="One set of plans for every game we host. Choose the resources you need, then pick your game at checkout."
        eyebrow="Game servers"
        title="Your server, ready in a minute"
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(plans)}
        />
      </PageHero>

      <Section className="pb-0" title="Choose your game">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border"
              href={`/games/${game.slug}`}
              key={game.slug}
            >
              <Image
                alt=""
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                src={game.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <span className="absolute bottom-3 left-4 font-semibold text-white">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        description="All prices are monthly. Cancel any time from the client area."
        id="plans"
        title="Plans"
      >
        <PlanGrid highlight="game-plus" plans={plans} />
      </Section>

      <Section
        className="border-t"
        eyebrow="Included"
        title="On every game server"
      >
        <Included items={GAME_INCLUDED} />
      </Section>

      <Section className="border-t" title="Common questions">
        <div className="max-w-3xl">
          <Faq items={GAME_FAQ} />
        </div>
      </Section>
    </>
  );
};

export default GamesPage;
