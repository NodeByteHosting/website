import { NextResponse } from "next/server"

// Cache for 1 hour — rates don't need to be real-time for pricing display
export const revalidate = 3600

const SUPPORTED = ["USD", "EUR", "CAD", "AUD"] as const

// Static fallback in case the upstream API is unavailable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.27,
  EUR: 1.20,
  CAD: 1.78,
  AUD: 1.97,
}

export async function GET() {
  try {
    const symbols = SUPPORTED.join(",")
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=GBP&to=${symbols}`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      }
    )

    if (!res.ok) {
      throw new Error(`Frankfurter responded with ${res.status}`)
    }

    const data = await res.json()

    // Validate the response shape
    if (!data.rates || typeof data.rates !== "object") {
      throw new Error("Unexpected response shape from Frankfurter")
    }

    return NextResponse.json(
      { rates: data.rates as Record<string, number>, base: "GBP", date: data.date },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    )
  } catch (err) {
    // Return fallback rates so the UI still works
    console.error("[currency/rates] Failed to fetch live rates, using fallback:", err)
    return NextResponse.json(
      { rates: FALLBACK_RATES, base: "GBP", date: null, fallback: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  }
}
