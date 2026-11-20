"use client";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import type { Currency, Prices } from "@/lib/catalog";

const CURRENCY_LIST: Currency[] = ["GBP", "USD", "EUR", "CAD", "AUD"];
const STORAGE_KEY = "nb-currency";
const LISTENERS = new Set<() => void>();

const read = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return CURRENCY_LIST.includes(stored as Currency)
      ? (stored as Currency)
      : "GBP";
  } catch {
    return "GBP";
  }
};

const subscribe = (listener: () => void) => {
  LISTENERS.add(listener);
  return () => LISTENERS.delete(listener);
};

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}>({ currency: "GBP", setCurrency: () => null });

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const currency = useSyncExternalStore<Currency>(subscribe, read, () => "GBP");
  const setCurrency = useCallback((next: Currency) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      return;
    }
    for (const listener of LISTENERS) {
      listener();
    }
  }, []);
  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency]
  );
  return <CurrencyContext value={value}>{children}</CurrencyContext>;
};

export const useCurrency = () => useContext(CurrencyContext);

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en-GB", {
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    style: "currency",
  }).format(amount);

export const Price = ({
  className,
  prices,
}: {
  className?: string;
  prices: Prices;
}) => {
  const { currency } = useCurrency();
  const amount = prices[currency] ?? prices.GBP;
  if (amount === undefined) {
    return null;
  }
  return (
    <span className={className}>
      {formatPrice(amount, prices[currency] === undefined ? "GBP" : currency)}
    </span>
  );
};

const CURRENCY_INFO: Record<Currency, { name: string; symbol: string }> = {
  AUD: { name: "Australian dollar", symbol: "A$" },
  CAD: { name: "Canadian dollar", symbol: "C$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British pound", symbol: "£" },
  USD: { name: "US dollar", symbol: "$" },
};

export const CurrencyMenu = () => {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Currency: ${CURRENCY_INFO[currency].name}`}
        className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="text-foreground">
          {CURRENCY_INFO[currency].symbol}
        </span>
        {currency}
        <ChevronDownIcon
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="bg-popover absolute top-full right-0 z-50 mt-3 w-60 rounded-xl border p-1 shadow-2xl shadow-black/30"
          role="menu"
        >
          {CURRENCY_LIST.map((code) => (
            <button
              className="hover:bg-muted flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm"
              key={code}
              onClick={() => {
                setCurrency(code);
                setOpen(false);
              }}
              role="menuitemradio"
              aria-checked={code === currency}
              type="button"
            >
              <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
                {CURRENCY_INFO[code].symbol}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="font-medium">{CURRENCY_INFO[code].name}</span>
                <span className="text-muted-foreground text-xs">{code}</span>
              </span>
              {code === currency && <CheckIcon className="text-link size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const CurrencyPicker = () => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Currency
      </span>
      <div className="grid grid-cols-5 gap-1.5">
        {CURRENCY_LIST.map((code) => (
          <button
            aria-pressed={code === currency}
            className={`flex flex-col items-center rounded-xl border py-2 text-xs font-medium transition-colors ${code === currency ? "border-primary bg-primary/15 text-foreground" : "text-muted-foreground"}`}
            key={code}
            onClick={() => setCurrency(code)}
            type="button"
          >
            <span className="text-foreground text-sm">
              {CURRENCY_INFO[code].symbol}
            </span>
            {code}
          </button>
        ))}
      </div>
    </div>
  );
};
