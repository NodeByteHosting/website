import type { MetadataRoute } from "next"

const PRIVATE_PATHS = [
  "/admin/",
  "/dashboard/",
  "/api/",
  "/auth/",
  "/maintenance",
  "/setup",
]

/**
 * AI training scrapers — these scrape content for training datasets
 * without providing referral traffic in return. Fully disallowed.
 */
const AI_TRAINING_BOTS = [
  "GPTBot",           // OpenAI training
  "anthropic-ai",     // Anthropic training
  "CCBot",            // Common Crawl (primary LLM pre-training data source)
  "Google-Extended",  // Google Gemini training
  "Meta-ExternalAgent", // Meta Llama training
  "cohere-ai",        // Cohere training
  "Bytespider",       // ByteDance/TikTok training
  "Diffbot",          // Diffbot AI training
  "PetalBot",         // Huawei training
  "omgilibot",        // Webz.io training
  "omgili",           // Webz.io training (legacy UA)
  "DataForSeoBot",    // DataForSEO AI training
  "AI2Bot",           // Allen Institute for AI
  "img2dataset",      // LAION large-scale dataset scraper
  "Scrapy",           // Generic scraper (commonly used for training data)
]

/**
 * AI browsing/answer agents — these actually send users to your site
 * via citations and links. Allow public content, block private areas.
 */
const AI_BROWSING_AGENTS = [
  "ChatGPT-User",     // OpenAI ChatGPT browsing plugin
  "Claude-Web",       // Anthropic Claude browsing
  "PerplexityBot",    // Perplexity AI (drives referral traffic)
  "Applebot",         // Apple Siri/Spotlight
  "YouBot",           // You.com AI search
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all public content
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // AI training scrapers — fully disallowed
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: ["/"],
      },
      // AI browsing agents — allow public content only
      {
        userAgent: AI_BROWSING_AGENTS,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: "https://nodebyte.host/sitemap.xml",
    host: "https://nodebyte.host",
  }
}
