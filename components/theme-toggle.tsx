"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/ui";

const subscribe = () => () => null;

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const dark = !mounted || resolvedTheme !== "light";
  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "text-muted-foreground hover:text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors",
        className
      )}
      onClick={() => setTheme(dark ? "light" : "dark")}
      title={dark ? "Light mode" : "Dark mode"}
      type="button"
    >
      {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  );
};
