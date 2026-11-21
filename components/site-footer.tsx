import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";

import { FOOTER_COLUMNS } from "@/lib/nav";
import { COMPANY, LINKS } from "@/lib/site";
import { getOverallStatus } from "@/lib/status";
import type { OverallStatus } from "@/lib/status";
import { buttonStyles, cn } from "@/lib/ui";

import { Logo } from "./logo";

const STATUS: Record<OverallStatus, { dot: string; label: string }> = {
  degraded: { dot: "bg-amber-500", label: "Some services degraded" },
  operational: { dot: "bg-emerald-500", label: "All systems operational" },
  outage: { dot: "bg-red-500", label: "Service disruption" },
  unknown: { dot: "bg-muted-foreground", label: "View service status" },
};

const SOCIAL = [
  { href: LINKS.discord, label: "Discord" },
  { href: LINKS.github, label: "GitHub" },
  { href: LINKS.twitter, label: "X" },
  { href: LINKS.trustpilot, label: "Trustpilot" },
];

const isExternal = (href: string) => href.startsWith("http");

export const SiteFooter = async () => {
  const status = STATUS[await getOverallStatus()];
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card/30 mt-auto border-t">
      <div className="container-page flex flex-col gap-8 border-b py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-sm flex-col gap-4">
          <Link className="flex items-center gap-2.5" href="/">
            <Logo className="h-7 w-auto" />
            <span className="text-lg font-semibold tracking-tight">
              NodeByte
            </span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Game servers, VPS and storage for communities and builders. Run from
            the UK since 2024.
          </p>
          <a
            className="bg-background hover:bg-muted inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
            href={LINKS.status}
          >
            <span className={cn("size-2 rounded-full", status.dot)} />
            {status.label}
          </a>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <span className="text-sm font-medium">Need a hand?</span>
          <div className="flex flex-wrap gap-2">
            <Link className={cn(buttonStyles.outline, "h-10")} href="/contact">
              Contact support
            </Link>
            <a
              className={cn(buttonStyles.primary, "h-10")}
              href={LINKS.discord}
            >
              <MessageCircleIcon />
              Join Discord
            </a>
          </div>
        </div>
      </div>

      <nav
        aria-label="Footer"
        className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5"
      >
        {FOOTER_COLUMNS.map((column) => (
          <div className="flex flex-col gap-3 text-sm" key={column.title}>
            <span className="font-medium">{column.title}</span>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {isExternal(link.href) ? (
                    <a
                      className="text-muted-foreground hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      className="text-muted-foreground hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="container-page text-muted-foreground flex flex-col gap-4 border-t py-6 text-xs md:flex-row md:items-center md:justify-between">
        <span>
          © {year} {COMPANY.name}. Company no. {COMPANY.number}. ICO reg.{" "}
          {COMPANY.ico}.
        </span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {SOCIAL.map((link) => (
            <li key={link.label}>
              <a className="hover:text-foreground" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
