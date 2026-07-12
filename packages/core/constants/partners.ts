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
    id: "embrly",
    name: "Emberly",
    tier: "partner",
    logo: "https://embrly.ca/icon.svg",
    url: "https://embrly.ca",
    description: "The open-source platform for secure file sharing and team collaboration. Upload, manage, and share content with custom domains, rich embeds, and built-in talent discovery.",
  },
  {
    id: "octo",
    name: "octoflow",
    tier: "partner",
    logo: "https://octoflow.ca/logo.png",
    url: "https://octoflow.ca",
    description: "Keep your team connected to every commit, pull request, and deployment without ever leaving your Discord server.",
  },
]
