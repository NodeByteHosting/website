/**
 * Parses hardware specs out of a Paymenter product description (HTML).
 *
 * Descriptions follow consistent bullet-point patterns, e.g.:
 *   "2 Cores of Ryzen 7 Power: ..."
 *   "4 GB DDR4 RAM: ..."
 *   "100 GB SSD Storage: ..."
 *   "1 Gbps Network Port: ... 1 TB included outbound ..."
 *
 * Everything extractable comes from here; the only things left in config
 * are `popular` flags and the series→location map.
 */

export interface ParsedSpecs {
  cpu?: number
  ramGB?: number
  storageGB?: number
  /** Raw storage label extracted from the description, e.g. "2 × 1 TB NVMe SSD (RAID 1)" */
  storageDescription?: string
  bandwidth?: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  cpuModel?: string
  hardware?: "amd" | "intel" | "arm"
  /** Short description extracted from the first bullet's subtitle. */
  description?: string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

/** Split stripped text into individual bullet lines for more reliable matching. */
function bulletLines(text: string): string[] {
  return text
    .split(/[•\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseDescriptionSpecs(html: string | null): ParsedSpecs {
  if (!html) return {}

  const text = stripHtml(html)
  const lines = bulletLines(text)

  // ── CPU cores ──────────────────────────────────────────────────────────────
  // "1 Core of Ryzen 7 Power", "2 Cores of Ryzen 7", "2 Ampere® Altra® ARM64 Cores"
  // Fallback: "8 cores and 16 threads", "Octa-Core", "Quad-Core"
  const NAMED_CORES: Record<string, number> = { mono: 1, dual: 2, quad: 4, hexa: 6, octa: 8, deca: 10, dodeca: 12 }
  let cpu: number | undefined
  for (const line of lines) {
    const m = line.match(/^(\d+)\s+(?:\S+\s+)*?[Cc]ores?/i)
    if (m && !line.match(/^(\d+)\s+GB/i)) {
      cpu = parseInt(m[1])
      break
    }
  }
  if (!cpu) {
    // "8 cores and 16 threads" — number before "cores" anywhere in text
    const m = text.match(/\b(\d+)\s+[Cc]ores?\b/)
    if (m) cpu = parseInt(m[1])
  }
  if (!cpu) {
    // "Octa-Core", "Quad-Core" etc
    for (const [name, count] of Object.entries(NAMED_CORES)) {
      if (new RegExp(`\\b${name}[- ]?[Cc]ore\\b`, 'i').test(text)) { cpu = count; break }
    }
  }

  // ── RAM ────────────────────────────────────────────────────────────────────
  // "2 GB DDR4 RAM", "4 GB ECC RAM", "8GB DDR4 RAM", "1 GB RAM"
  const ramMatch = text.match(/(\d+)\s*GB\s+(?:\w+\s+)*?RAM\b/i)
  const ramGB = ramMatch ? parseInt(ramMatch[1]) : undefined

  // ── Storage ────────────────────────────────────────────────────────────────
  // "25 GB SSD", "40 GB NVMe SSD", "100 GB SSD Storage", "40GB Disk Storage"
  // "80 GB Local NVMe Storage" (no SSD/HDD/Disk keyword)
  // Also handles TB drives: "2 x 1 TB NVMe SSD", "4 x 16 TB SATA HDD"
  const storageMatchGB = text.match(/(\d+)\s*GB\s+(?:Local\s+)?(?:NVMe\s+)?(?:SSD|Disk|HDD|Storage)\b/i)
  const storageMatchTB = !storageMatchGB
    ? text.match(/(\d+)\s*TB\s+(?:NVMe\s+|Enterprise\s+|SATA\s+)?(?:SSD|HDD|Disk)/i)
    : null
  const storageGB = storageMatchGB
    ? parseInt(storageMatchGB[1])
    : storageMatchTB
      ? parseInt(storageMatchTB[1]) * 1024
      : undefined

  // Raw storage label for multi-drive dedicated configs
  let storageDescription: string | undefined
  for (const line of lines) {
    if (/\b(?:NVMe|SSD|HDD)\b/i.test(line)) {
      const beforeColon = line.split(':')[0].trim()
      if (beforeColon.length > 4 && beforeColon.length < 80) storageDescription = beforeColon
      break
    }
  }

  // ── Uplink ─────────────────────────────────────────────────────────────────
  // "1 Gbps Network Port", "4 Gbps"
  const uplinkMatch = text.match(/(\d+)\s*Gbps/i)
  const uplink: ParsedSpecs["uplink"] = uplinkMatch
    ? { amount: parseInt(uplinkMatch[1]), unit: "Gbps" }
    : { amount: 1, unit: "Gbps" }

  // ── Bandwidth ──────────────────────────────────────────────────────────────
  // "1 TB included outbound", "20 TB Outbound Traffic Pool", "4 TB of poolable outbound"
  // "Unlimited Outbound Bandwidth" → null (unmetered)
  // Avoids false positives from storage descriptions ("4 x 16 TB Enterprise SATA HDDs")
  const unlimitedBw = /unlimited\s+(?:\w+\s+)?bandwidth/i.test(text)
  const bwTbMatch =
    text.match(/(\d+)\s+TB\s+(?:included\s+)?outbound/i) ||
    text.match(/(\d+)\s+TB\s+of\s+(?:poolable\s+)?outbound/i) ||
    text.match(/(\d+)\s+TB\s+Outbound/i) ||
    text.match(/(\d+)\s+TB\b[^.]*?(?:traffic|bandwidth)/i)
  const bandwidth: ParsedSpecs["bandwidth"] = unlimitedBw
    ? null
    : bwTbMatch
      ? { amount: parseInt(bwTbMatch[1]), unit: "TB" }
      : null

  // ── CPU model & hardware ───────────────────────────────────────────────────
  let cpuModel: string | undefined
  let hardware: ParsedSpecs["hardware"]

  const ryzenMatch = text.match(/AMD\s+Ryzen[™™]?\s+\d+(?:\s+(?:PRO\s+)?\d+\w*)?/i)
  const ampereMatch = text.match(/Ampere[®®]?\s+Altra[®®]?(?:\s+ARM64)?/i)
  // Intel: Xeon, Core Ultra, Core i-series
  const intelMatch = text.match(/Intel[®®]?\s+(?:Core[™™]?\s+Ultra\s+\d+(?:\s+\d+)?|Core[™™]?\s+i\d+[- ]\d+\w*|Xeon[®®]?(?:\s+\w+)*)/i)

  if (ryzenMatch) { cpuModel = ryzenMatch[0].trim(); hardware = "amd" }
  else if (/\bamd\b/i.test(text)) { hardware = "amd" }

  if (ampereMatch) { cpuModel = "Ampere® Altra® ARM64"; hardware = "arm" }
  else if (/\barm64?\b/i.test(text) && !ryzenMatch) { hardware = "arm" }

  if (intelMatch) { cpuModel = intelMatch[0].trim(); hardware = "intel" }
  else if (/\bintel\b/i.test(text) && !ryzenMatch && !ampereMatch) { hardware = "intel" }

  // ── Short description ──────────────────────────────────────────────────────
  // Pull the subtitle from the first bullet: "Spec Title: <description>."
  let description: string | undefined
  for (const line of lines) {
    const m = line.match(/^.+?:\s+(.{20,}?\.)/)
    if (m) { description = m[1].trim(); break }
  }

  return { cpu, ramGB, storageGB, storageDescription, bandwidth, uplink, cpuModel, hardware, description }
}

/**
 * Derive SKU, lineup, and series from the billing product name.
 * e.g. "COMP-RG1-8GB" → { sku: "COMP-RG1-8GB", lineup: "COMP", series: "RG1" }
 */
export function parseProductName(name: string): {
  sku: string
  lineup?: "BASE" | "COMP" | "GAME" | "ELITE"
  series?: string
} {
  const sku = name.toUpperCase().trim()
  const parts = sku.split("-")
  const LINEUPS = ["BASE", "COMP", "GAME", "ELITE"] as const
  type Lineup = (typeof LINEUPS)[number]
  const lineup = LINEUPS.includes(parts[0] as Lineup) ? (parts[0] as Lineup) : undefined
  const series = parts[1] ?? undefined
  return { sku, lineup, series }
}
