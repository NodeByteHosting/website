import { NextResponse } from 'next/server'
import { load } from 'cheerio'

export async function GET() {
  const url = 'https://uk.trustpilot.com/review/nodebyte.host'

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NodeByte-scraper/1.0 (+https://nodebyte.co.uk)'
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch trustpilot page', status: res.status }, { status: 502 })
    }

    const html = await res.text()
    const $ = load(html)

    let rating: number | null = null
    let reviewCount: number | null = null

    // First try: look for JSON-LD with aggregateRating
    const ldScripts = $('script[type="application/ld+json"]').map((i, el) => $(el).html()).get()
    for (const s of ldScripts) {
      if (!s) continue
      try {
        const data = JSON.parse(s)
        if (data) {
          // ld+json can be an object or an array
          const candidates = Array.isArray(data) ? data : [data]
          for (const c of candidates) {
            if (c && c.aggregateRating) {
              rating = Number(c.aggregateRating.ratingValue) || null
              reviewCount = Number(c.aggregateRating.reviewCount) || null
              break
            }
          }
        }
      } catch (e) {
        // ignore JSON parse errors
      }
      if (rating !== null || reviewCount !== null) break
    }

    // Fallback: try meta tags or visible text patterns
    if (rating === null) {
      const metaRating = $('meta[itemprop="ratingValue"]').attr('content') || $('meta[name="ratingValue"]').attr('content')
      if (metaRating) rating = Number(metaRating)
    }

    if (reviewCount === null) {
      const metaCount = $('meta[itemprop="reviewCount"]').attr('content') || $('meta[name="reviewCount"]').attr('content')
      if (metaCount) reviewCount = Number(metaCount)
    }

    // Last resort: regex search in HTML
    if ((rating === null || reviewCount === null)) {
      const maybe = html.match(/"ratingValue"\s*:\s*"?(\d+(?:\.\d+)?)"?/i)
      const maybeCount = html.match(/"reviewCount"\s*:\s*"?(\d+)"?/i)
      if (maybe && !rating) rating = Number(maybe[1])
      if (maybeCount && !reviewCount) reviewCount = Number(maybeCount[1])
    }

    return NextResponse.json({ rating, reviewCount, source: url })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error', details: String(err) }, { status: 500 })
  }
}
