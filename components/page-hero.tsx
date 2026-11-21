import type { ReactNode } from "react";

import { cn } from "@/lib/ui";

import { Backdrop } from "./backdrop";

export const PageHero = ({
  actions,
  aside,
  children,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  description: ReactNode;
  eyebrow: string;
  title: ReactNode;
}) => (
  <section className="relative overflow-hidden border-b">
    <Backdrop />
    <div
      className={cn(
        "container-page relative grid items-center gap-12 py-16 md:py-20",
        Boolean(aside) && "lg:grid-cols-[1.2fr_1fr]"
      )}
    >
      <div className="flex flex-col items-start gap-5">
        <span className="text-link text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
          {description}
        </p>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        {children}
      </div>
      {aside}
    </div>
  </section>
);

export const Included = ({
  items,
}: {
  items: { text: string; title: string }[];
}) => (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <div
        className="border-primary/60 flex flex-col gap-2 border-l-2 pl-5"
        key={item.title}
      >
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-muted-foreground text-sm text-pretty">{item.text}</p>
      </div>
    ))}
  </div>
);
