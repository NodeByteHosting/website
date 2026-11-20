import type { Prices } from "@/lib/catalog";

import { Price } from "./currency";

export const FromPrice = ({
  className,
  prices,
}: {
  className?: string;
  prices: Prices | null;
}) =>
  prices ? (
    <span className={className}>
      From <Price className="text-foreground font-semibold" prices={prices} />
      /mo
    </span>
  ) : null;
