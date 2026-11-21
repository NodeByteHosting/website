import { cn } from "@/lib/ui";

import { Logo } from "./logo";

export const Backdrop = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "pointer-events-none absolute inset-0 overflow-hidden",
      className
    )}
  >
    <div className="absolute -top-56 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_45%,transparent),transparent)]" />
    <div className="absolute right-[-12%] bottom-[-30%] h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--accent)_22%,transparent),transparent)]" />
    <Logo className="text-foreground absolute top-1/2 right-[-8%] h-[130%] w-auto -translate-y-1/2 opacity-[0.035]" />
  </div>
);
