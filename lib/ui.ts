export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const BUTTON_BASE =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:size-4";

export const buttonStyles = {
  ghost: `${BUTTON_BASE} hover:bg-muted`,
  outline: `${BUTTON_BASE} bg-card border hover:bg-muted`,
  primary: `${BUTTON_BASE} bg-primary text-primary-foreground hover:opacity-90`,
} as const;
