import Link from "next/link";

import { fromPrice, plansFor } from "@/lib/products";
import { LINKS } from "@/lib/site";
import { buttonStyles, cn } from "@/lib/ui";

import { CurrencyMenu } from "./currency";
import { Logo } from "./logo";
import { DesktopNav, MobileNav } from "./site-nav";
import type { NavPrices } from "./site-nav";

const loadPrices = async (): Promise<NavPrices> => {
  const [games, fivem, vps, storage, bots] = await Promise.all([
    plansFor("games"),
    plansFor("fivem"),
    plansFor("vps"),
    plansFor("storage"),
    plansFor("bots"),
  ]);
  return {
    "/discord-bots": fromPrice(bots),
    "/fivem": fromPrice(fivem),
    "/games": fromPrice(games),
    "/object-storage": fromPrice(storage),
    "/vps": fromPrice(vps),
  };
};

export const SiteHeader = async () => {
  const prices = await loadPrices();
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="bg-background/75 mx-auto flex h-14 max-w-7xl items-center gap-4 rounded-2xl border pr-2 pl-4 shadow-lg shadow-black/10 backdrop-blur-xl">
        <Link className="flex shrink-0 items-center gap-2.5" href="/">
          <Logo className="h-6 w-auto" />
          <span className="font-semibold tracking-tight">NodeByte</span>
        </Link>
        <div className="flex flex-1 justify-center">
          <DesktopNav prices={prices} />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CurrencyMenu />
          </div>
          <a
            className={cn(
              buttonStyles.primary,
              "hidden h-9 px-4 sm:inline-flex"
            )}
            href={LINKS.login}
          >
            Client area
          </a>
          <MobileNav prices={prices} />
        </div>
      </div>
    </header>
  );
};
