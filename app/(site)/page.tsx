import {
  ArchiveIcon,
  ArrowRightIcon,
  BoxIcon,
  BotIcon,
  CloudIcon,
  GamepadIcon,
  HeadsetIcon,
  MapPinIcon,
  ServerIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Backdrop } from "@/components/backdrop";
import { Faq } from "@/components/faq";
import { FromPrice } from "@/components/from-price";
import { Logo } from "@/components/logo";
import { Section } from "@/components/section";
import { GAMES } from "@/lib/games";
import { fromPrice, LOCATIONS, plansFor } from "@/lib/products";
import { LINKS } from "@/lib/site";
import { buttonStyles } from "@/lib/ui";

export const revalidate = 300;

const FAQ_ITEMS = [
  {
    answer:
      "Most servers are ready within a minute of payment. Game servers with large modpacks can take a few minutes longer while files download.",
    question: "How quickly is my server ready?",
  },
  {
    answer:
      "Yes. Every plan includes DDoS mitigation that filters attack traffic at the network edge, so your server stays online.",
    question: "Is DDoS protection included?",
  },
  {
    answer: `You choose at checkout: ${LOCATIONS.join(" or ")}.`,
    question: "Where are your servers?",
  },
  {
    answer:
      "Game server plans aren't tied to one game. Pick the plan that fits, then choose your game at checkout.",
    question: "Do I need a different plan for each game?",
  },
  {
    answer: (
      <>
        Yes. We offer free trials for new customers.{" "}
        <a className="text-link hover:underline" href={LINKS.freeTrial}>
          Start a free trial
        </a>
        .
      </>
    ),
    question: "Can I try before I buy?",
  },
  {
    answer:
      "Plans renew monthly and you can cancel any time from the client area. See our refund policy for details.",
    question: "Am I locked into a contract?",
  },
];

