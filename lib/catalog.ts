import "server-only";
import { unstable_cache } from "next/cache";

import { BILLING_URL } from "./site";

export const CURRENCIES = ["GBP", "USD", "EUR", "CAD", "AUD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type Prices = Partial<Record<Currency, number>>;

export interface PlanFeature {
  text: string;
  title: string | null;
}

export interface Plan {
  category: string;
  features: PlanFeature[];
  id: string;
  name: string;
  note: string | null;
  prices: Prices;
  setupFees: Prices;
  sku: string;
  specs: string[];
  stock: "in_stock" | "out_of_stock";
  tagline: string | null;
  url: string;
}

interface RawPrice {
  currency_code: string;
  price: number;
  setup_fee: number;
}

interface RawPlan {
  billing_period: number | null;
  billing_unit: string | null;
  prices: RawPrice[];
  type: "free" | "one-time" | "recurring";
}

interface RawProduct {
  category_id: number | null;
  description: string | null;
  id: number;
  name: string;
  plans: RawPlan[];
  slug: string;
  sort: number | null;
  stock: number | null;
}

interface RawCategory {
  id: number;
  name: string;
  parent_id: number | null;
  slug: string;
}

interface Catalog {
  categories: RawCategory[];
  products: RawProduct[];
}

const ENTITIES: Record<string, string> = {
  "&#39;": "'",
  "&amp;": "&",
  "&gt;": ">",
  "&lt;": "<",
  "&nbsp;": " ",
  "&quot;": '"',
};

const htmlToLines = (html: string) =>
  html
    .replaceAll(/<br\s*\/?>/giu, "\n")
    .replaceAll(/<li[^>]*>/giu, "\n- ")
    .replaceAll(/<\/(?:p|li|ul|ol|div|h\d)>/giu, "\n")
    .replaceAll(/<(?:strong|b)>/giu, "**")
    .replaceAll(/<\/(?:strong|b)>/giu, "**")
    .replaceAll(/<[^>]+>/gu, "")
    .replaceAll(/&[#\w]+;/gu, (entity) => ENTITIES[entity] ?? entity);

const stripBold = (text: string) => text.replaceAll("**", "").trim();

const parseFeature = (line: string): PlanFeature => {
  const match = /^\*\*(?<title>.+?)\*\*\s*:?\s*(?<rest>.*)$/u.exec(line);
  if (!match?.groups) {
    return { text: stripBold(line), title: null };
  }
  const title = stripBold(match.groups.title ?? "").replace(/:$/u, "");
  const text = stripBold((match.groups.rest ?? "").replace(/^:\s*/u, ""));
  return text ? { text, title } : { text: title, title: null };
};

const startsWithNumber = (text: string | null) =>
  /^[\d.,]+\s/u.test(text ?? "");

const toLines = (source: string) =>
  (source.includes("<") ? htmlToLines(source) : source)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const parseDescription = (description: string | null) => {
  const lines = toLines(description ?? "");
  let specs: string[] = [];
  let tagline: string | null = null;
  let note: string | null = null;
  const features: PlanFeature[] = [];

  for (const line of lines) {
    if (line.startsWith("- ")) {
      features.push(parseFeature(line.slice(2).trim()));
    } else if (!specs.length && line.startsWith("**") && line.includes("·")) {
      specs = stripBold(line)
        .split("·")
        .map((part) => part.trim())
        .filter(Boolean);
    } else if (line.startsWith(">")) {
      note = stripBold(line.slice(1));
    } else if (features.length) {
      note = stripBold(line);
    } else {
      tagline = tagline ? `${tagline} ${stripBold(line)}` : stripBold(line);
    }
  }

  if (!specs.length) {
    const untitled = features.filter(
      (f) => !f.title && startsWithNumber(f.text)
    );
    if (untitled.length) {
      specs = untitled.map((f) => f.text);
      return {
        features: features.filter((f) => !untitled.includes(f)),
        note,
        specs,
        tagline,
      };
    }
    const titled = features.filter((f) => startsWithNumber(f.title));
    if (titled.length) {
      specs = titled.map((f) => f.title ?? "");
    } else {
      const storage = features.find((f) => f.title === "Storage Limit");
      if (storage) {
        specs = [storage.text];
      }
    }
  }

  return { features, note, specs, tagline };
};

const SKU_PREFIX =
  /^(?:GAME|CFX-VPS|DISCORD-BOT|LAVALINK|E5-\d+|[A-Z0-9]+)[-–]/u;

const displayName = (name: string) => {
  if (!/^[A-Z0-9][A-Z0-9-–]+$/u.test(name)) {
    return name;
  }
  const tier = name.replace(SKU_PREFIX, "").toLowerCase();
  return tier.charAt(0).toUpperCase() + tier.slice(1);
};

const monthlyPlan = (product: RawProduct) =>
  product.plans.find(
    (plan) =>
      plan.type === "recurring" &&
      plan.billing_period === 1 &&
      plan.billing_unit === "month"
  ) ??
  product.plans.find((plan) => plan.type === "recurring") ??
  product.plans[0];

const priceMap = (plan: RawPlan | undefined, key: "price" | "setup_fee") => {
  const prices: Prices = {};
  for (const price of plan?.prices ?? []) {
    if ((CURRENCIES as readonly string[]).includes(price.currency_code)) {
      prices[price.currency_code as Currency] = price[key];
    }
  }
  return prices;
};

const fetchCatalog = async (): Promise<Catalog | null> => {
  const host = process.env.BYTEPAY_HOST?.replace(/\/+$/u, "");
  if (!host) {
    return null;
  }
  try {
    const res = await fetch(`${host}/api/v1/catalog`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return null;
    }
    const body = (await res.json()) as { data: Catalog };
    return body.data;
  } catch {
    return null;
  }
};

const loadPlans = async (): Promise<Plan[] | null> => {
  const catalog = await fetchCatalog();
  if (!catalog) {
    return null;
  }
  const categories = new Map(catalog.categories.map((c) => [c.id, c]));
  return catalog.products
    .toSorted((a, b) => (a.sort ?? 999) - (b.sort ?? 999) || a.id - b.id)
    .map((product) => {
      const category = product.category_id
        ? categories.get(product.category_id)
        : undefined;
      const plan = monthlyPlan(product);
      const parsed = parseDescription(product.description);
      return {
        ...parsed,
        category: category?.slug ?? "",
        id: product.slug,
        name: displayName(product.name.replaceAll("–", "-")),
        prices: priceMap(plan, "price"),
        setupFees: priceMap(plan, "setup_fee"),
        sku: product.name.replaceAll("–", "-"),
        stock: product.stock === 0 ? "out_of_stock" : "in_stock",
        url: `${BILLING_URL}/store/${category?.slug ?? ""}/${product.slug}`,
      } satisfies Plan;
    });
};

const getPlans = unstable_cache(loadPlans, ["catalog-plans"], {
  revalidate: 300,
});

export const plansIn = async (...categories: string[]) => {
  const plans = await getPlans();
  return plans?.filter((plan) => categories.includes(plan.category)) ?? [];
};
