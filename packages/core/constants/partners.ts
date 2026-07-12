/**
 * Partners, sponsors, and communities shown on /partners.
 *
 * Add or remove entries here — the page groups them by `tier` into their own
 * section automatically, hiding any tier with zero entries, so this file can
 * be edited freely without touching the page component.
 *
 *  - "sponsor" / "partner": companies and projects we have a business
 *    relationship with.
 *  - "community": servers/communities we host or sponsor for free or at a
 *    discount (Minecraft servers, Discord communities, etc). Set `category`
 *    to a short label like "Minecraft Server" or "Discord Community" — it
 *    renders as a badge on the card.
 */

export type PartnerTier = "sponsor" | "partner" | "community"

export interface PartnerEntry {
  id: string
  name: string
  tier: PartnerTier
  /** Short badge label, e.g. "Minecraft Server", "Discord Community". Optional — mainly useful for the community tier. */
  category?: string
  /** Path under /public, e.g. "/partners/example.svg" */
  logo: string
  url: string
  description: string
}

export const PARTNERS: PartnerEntry[] = [
  {
    id: "fyfeweb",
    name: "FyfeWeb",
    tier: "partner",
    logo: "/partners/fyfeweb.png",
    url: "https://fyfeweb.com",
    description: "From a single website to racks of your own hardware: one provider, one network, one support team.",
  },
  {
    id: "poliberry",
    name: "Poliberry",
    tier: "partner",
    logo: "/partners/poliberry.png",
    url: "https://poliberry.com",
    description: "Poliberry is a technology company building tools and services to better connect people online and empowering developers to build the next big thing.",
  },
  {
    id: "embrly",
    name: "Emberly",
    tier: "partner",
    logo: "/partners/emberly.svg",
    url: "https://embrly.ca",
    description: "The open-source platform for secure file sharing and team collaboration. Upload, manage, and share content with custom domains, rich embeds, and built-in talent discovery.",
  },
  {
    id: "clovrme",
    name: "Clover",
    tier: "partner",
    logo: "/partners/clovrme.svg",
    url: "https://clovr.me",
    description: "A profile page that's fully yours custom themes, music, animated backgrounds, and all your links in one place.",
  },
  {
    id: "octo",
    name: "Octoflow",
    tier: "partner",
    logo: "/partners/octoflow.png",
    url: "https://octoflow.ca",
    description: "Keep your team connected to every commit, pull request, and deployment without ever leaving your Discord server.",
  },
  {
    id: "antiraid",
    name: "AntiRaid",
    tier: "partner",
    logo: "/partners/antiraid.webp",
    url: "https://antiraid.xyz",
    description: "From basic moderation to advanced threat protection, AntiRaid handles it all so you can focus on growing your community.",
  },
  {
    id: "smphub",
    name: "SMP Hub",
    tier: "community",
    category: "Minecraft Community",
    logo: "/partners/smphub.webp",
    url: "https://discord.gg/d6sXpA7gXJ",
    description: "The premier directory designed to connect the Minecraft community.",
  },
  {
    id: "blizzardsmp",
    name: "Blizzard SMP",
    tier: "community",
    category: "Minecraft Community",
    logo: "/partners/blizzardsmp.webp",
    url: "https://discord.gg/mvQ9VqZ4D",
    description: "A warm, active community with a cool name and even cooler players.",
  },
]
