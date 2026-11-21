import type { ReactNode } from "react";

import { cn } from "@/lib/ui";

export const Section = ({
  align = "left",
  children,
  className,
  description,
  eyebrow,
  id,
  title,
}: {
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: string;
  id?: string;
  title?: ReactNode;
}) => (
  <section className={cn("container-page py-20 md:py-24", className)} id={id}>
    {(title || eyebrow) && (
      <div
        className={cn(
          "mb-10 flex max-w-2xl flex-col gap-3",
          align === "center" && "mx-auto items-center text-center"
        )}
      >
        {eyebrow && (
          <span className="text-link text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        {title && (
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-muted-foreground text-lg text-pretty">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </section>
);
