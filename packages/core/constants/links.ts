/**
 * Central registry of all external URLs used across the site.
 * Update here once instead of hunting through every component.
 */

export const LINKS = {
  discord:           "https://discord.gg/nodebyte",
  github:            "https://github.com/NodeByteHosting",
  githubWebsite:     "https://github.com/NodeByteHosting/website",
  githubDiscussions: "https://github.com/orgs/NodeByteHosting/discussions",
  twitter:           "https://twitter.com/NodeByteHosting",
  trustpilot:        "https://uk.trustpilot.com/review/nodebyte.host",
  status:            "https://status.nodebyte.host",
  billing: {
    root:             "https://billing.nodebyte.host",
    store:            "https://billing.nodebyte.host/store",
    login:            "https://billing.nodebyte.host/login",
    submitTicket:     "https://billing.nodebyte.host/submitticket.php",
    freeTrial:        "https://billing.nodebyte.host/store/free-trial",
    amdVps:           "https://billing.nodebyte.host/store/vps-hosting",
    intelVps:         "https://billing.nodebyte.host/store/vps-hosting",
    minecraftHosting: "https://billing.nodebyte.host/store/minecraft-server-hosting",
    hytaleHosting:    "https://billing.nodebyte.host/store/hytale-hosting",
    rustHosting:      "https://billing.nodebyte.host/store/rust-hosting",
    minecraft:        "https://billing.nodebyte.host/store/minecraft",
    rust:             "https://billing.nodebyte.host/store/rust",
  },
} as const
