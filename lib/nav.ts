import { GAMES } from "./games";
import { LEGAL_LINKS, LINKS } from "./site";

export const PRODUCT_LINKS = [
  {
    description: "Minecraft, Rust, Hytale, Palworld and more",
    href: "/games",
    label: "Game servers",
  },
  {
    description: "VPS with txAdmin ready for roleplay servers",
    href: "/fivem",
    label: "FiveM & RedM",
  },
  {
    description: "Full root Linux virtual machines",
    href: "/vps",
    label: "VPS hosting",
  },
  {
    description: "S3 compatible, with free API requests",
    href: "/object-storage",
    label: "Object storage",
  },
  {
    description: "Always-on hosting for bots and Lavalink",
    href: "/discord-bots",
    label: "Bots & voice",
  },
  {
    description: "Bare metal built to order",
    href: "/dedicated",
    label: "Dedicated servers",
  },
] as const;

export type ProductHref = (typeof PRODUCT_LINKS)[number]["href"];

export const GAME_LINKS = GAMES.map((game) => ({
  href: `/games/${game.slug}`,
  image: game.image,
  label: game.name,
}));

export const RESOURCE_LINKS = [
  { href: "/kb", label: "Knowledge base" },
  { href: LINKS.status, label: "Service status" },
  { href: "/changelog", label: "Changelog" },
  { href: LINKS.billing, label: "Client area" },
];

export const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
  { href: "/brand", label: "Brand assets" },
];

export const FOOTER_COLUMNS = [
  {
    links: PRODUCT_LINKS.map(({ href, label }) => ({ href, label })),
    title: "Hosting",
  },
  {
    links: [
      ...GAME_LINKS.map(({ href, label }) => ({ href, label })),
      { href: "/fivem", label: "FiveM & RedM" },
    ],
    title: "Games",
  },
  { links: RESOURCE_LINKS, title: "Resources" },
  { links: COMPANY_LINKS, title: "Company" },
  {
    links: LEGAL_LINKS.map(({ href, label }) => ({ href, label })),
    title: "Legal",
  },
];
