"use client";
import { ArrowRightIcon, ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import type { Prices } from "@/lib/catalog";
import {
  COMPANY_LINKS,
  GAME_LINKS,
  PRODUCT_LINKS,
  RESOURCE_LINKS,
} from "@/lib/nav";
import type { ProductHref } from "@/lib/nav";
import { LINKS } from "@/lib/site";
import { buttonStyles, cn } from "@/lib/ui";

import { CurrencyPicker, Price } from "./currency";
import { Logo } from "./logo";
import { ProductIcon } from "./product-icon";

export type NavPrices = Partial<Record<ProductHref, Prices | null>>;

type MenuId = "hosting" | "games" | null;

const useCloseOnNavigate = (close: () => void) => {
  const pathname = usePathname();
  const last = useRef(pathname);
  useEffect(() => {
    if (last.current !== pathname) {
      last.current = pathname;
      close();
    }
  }, [pathname, close]);
};

const Trigger = ({
  active,
  children,
  onOpen,
}: {
  active: boolean;
  children: ReactNode;
  onOpen: () => void;
}) => (
  <button
    aria-expanded={active}
    className={cn(
      "flex h-9 items-center gap-1 rounded-full px-3.5 text-sm font-medium transition-colors",
      active
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:text-foreground"
    )}
    onClick={onOpen}
    onFocus={onOpen}
    onMouseEnter={onOpen}
    type="button"
  >
    {children}
    <ChevronDownIcon
      className={cn("size-3.5 transition-transform", active && "rotate-180")}
    />
  </button>
);

const HostingPanel = ({ prices }: { prices: NavPrices }) => (
  <div className="grid grid-cols-[1fr_240px] gap-2">
    <div className="grid grid-cols-2 gap-1">
      {PRODUCT_LINKS.map((product) => (
        <Link
          className="group hover:bg-muted flex gap-3 rounded-xl p-3 transition-colors"
          href={product.href}
          key={product.href}
        >
          <span className="bg-primary/15 text-link flex size-10 shrink-0 items-center justify-center rounded-lg">
            <ProductIcon className="size-5" href={product.href} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium">{product.label}</span>
            <span className="text-muted-foreground text-xs">
              {product.description}
            </span>
            {prices[product.href] && (
              <span className="text-muted-foreground text-xs">
                From{" "}
                <Price
                  className="text-foreground font-medium"
                  prices={prices[product.href] ?? {}}
                />
                /mo
              </span>
            )}
          </span>
        </Link>
      ))}
    </div>
    <a
      className="bg-primary text-primary-foreground group relative flex flex-col justify-end gap-2 overflow-hidden rounded-xl p-5"
      href={LINKS.freeTrial}
    >
      <Logo className="absolute -top-6 -right-10 h-32 w-auto opacity-15" />
      <span className="text-xs font-medium tracking-wide uppercase opacity-80">
        New to NodeByte?
      </span>
      <span className="text-lg leading-snug font-semibold">
        Try a server free before you pay
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-medium">
        Start a free trial
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  </div>
);

const GamesPanel = () => (
  <div className="flex flex-col gap-2">
    <div className="grid grid-cols-4 gap-2">
      {GAME_LINKS.map((game) => (
        <Link
          className="group relative aspect-[4/5] overflow-hidden rounded-xl"
          href={game.href}
          key={game.href}
        >
          <Image
            alt=""
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="140px"
            src={game.image}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          <span className="absolute bottom-2.5 left-3 text-sm font-semibold text-white">
            {game.label}
          </span>
        </Link>
      ))}
    </div>
    <div className="flex items-center justify-between gap-4 px-1 pt-1 text-sm">
      <span className="text-muted-foreground">
        One set of plans for every game.
      </span>
      <Link className="text-link font-medium hover:underline" href="/games">
        All game servers
      </Link>
    </div>
  </div>
);

export const DesktopNav = ({ prices }: { prices: NavPrices }) => {
  const [open, setOpen] = useState<MenuId>(null);
  const close = () => setOpen(null);
  useCloseOnNavigate(close);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative hidden lg:block" onMouseLeave={close}>
      <nav className="flex items-center gap-0.5">
        <Trigger active={open === "hosting"} onOpen={() => setOpen("hosting")}>
          Hosting
        </Trigger>
        <Trigger active={open === "games"} onOpen={() => setOpen("games")}>
          Games
        </Trigger>
        {[
          { href: "/kb", label: "Docs" },
          { href: "/about", label: "About" },
        ].map((link) => (
          <Link
            className="text-muted-foreground hover:text-foreground h-9 rounded-full px-3.5 text-sm leading-9 font-medium"
            href={link.href}
            key={link.href}
            onFocus={close}
            onMouseEnter={close}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
          <div className="bg-popover w-[720px] rounded-2xl border p-2 shadow-2xl shadow-black/30">
            {open === "hosting" ? (
              <HostingPanel prices={prices} />
            ) : (
              <GamesPanel />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MobileNav = ({ prices }: { prices: NavPrices }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useCloseOnNavigate(close);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-label="Open menu"
        className="hover:bg-muted flex size-9 items-center justify-center rounded-full border"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MenuIcon className="size-4" />
      </button>
      {open &&
        createPortal(
          <div className="bg-background fixed inset-0 z-50 flex flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link
                className="flex items-center gap-2.5"
                href="/"
                onClick={close}
              >
                <Logo className="h-7 w-auto" />
                <span className="text-lg font-semibold tracking-tight">
                  NodeByte
                </span>
              </Link>
              <button
                aria-label="Close menu"
                className="hover:bg-muted flex size-9 items-center justify-center rounded-full border"
                onClick={close}
                type="button"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-4 py-6">
              <div className="flex flex-col gap-3">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Hosting
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_LINKS.map((product) => (
                    <Link
                      className="bg-card flex flex-col gap-2 rounded-xl border p-3"
                      href={product.href}
                      key={product.href}
                      onClick={close}
                    >
                      <ProductIcon
                        className="text-link size-5"
                        href={product.href}
                      />
                      <span className="text-sm font-medium">
                        {product.label}
                      </span>
                      {prices[product.href] && (
                        <span className="text-muted-foreground text-xs">
                          From <Price prices={prices[product.href] ?? {}} />
                          /mo
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Games
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {GAME_LINKS.map((game) => (
                    <Link
                      className="relative aspect-square overflow-hidden rounded-xl"
                      href={game.href}
                      key={game.href}
                      onClick={close}
                    >
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="25vw"
                        src={game.image}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-xs font-semibold text-white">
                        {game.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {[
                  { links: RESOURCE_LINKS, title: "Resources" },
                  { links: COMPANY_LINKS, title: "Company" },
                ].map((group) => (
                  <div className="flex flex-col gap-2" key={group.title}>
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      {group.title}
                    </span>
                    {group.links.map((link) => (
                      <Link
                        className="py-1 text-sm font-medium"
                        href={link.href}
                        key={link.label}
                        onClick={close}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <CurrencyPicker />
            </div>

            <div className="border-t p-4">
              <a
                className={cn(buttonStyles.primary, "w-full")}
                href={LINKS.login}
              >
                Client area
              </a>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
