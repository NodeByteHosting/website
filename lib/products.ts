import "server-only";
import { plansIn } from "./catalog";
import type { Plan, Prices } from "./catalog";

export const LINES = {
  bots: ["discord-bots", "premade-bots", "bot-hosting"],
  fivem: ["fivem-redm-vps"],
  games: ["managed-game-servers"],
  storage: ["object-storage"],
  voice: ["voice"],
  vps: ["intel", "amd", "shared-cpu", "dedicated-cpu"],
} as const;

export type Line = keyof typeof LINES;

export const plansFor = (line: Line) => plansIn(...LINES[line]);

export const fromPrice = (plans: Plan[]): Prices | null => {
  let cheapest: Plan | null = null;
  for (const plan of plans) {
    const price = plan.prices.GBP;
    if (price !== undefined && price < (cheapest?.prices.GBP ?? Infinity)) {
      cheapest = plan;
    }
  }
  return cheapest?.prices ?? null;
};

export const LOCATIONS = ["Newcastle, UK", "New York, US"] as const;
