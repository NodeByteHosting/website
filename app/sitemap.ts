import type { MetadataRoute } from "next";

import { GAMES } from "@/lib/games";
import { SITE_URL } from "@/lib/site";
import { source } from "@/lib/source";

const PAGES = [
  "",
  "/games",
  "/fivem",
  "/vps",
  "/object-storage",
  "/discord-bots",
  "/dedicated",
  "/about",
  "/partners",
  "/contact",
  "/brand",
  "/changelog",
];

const sitemap = (): MetadataRoute.Sitemap => [
  ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
  ...GAMES.map((game) => ({ url: `${SITE_URL}/games/${game.slug}` })),
  ...source.getPages().map((page) => ({ url: `${SITE_URL}${page.url}` })),
];

export default sitemap;
