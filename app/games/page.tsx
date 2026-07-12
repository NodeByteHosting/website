import type { Metadata } from "next"
import { GameHub } from "@/packages/ui/components/Layouts/Games/game-hub"
import { getGamePlans } from "@/packages/core/products/billing-service"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { GAME_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

export const metadata: Metadata = {
  title: "Game Server Hosting",
  description:
    "One set of plans for every game we support. Instant setup, enterprise DDoS protection, NVMe SSD storage, and 24/7 support — pick your game at checkout.",
}

export default async function GamesPage() {
  const hub = await getCategoryHub(GAME_HUB_SLUGS)
  const children = hub?.children ?? []

  const plansByCategory = await Promise.all(children.map((c) => getGamePlans(c.slug)))
  const plans = plansByCategory.flat()

  return <GameHub plans={plans} />
}
