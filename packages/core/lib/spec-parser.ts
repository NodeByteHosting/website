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
  /** RAM generation if the description names one, e.g. "DDR3"/"DDR4"/"DDR5" — omitted when unspecified. */
  ramType?: string
  storageGB?: number
  /** Raw storage label extracted from the description, e.g. "2 × 1 TB NVMe SSD (RAID 1)" */
  storageDescription?: string
  /** Which storage keyword the description actually used — "generic" when it only said e.g. "40 GB Storage Array" with no drive type. */
  storageType?: "nvme" | "ssd" | "hdd" | "generic"
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

/**
 * Split into individual bullet lines. Paymenter descriptions are usually a
 * `<ul><li>` list (one bullet per `<li>`); older ones instead separate
 * bullets with a "•" character or bare newlines. Insert a line break at each
 * list-item/paragraph/`<br>` boundary before stripping tags so line-based
 * extraction below sees one bullet per line regardless of which format the
 * description actually uses.
 */
function bulletLines(html: string): string[] {
  const withBreaks = html
    .replace(/<\/(li|p|div|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
  const text = withBreaks
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
  return text
    .split(/[•\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** First "<number> GB|TB" in a line, converted to GB (TB × 1024). Returns undefined if the line has none. */
function firstSizeGB(line: string): number | undefined {
  const m = line.match(/(\d+)\s*(GB|TB)\b/i)
  if (!m) return undefined
  const amount = parseInt(m[1])
  return /tb/i.test(m[2]) ? amount * 1024 : amount
}

export function parseDescriptionSpecs(html: string | null): ParsedSpecs {
  if (!html) return {}

  const text = stripHtml(html)
  const lines = bulletLines(html)

  // ── CPU cores ──────────────────────────────────────────────────────────────
  // "1 Core of Ryzen 7 Power", "2 Cores of Ryzen 7", "2 Ampere® Altra® ARM64 Cores"
  // "ELITE Resource Allocation: 8 Dedicated/Pinned Physical Cores and 16 threads"
  // Fallback: "8 cores and 16 threads", "Octa-Core", "Quad-Core", "2 vCPU"
  //
  // Deliberately NOT a "grab any number near the word core/cpu" fallback —
  // descriptions also state the CPU *model* number in the same breath
  // ("Ryzen™ 9 5900X", "Core Ultra 7 265"), and a wrong core count is worse
  // than none: it ships incorrect specs instead of just dropping the plan
  // (which surfaces via warnDroppedProduct so it gets fixed at the source).
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
    // Number and "Cores" in the same bullet but not at the start of it — e.g.
    // "ELITE Resource Allocation: 8 Dedicated/Pinned Physical Cores and 16
    // threads". Allow up to 4 filler words between the number and "Cores",
    // bounded per-line so it can't reach into an unrelated bullet.
    // Requires the plural "Cores", not "Core" — singular "Core" shows up in
    // non-count marketing phrases too ("Ryzen™ 9 5900X Core Processing",
    // "Core Ultra 7 265"), where the preceding number is a CPU model number,
    // not a core count, and guessing wrong is worse than leaving it unset.
    for (const line of lines) {
      const m = line.match(/(\d+)\s+(?:[\w/.-]+\s+){0,4}?[Cc]ores\b/)
      if (m) { cpu = parseInt(m[1]); break }
    }
  }
  if (!cpu) {
    // "Octa-Core", "Quad-Core" etc
    for (const [name, count] of Object.entries(NAMED_CORES)) {
      if (new RegExp(`\\b${name}[- ]?[Cc]ore\\b`, 'i').test(text)) { cpu = count; break }
    }
  }
  if (!cpu) {
    // "2 vCPU", "4 vCPUs" — common cloud/VPS-style core count phrasing
    const m = text.match(/\b(\d+)\s*vCPUs?\b/i)
    if (m) cpu = parseInt(m[1])
  }

  // ── RAM ────────────────────────────────────────────────────────────────────
  // Any bullet mentioning "RAM" or "memory" is classified as the RAM line;
  // the first GB figure in that line is the amount, wherever it sits.
  // "2 GB DDR4 RAM", "4 GB ECC RAM", "RAM: 16GB of fast memory"
  const ramLine = lines.find((line) => /\bram\b|\bmemory\b/i.test(line))
  const ramGB = ramLine ? firstSizeGB(ramLine) : undefined
  const ramTypeMatch = ramLine ? ramLine.match(/DDR\s?([345])/i) : null
  const ramType = ramTypeMatch ? `DDR${ramTypeMatch[1]}` : undefined

  // ── Storage ────────────────────────────────────────────────────────────────
  // Any bullet mentioning a storage-ish keyword is classified as the storage
  // line; the first GB/TB figure in it is the amount. Tolerates arbitrary
  // wording/ordering — "80 GB Local NVMe Storage", "Storage: 80GB of blazing
  // SSD space", "2 x 1 TB NVMe SSD (RAID 1)" all resolve the same way.
  const storageLine = lines.find((line) => /\b(?:ssd|hdd|nvme|storage|disk|drive)\b/i.test(line))
  const storageGB = storageLine ? firstSizeGB(storageLine) : undefined

  const storageType: ParsedSpecs["storageType"] = storageLine
    ? /nvme/i.test(storageLine)
      ? "nvme"
      : /ssd/i.test(storageLine)
        ? "ssd"
        : /hdd/i.test(storageLine)
          ? "hdd"
          : "generic"
    : undefined

  // Raw storage label for multi-drive dedicated configs
  const storageDescription = storageLine
    ? (() => {
        const beforeColon = storageLine.split(':')[0].trim()
        return beforeColon.length > 4 && beforeColon.length < 80 ? beforeColon : undefined
      })()
    : undefined

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

  // "AMD Ryzen™ 9 5900X", "Ryzen 3700X" (single model token, no series digit,
  // "AMD" prefix not always stated — "Ryzen" alone is unambiguously AMD)
  const ryzenMatch = text.match(/(?:AMD\s+)?Ryzen[™™]?\s+(?:\d+\s+)?(?:PRO\s+)?\d+\w*/i)
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

  return { cpu, ramGB, ramType, storageGB, storageDescription, storageType, bandwidth, uplink, cpuModel, hardware, description }
}

/** Human-friendly storage type label — falls back to "Storage Array" when the description didn't name a drive type. */
export function formatStorageType(type: ParsedSpecs["storageType"]): string {
  switch (type) {
    case "nvme": return "NVMe SSD Storage"
    case "ssd": return "SSD Storage"
    case "hdd": return "HDD Storage"
    default: return "Storage Array"
  }
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
