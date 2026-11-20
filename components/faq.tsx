import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface FaqItem {
  answer: ReactNode;
  question: string;
}

export const Faq = ({ items }: { items: FaqItem[] }) => (
  <div className="divide-y rounded-2xl border">
    {items.map((item) => (
      <details className="group px-5 py-4 md:px-6" key={item.question}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
          {item.question}
          <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="text-muted-foreground mt-3 text-pretty">
          {item.answer}
        </div>
      </details>
    ))}
  </div>
);
