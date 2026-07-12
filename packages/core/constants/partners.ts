/**
 * Partners & sponsors shown on /partners.
 *
 * Add or remove entries here — the page groups them by `tier` automatically
 * and shows an empty-state invite for any tier with zero entries, so this
 * file can be edited freely without touching the page component.
 *
 * There's no real partner/sponsor data yet — the entries below are clearly
 * marked placeholders. Replace them (or delete down to an empty array) once
 * real partners sign on.
 */

export type PartnerTier = "sponsor" | "partner"

export interface PartnerEntry {
  id: string
  name: string
  tier: PartnerTier
  /** Path under /public, e.g. "/partners/example.svg" */
  logo: string
  url: string
  description: string
}

export const PARTNERS: PartnerEntry[] = [
  {
    id: "placeholder-sponsor-1",
    name: "Placeholder Sponsor",
    tier: "sponsor",
    logo: "/partners/placeholder.svg",
    url: "https://nodebyte.host",
    description: "Placeholder entry — replace with a real sponsor in packages/core/constants/partners.ts.",
  },
  {
    id: "placeholder-partner-1",
    name: "Placeholder Community",
    tier: "partner",
    logo: "/partners/placeholder.svg",
    url: "https://nodebyte.host",
    description: "Placeholder entry — replace with a real partner in packages/core/constants/partners.ts.",
  },
  {
    id: "placeholder-partner-2",
    name: "Placeholder Project",
    tier: "partner",
    logo: "/partners/placeholder.svg",
    url: "https://nodebyte.host",
    description: "Placeholder entry — replace with a real partner in packages/core/constants/partners.ts.",
  },
]
