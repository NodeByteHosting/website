import {
  BotIcon,
  BoxIcon,
  CloudIcon,
  CpuIcon,
  GamepadIcon,
  ServerIcon,
} from "lucide-react";

import type { ProductHref } from "@/lib/nav";

const ICONS = {
  "/dedicated": CpuIcon,
  "/discord-bots": BotIcon,
  "/fivem": BoxIcon,
  "/games": GamepadIcon,
  "/object-storage": CloudIcon,
  "/vps": ServerIcon,
} as const;

export const ProductIcon = ({
  className,
  href,
}: {
  className?: string;
  href: ProductHref;
}) => {
  const Icon = ICONS[href];
  return <Icon className={className} />;
};
