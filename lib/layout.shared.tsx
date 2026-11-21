import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { Logo } from "@/components/logo";

import { LINKS } from "./site";

export const baseOptions = (): BaseLayoutProps => ({
  githubUrl: LINKS.github,
  links: [
    { text: "Hosting", url: "/" },
    { text: "Client area", url: LINKS.login },
  ],
  nav: {
    title: (
      <span className="flex items-center gap-2 font-semibold">
        <Logo className="h-5 w-auto" />
        NodeByte Docs
      </span>
    ),
  },
});
