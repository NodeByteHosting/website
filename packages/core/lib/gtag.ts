export const GOOGLE_ADS_ID = "AW-16740819749"

/** Send-to labels for each conversion goal */
export const CONVERSION_IDS = {
  beginCheckout:  `${GOOGLE_ADS_ID}/qUthCNieibYcEKXG0q4-`,
  subscribe:      `${GOOGLE_ADS_ID}/2l-5CNueibYcEKXG0q4-`,
  purchase:       `${GOOGLE_ADS_ID}/eDjjCN6eibYcEKXG0q4-`,
  submitLeadForm: `${GOOGLE_ADS_ID}/CY9iCOGeibYcEKXG0q4-`,
  pageView:       `${GOOGLE_ADS_ID}/li9bCOSeibYcEKXG0q4-`,
  signUp:         `${GOOGLE_ADS_ID}/ElPhCOeeibYcEKXG0q4-`,
  getDirections:  `${GOOGLE_ADS_ID}/E4xrCOqeibYcEKXG0q4-`,
  requestQuote:   `${GOOGLE_ADS_ID}/WWVMCO2eibYcEKXG0q4-`,
  outboundClick:  `${GOOGLE_ADS_ID}/Y6xZCPCeibYcEKXG0q4-`,
  contact:        `${GOOGLE_ADS_ID}/Z1z3CJGcoLYcEKXG0q4-`,
} as const

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function fireConversion(
  sendTo: string,
  extra?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", "conversion", { send_to: sendTo, ...extra })
}

/** Ready-to-call helpers for each conversion goal */
export const conversions = {
  beginCheckout:  () => fireConversion(CONVERSION_IDS.beginCheckout),
  subscribe:      () => fireConversion(CONVERSION_IDS.subscribe),
  /** @param transactionId Optional order / invoice ID */
  purchase:       (transactionId = "") =>
    fireConversion(CONVERSION_IDS.purchase, { transaction_id: transactionId }),
  submitLeadForm: () => fireConversion(CONVERSION_IDS.submitLeadForm),
  pageView:       () => fireConversion(CONVERSION_IDS.pageView),
  signUp:         () => fireConversion(CONVERSION_IDS.signUp),
  getDirections:  () => fireConversion(CONVERSION_IDS.getDirections),
  requestQuote:   () => fireConversion(CONVERSION_IDS.requestQuote),
  outboundClick:  () => fireConversion(CONVERSION_IDS.outboundClick),
  contact:        () => fireConversion(CONVERSION_IDS.contact),
}
