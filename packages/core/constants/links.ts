/**
 * Central registry of all external URLs used across the site.
 * Update here once instead of hunting through every component.
 */

/** The NodeByte billing panel (nodebyte-bp). Store pages are /store/{category}/{product}. */
export const BILLING_URL = "https://billing.nodebyte.host"

export const LINKS = {
  discord:           "https://discord.gg/Bg3Sf5fqa4",
  github:            "https://github.com/NodeByteHosting",
  githubWebsite:     "https://github.com/NodeByteHosting/website",
  githubDiscussions: "https://github.com/orgs/NodeByteHosting/discussions",
  twitter:           "https://twitter.com/NodeByteHosting",
  trustpilot:        "https://uk.trustpilot.com/review/nodebyte.host",
  status:            "https://nodebytestat.us",
  lookingGlass:      `${BILLING_URL}/looking-glass`,
  contact:           "/contact",
  billing: {
    root:             BILLING_URL,
    store:            `${BILLING_URL}/store`,
    login:            `${BILLING_URL}/login`,
    submitTicket:     `${BILLING_URL}/tickets/new`,
    freeTrial:        `${BILLING_URL}/store/free-trial`,
    amdVps:           `${BILLING_URL}/store/amdvps`,
    intelVps:         `${BILLING_URL}/store/intelvps`,
    minecraftHosting: `${BILLING_URL}/store/minecraft-server-hosting`,
    hytaleHosting:    `${BILLING_URL}/store/hytale-hosting`,
    rustHosting:      `${BILLING_URL}/store/rust-hosting`,
    minecraft:        `${BILLING_URL}/store/minecraft`,
    rust:             `${BILLING_URL}/store/rust`,
    terrariaHosting:  `${BILLING_URL}/store/terraria-server-hosting`,
    gmodHosting:      `${BILLING_URL}/store/garrys-mod-server-hosting`,
    palworldHosting:  `${BILLING_URL}/store/palworld-server-hosting`,
    discordBots:      `${BILLING_URL}/store/discord-bots`,
  },
} as const
