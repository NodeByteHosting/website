import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createElement } from "react";

import { kb } from "@/.source/server";

export const source = loader({
  baseUrl: "/kb",
  icon: (name) => {
    const lookup: Record<string, LucideIcon> = icons;
    const icon = name ? lookup[name] : undefined;
    return icon ? createElement(icon) : undefined;
  },
  source: kb.toFumadocsSource(),
});
