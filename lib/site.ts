export const SITE_URL = "https://nodebyte.host";

export const BILLING_URL = "https://billing.nodebyte.host";

export const LINKS = {
  billing: BILLING_URL,
  bytepanel: "https://bytepanel.nodebyte.host",
  discord: "https://discord.gg/Bg3Sf5fqa4",
  email: "support@nodebyte.host",
  freeTrial: `${BILLING_URL}/free-trial`,
  github: "https://github.com/NodeByteHosting",
  login: `${BILLING_URL}/login`,
  status: "https://nodebytestat.us",
  ticket: `${BILLING_URL}/tickets/new`,
  trustpilot: "https://uk.trustpilot.com/review/nodebyte.host",
  twitter: "https://twitter.com/NodeByteHosting",
} as const;

export const LEGAL_LINKS = [
  {
    href: "https://nodebyte.co.uk/legal/service-agreement",
    label: "Service level agreement",
  },
  { href: "https://nodebyte.co.uk/legal/terms", label: "Terms and conditions" },
  { href: "https://nodebyte.co.uk/legal/privacy", label: "Privacy policy" },
  {
    href: "https://nodebyte.co.uk/legal/payment-policy",
    label: "Refund policy",
  },
  { href: "https://nodebyte.co.uk/legal", label: "Legal hub" },
] as const;

export const COMPANY = {
  ico: "ZB832658",
  name: "NodeByte LTD",
  number: "15432941",
} as const;
