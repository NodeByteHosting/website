import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Faq } from "@/components/faq";
import { FromPrice } from "@/components/from-price";
import { Included, PageHero } from "@/components/page-hero";
import { PlanGrid } from "@/components/plan-card";
import { Section } from "@/components/section";
import { GAME_FAQ, GAME_INCLUDED } from "@/lib/game-content";
import { gameBySlug, GAMES } from "@/lib/games";
import { fromPrice, plansFor } from "@/lib/products";
import { buttonStyles } from "@/lib/ui";

export const revalidate = 300;

interface Props {
  params: Promise<{ game: string }>;
}

export const generateStaticParams = () =>
  GAMES.map((game) => ({ game: game.slug }));

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { game: slug } = await params;
  const game = gameBySlug(slug);
  if (!game) {
    notFound();
  }
  return {
    description: `${game.tagline} from NodeByte. ${game.intro}`,
    title: game.tagline,
  };
};

const GamePage = async ({ params }: Props) => {
  const { game: slug } = await params;
  const game = gameBySlug(slug);
  if (!game) {
    notFound();
  }
  const plans = await plansFor("games");

  return (
    <>
      <PageHero
        actions={
          <>
            <a className={buttonStyles.primary} href="#plans">
              See {game.name} plans
              <ArrowRightIcon />
            </a>
            <Link
              className={buttonStyles.outline}
              href={game.guides[0]?.href ?? "/kb"}
            >
              Read the guides
            </Link>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-2xl shadow-black/30">
            <Image
              alt={game.name}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              src={game.image}
            />
          </div>
        }
        description={game.intro}
        eyebrow={game.tagline}
        title={`Host your own ${game.name} server`}
      >
        <FromPrice
          className="text-muted-foreground text-sm"
          prices={fromPrice(plans)}
        />
      </PageHero>

      <Section title={`Made for ${game.name}`}>
        <Included items={game.highlights} />
      </Section>

      <Section
        className="border-t"
        description={`Choose a plan, then pick ${game.name} at checkout.`}
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

      <Section className="border-t" title={`${game.name} guides`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {game.guides.map((guide) => (
            <Link
              className="bg-card hover:border-primary flex items-center gap-3 rounded-xl border p-4 transition-colors"
              href={guide.href}
              key={guide.href}
            >
              <BookOpenIcon className="text-link size-4 shrink-0" />
              <span className="font-medium">{guide.label}</span>
              <ArrowRightIcon className="text-muted-foreground ml-auto size-4" />
            </Link>
          ))}
        </div>
      </Section>

      <Section className="border-t" title="Common questions">
        <div className="max-w-3xl">
          <Faq items={GAME_FAQ} />
        </div>
      </Section>
    </>
  );
};

export default GamePage;
