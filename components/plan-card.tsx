import { ArrowRightIcon, CheckIcon } from "lucide-react";

import type { Plan } from "@/lib/catalog";
import { buttonStyles, cn } from "@/lib/ui";

import { Price } from "./currency";

export const PlanCard = ({
  featureLimit = 5,
  highlight,
  plan,
}: {
  featureLimit?: number;
  highlight?: boolean;
  plan: Plan;
}) => {
  const soldOut = plan.stock === "out_of_stock";
  const hasSetupFee = Object.values(plan.setupFees).some((fee) => fee > 0);
  return (
    <article
      className={cn(
        "bg-card relative flex flex-col gap-5 rounded-2xl border p-6",
        highlight && "border-primary ring-primary/40 ring-1"
      )}
    >
      {highlight && (
        <span className="bg-primary text-primary-foreground absolute -top-3 left-6 rounded-full px-3 py-0.5 text-xs font-medium">
          Most popular
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          {plan.sku.toLowerCase() !== plan.name.toLowerCase() && (
            <span className="text-muted-foreground font-mono text-xs">
              {plan.sku}
            </span>
          )}
        </div>
        <div className="text-right">
          <Price
            className="text-3xl font-semibold tracking-tight"
            prices={plan.prices}
          />
          <span className="text-muted-foreground block text-xs">per month</span>
        </div>
      </div>

      {plan.tagline && (
        <p className="text-muted-foreground text-sm text-pretty">
          {plan.tagline}
        </p>
      )}

      {plan.specs.length > 0 && (
        <ul className="grid grid-cols-2 gap-2">
          {plan.specs.map((spec) => (
            <li
              className="bg-muted/60 rounded-lg px-3 py-2 text-sm font-medium"
              key={spec}
            >
              {spec}
            </li>
          ))}
        </ul>
      )}

      {plan.features.length > 0 && (
        <ul className="flex flex-col gap-2 text-sm">
          {plan.features
            .filter((feature) => !plan.specs.includes(feature.text))
            .slice(0, featureLimit)
            .map((feature) => (
              <li
                className="flex gap-2"
                key={`${feature.title}${feature.text}`}
              >
                <CheckIcon className="text-link mt-0.5 size-4 shrink-0" />
                <span className="text-muted-foreground">
                  {feature.title && (
                    <span className="text-foreground font-medium">
                      {feature.title}
                      {feature.text ? ": " : ""}
                    </span>
                  )}
                  {feature.text}
                </span>
              </li>
            ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        {soldOut ? (
          <span
            aria-disabled
            className={cn(
              buttonStyles.outline,
              "cursor-not-allowed opacity-60"
            )}
          >
            Out of stock
          </span>
        ) : (
          <a className={buttonStyles.primary} href={plan.url}>
            Order {plan.name}
            <ArrowRightIcon />
          </a>
        )}
        {hasSetupFee && (
          <span className="text-muted-foreground text-center text-xs">
            A one-off setup fee applies.
          </span>
        )}
      </div>
    </article>
  );
};

export const PlanGrid = ({
  emptyMessage = "Plans are being updated. Check back shortly, or ask us on Discord.",
  featureLimit,
  highlight,
  plans,
}: {
  emptyMessage?: string;
  featureLimit?: number;
  highlight?: string;
  plans: Plan[];
}) =>
  plans.length ? (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          featureLimit={featureLimit}
          highlight={plan.id === highlight}
          key={plan.id}
          plan={plan}
        />
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
      {emptyMessage}
    </p>
  );