const HomePage = async () => {
  const [games, fivem, vps, storage, bots] = await Promise.all([
    plansFor("games"),
    plansFor("fivem"),
    plansFor("vps"),
    plansFor("storage"),
    plansFor("bots"),
  ]);
  const gamesFrom = fromPrice(games);

  const PRODUCTS = [
    {
      description:
        "One set of plans for every game we host. Pick your game at checkout.",
      href: "/games",
      icon: GamepadIcon,
      prices: gamesFrom,
      title: "Game servers",
    },
    {
      description:
        "A VPS with txAdmin preinstalled for ESX, QBCore and VORP servers.",
      href: "/fivem",
      icon: BoxIcon,
      prices: fromPrice(fivem),
      title: "FiveM & RedM",
    },
    {
      description:
        "Full root Linux VMs with a dedicated IPv4 for apps, sites and side projects.",
      href: "/vps",
      icon: ServerIcon,
      prices: fromPrice(vps),
      title: "VPS hosting",
    },
    {
      description:
        "S3 compatible storage with free API requests and generous egress.",
      href: "/object-storage",
      icon: CloudIcon,
      prices: fromPrice(storage),
      title: "Object storage",
    },
    {
      description:
        "Keep Discord bots and Lavalink nodes online around the clock.",
      href: "/discord-bots",
      icon: BotIcon,
      prices: fromPrice(bots),
      title: "Bots & voice",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <Backdrop />
        <div className="container-page relative grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-start gap-6">
            <a
              className="bg-card/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur"
              href={LINKS.freeTrial}
            >
              <span className="bg-link size-1.5 rounded-full" />
              New here? Start with a free trial
              <ArrowRightIcon className="size-3" />
            </a>
            <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-6xl lg:text-7xl">
              Game servers that keep up with your players.
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg text-pretty md:text-xl">
              Minecraft, Rust, Hytale, Palworld, FiveM and more on fast hardware
              with DDoS protection, daily backups and real people on support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className={buttonStyles.primary} href="/games">
                Browse game servers
                <ArrowRightIcon />
              </Link>
              <Link className={buttonStyles.outline} href="/vps">
                Explore VPS
              </Link>
            </div>
            <FromPrice
              className="text-muted-foreground text-sm"
              prices={gamesFrom}
            />
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4 lg:max-w-none">
            {GAMES.map((game, index) => (
              <Link
                className={`group bg-card relative aspect-[4/5] overflow-hidden rounded-2xl border shadow-2xl shadow-black/30 ${index % 2 === 1 ? "translate-y-8" : ""}`}
                href={`/games/${game.slug}`}
                key={game.slug}
              >
                <Image
                  alt=""
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 280px, 45vw"
                  src={game.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 text-lg font-semibold text-white">
                  {game.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b">
        <div className="container-page grid grid-cols-2 gap-6 py-8 text-sm md:grid-cols-4">
          {[
            { icon: ShieldCheckIcon, label: "DDoS protection on every plan" },
            { icon: ArchiveIcon, label: "Daily backups on game servers" },
            { icon: MapPinIcon, label: LOCATIONS.join(" and ") },
            { icon: HeadsetIcon, label: "Support from a UK team" },
          ].map((item) => (
            <div className="flex items-center gap-3" key={item.label}>
              <item.icon className="text-link size-5 shrink-0" />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Section
        description="Every game uses the same plans, so you only pay for the resources you need."
        eyebrow="Games"
        title="Pick your game"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GAMES.map((game) => (
            <Link
              className="group bg-card hover:border-primary overflow-hidden rounded-2xl border transition-colors"
              href={`/games/${game.slug}`}
              key={game.slug}
            >
              <div className="relative aspect-video">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 300px, 50vw"
                  src={game.image}
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-4">
                <span className="font-medium">{game.name}</span>
                <ArrowRightIcon className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-sm">
          Running something else?{" "}
          <Link className="text-link hover:underline" href="/contact">
            Ask us
          </Link>{" "}
          and we&apos;ll help you set it up.
        </p>
      </Section>

      <Section
        className="pt-0"
        description="From a weekend Minecraft world to a production API, it all runs on the same network."
        eyebrow="Hosting"
        title="More than game servers"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Link
              className="group bg-card hover:border-primary flex flex-col gap-4 rounded-2xl border p-6 transition-colors"
              href={product.href}
              key={product.href}
            >
              <product.icon className="text-link size-6" />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                <FromPrice
                  className="text-muted-foreground"
                  prices={product.prices}
                />
                <ArrowRightIcon className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
              </div>
            </Link>
          ))}
          <Link
            className="group hover:border-primary flex flex-col gap-4 rounded-2xl border border-dashed p-6 transition-colors"
            href="/dedicated"
          >
            <TerminalIcon className="text-link size-6" />
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold">Need something bigger?</h3>
              <p className="text-muted-foreground text-sm">
                Talk to us about dedicated hardware and custom setups.
              </p>
            </div>
            <span className="text-link mt-auto pt-2 text-sm font-medium">
              Get in touch
            </span>
          </Link>
        </div>
      </Section>

      <Section
        className="border-y"
        description="We started NodeByte because we were tired of laggy servers and support that never replied. Here's what we do differently."
        eyebrow="Why NodeByte"
        title="Built by people who play"
      >
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              text: "Attack traffic is filtered at the network edge before it reaches your server, on every plan at no extra cost.",
              title: "Protected by default",
            },
            {
              text: "Game servers are backed up every day, so a bad update or crash never costs you your world.",
              title: "Backups you don't think about",
            },
            {
              text: "Open a ticket or ask on Discord and you'll hear from our own team, not an outsourced script.",
              title: "Support that answers",
            },
          ].map((point, index) => (
            <div className="flex flex-col gap-3" key={point.title}>
              <span className="text-link font-mono text-sm">0{index + 1}</span>
              <h3 className="text-xl font-semibold">{point.title}</h3>
              <p className="text-muted-foreground">{point.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section align="center" eyebrow="FAQ" title="Questions, answered">
        <div className="mx-auto max-w-3xl">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <section className="container-page pb-24">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-14 md:px-14">
          <Logo className="absolute top-1/2 right-[-4%] h-[160%] w-auto -translate-y-1/2 opacity-10" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Ready when you are
              </h2>
              <p className="opacity-80">
                Pick a plan and your server is online in about a minute.
                Questions first? Our community on Discord is always around.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="bg-background text-foreground inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium hover:opacity-90"
                href="/games"
              >
                See plans
                <ArrowRightIcon className="size-4" />
              </Link>
              <a
                className="inline-flex h-11 items-center rounded-full border border-current/30 px-6 text-sm font-medium hover:bg-white/10"
                href={LINKS.discord}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
