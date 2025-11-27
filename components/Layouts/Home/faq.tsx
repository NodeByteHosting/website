"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search } from "lucide-react"
import HeroGraphic from "./hero-graphic"

const faqs = [
  {
    question: "How fast can I provision a server?",
    answer:
      "Most prebuilt server templates provision in under 60 seconds. Custom setups with large mods may take longer depending on mod install time.",
  },
  {
    question: "Do you offer DDoS protection?",
    answer:
      "Yes all plans include automated DDoS mitigation at the network edge. For large or targeted attacks we provide additional scrubbing services on higher tiers.",
  },
  {
    question: "Where are your POPs located?",
    answer:
      "We operate multiple Points-of-Presence across Europe with more regions coming online. Check our coverage map or contact sales for custom regions.",
  },
  {
    question: "Can I run mods and custom maps?",
    answer:
      "Yes our control panel and templates support common mod loaders (Forge, Fabric) and custom map uploads. Managed mod support is available on selected plans.",
  },
  {
    question: "What is your uptime SLA?",
    answer:
      "We offer a 99.99% uptime SLA on production plans. See our terms for details and eligibility criteria.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs
    const q = query.toLowerCase()
    return faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
  }, [query])

  return (
    <section id="faq" className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Quick answers about NodeByte hosting, performance, and support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          <div className="relative order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card/20 p-6 hidden sm:block">
                <HeroGraphic />
              </div>
            </div>
          </div>

          <div className="space-y-4 order-1 lg:order-2">
            <div className="mb-4">
              <label htmlFor="faq-search" className="sr-only">
                Search FAQs
              </label>
              <div className="flex items-center gap-2 bg-card/50 border border-border rounded-lg px-3 py-2">
                <Search className="text-muted-foreground" size={18} />
                <input
                  id="faq-search"
                  placeholder="Search questions or answers..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground"
                />
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="text-muted-foreground">No results. Try different keywords like "DDoS", "mods", or "SLA".</div>
            )}

            {filtered.map((faq, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <button
                  aria-expanded={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                >
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{faq.question}</h3>
                  <ChevronDown
                    className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openIndex === index ? "rotate-180 text-primary" : ""
                    }`}
                    size={20}
                    aria-hidden
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
