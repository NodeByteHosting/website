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
  network:           "https://lg.nodebyte.host",
  contact:           "/contact",
  billing: {
    root:             "https://billing.nodebyte.host",
    store:            "https://billing.nodebyte.host",
    login:            "https://billing.nodebyte.host/login",
    submitTicket:     "https://billing.nodebyte.host/tickets/create",
    freeTrial:        "https://billing.nodebyte.host/products/free-trial",
    amdVps:           "https://billing.nodebyte.host/products/amdvps",
    intelVps:         "https://billing.nodebyte.host/products/intelvps",
    minecraftHosting: "https://billing.nodebyte.host/products/minecraft-server-hosting",
    hytaleHosting:    "https://billing.nodebyte.host/products/hytale-hosting",
    rustHosting:      "https://billing.nodebyte.host/products/rust-hosting",
    minecraft:        "https://billing.nodebyte.host/products/minecraft",
    rust:             "https://billing.nodebyte.host/products/rust",
    terrariaHosting:  "https://billing.nodebyte.host/products/terraria-server-hosting",
    gmodHosting:      "https://billing.nodebyte.host/products/garrys-mod-server-hosting",
    palworldHosting:  "https://billing.nodebyte.host/products/palworld-server-hosting",
  },
} as const
