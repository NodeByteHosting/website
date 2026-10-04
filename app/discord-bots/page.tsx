import type { Metadata } from "next"
import { DiscordBotsHub } from "@/packages/ui/components/Layouts/DiscordBots/discord-bots-hub"
import { getDiscordBotPlans } from "@/packages/core/products/billing-service"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { DISCORD_BOT_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

export const metadata: Metadata = {
  title: "Discord Bot Hosting",
  description:
    "Affordable 24/7 Discord bot hosting for Node.js, Python, Java, Go, Rust and more, with backups, DDoS protection and instant setup.",
}

export default async function DiscordBotsPage() {
  const hub = await getCategoryHub(DISCORD_BOT_HUB_SLUGS)
  const categorySlugs = hub?.children.map((c) => c.slug) ?? []

  const plansByCategory = await Promise.all(categorySlugs.map((slug) => getDiscordBotPlans(slug)))

  return <DiscordBotsHub plans={plansByCategory.flat()} />
}
