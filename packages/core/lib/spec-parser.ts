
export interface ParsedSpecs {
  cpu?: number
  ramGB?: number
  ramType?: string
  storageGB?: number
  storageDescription?: string
  storageType?: "nvme" | "ssd" | "hdd" | "generic"
  bandwidth?: { amount: number; unit: "MB" | "GB" | "TB" } | null
  uplink?: { amount: number; unit: "Mbps" | "Gbps" }
  cpuModel?: string
  hardware?: "amd" | "intel" | "arm"
  description?: string
  location?: string
  databases?: number
  backups?: boolean
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

export function bulletLines(html: string): string[] {
  const withBreaks = html
    .replace(/<\/(li|p|div|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
  const text = withBreaks
    .replace(/<[^>]*>/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
  return text
    .split(/[•\n]/)
    .map((s) => s.trim().replace(/^>\s*/, ""))
    .filter(Boolean)
}

export function firstSizeGB(line: string): number | undefined {
  const m = line.match(/([\d,]+)\s*(GB|TB)\b/i)
  if (!m) return undefined
  const amount = parseInt(m[1].replace(/,/g, ""))
  return /tb/i.test(m[2]) ? amount * 1024 : amount
}

function splitSpecLine(line: string): string[] | null {
  const parts = line
    .split(/\s+[/|·]\s+|\s*·\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length < 2 || !parts.every((part) => /\d/.test(part) && part.length <= 40)) return null
  return parts
}

function isTitledBullet(line: string): boolean {
  return /^[^:]{1,60}:\s/.test(line)
}

export function parseDescriptionSpecs(html: string | null): ParsedSpecs {
  if (!html) return {}

  const text = stripHtml(html)
  const rawLines = bulletLines(html)
  const lines = rawLines.flatMap((line) => splitSpecLine(line) ?? [line])

  const NAMED_CORES: Record<string, number> = { mono: 1, dual: 2, quad: 4, hexa: 6, octa: 8, deca: 10, dodeca: 12 }
  let cpu: number | undefined
  for (const line of lines) {
    const m = line.match(/^(\d+)\s+(?:\S+\s+)*?v?[Cc]ores?/i)
    if (m && !line.match(/^(\d+)\s+GB/i)) {
      cpu = parseInt(m[1])
      break
    }
  }
  if (!cpu) {
    for (const line of lines) {
      const m = line.match(/(\d+)\s+(?:[\w/.-]+\s+){0,4}?v?[Cc]ores\b/)
      if (m) { cpu = parseInt(m[1]); break }
    }
  }
  if (!cpu) {
    for (const [name, count] of Object.entries(NAMED_CORES)) {
      if (new RegExp(`\\b${name}[- ]?[Cc]ore\\b`, 'i').test(text)) { cpu = count; break }
    }
  }
  if (!cpu) {
    const m = text.match(/\b(\d+)\s*(?:dedicated\s+)?v(?:CPU|Core)s?\b/i)
    if (m) cpu = parseInt(m[1])
  }

  const ramLine = lines.find((line) => /\bram\b|\bmemory\b/i.test(line))
  const ramGB = ramLine ? firstSizeGB(ramLine) : undefined
  const ramTypeMatch = ramLine ? ramLine.match(/DDR\s?([345])/i) : null
  const ramType = ramTypeMatch ? `DDR${ramTypeMatch[1]}` : undefined

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

  const storageDescription = storageLine
    ? (() => {
        const beforeColon = storageLine.split(':')[0].trim()
        return beforeColon.length > 4 && beforeColon.length < 80 ? beforeColon : undefined
      })()
    : undefined

  const uplinkMatch = text.match(/(\d+)\s*Gbps/i)
  const uplink: ParsedSpecs["uplink"] = uplinkMatch
    ? { amount: parseInt(uplinkMatch[1]), unit: "Gbps" }
    : { amount: 1, unit: "Gbps" }

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

  let cpuModel: string | undefined
  let hardware: ParsedSpecs["hardware"]

  const ryzenMatch = text.match(/(?:AMD\s+)?Ryzen[™™]?\s+(?:\d+\s+)?(?:PRO\s+)?\d+\w*/i)
  const ampereMatch = text.match(/Ampere[®®]?\s+Altra[®®]?(?:\s+ARM64)?/i)
  const intelMatch = text.match(/Intel[®®]?\s+(?:Core[™™]?\s+Ultra\s+\d+(?:\s+\d+)?|(?:Core[™™]?\s+)?i\d+[- ]\d+\w*|Xeon[®®]?(?:\s+\w+)*)/i)

  if (ryzenMatch) { cpuModel = ryzenMatch[0].trim(); hardware = "amd" }
  else if (/\bamd\b/i.test(text)) { hardware = "amd" }

  if (ampereMatch) { cpuModel = "Ampere® Altra® ARM64"; hardware = "arm" }
  else if (/\barm64?\b/i.test(text) && !ryzenMatch) { hardware = "arm" }

  if (intelMatch) { cpuModel = intelMatch[0].trim(); hardware = "intel" }
  else if (/\bintel\b/i.test(text) && !ryzenMatch && !ampereMatch) { hardware = "intel" }

  let description: string | undefined
  const headline = rawLines.findIndex((line) => splitSpecLine(line) !== null)
  if (headline !== -1) {
    const next = rawLines[headline + 1]
    if (next && !isTitledBullet(next) && !splitSpecLine(next) && next.length >= 15) description = next
  }
  if (!description) {
    for (const line of lines) {
      const m = line.match(/^.+?:\s+(.{20,}?\.)/)
      if (m) { description = m[1].trim(); break }
    }
  }

  let location: string | undefined
  const locationLine = lines.find((line) =>
    /\blocation|\bregion|\binfrastructure|\bprovisioned|\bhosted|\bdata\s*cent(?:er|re)/i.test(line),
  )
  if (locationLine) {
    const places = locationLine.match(/\b[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*,\s*[A-Z][a-zA-Z]+\b/g)
    if (places && places.length > 0) location = places.join(" / ")
  }

  let databases: number | undefined
  const dbMatch = text.match(/\b(\d+)x?\s+(?:isolated\s+)?(?:MySQL\s+|PostgreSQL\s+|SQL\s+)?[Dd]atabases?\b/)
  if (dbMatch) databases = parseInt(dbMatch[1])

  const backups = /\bbackups?\b/i.test(text) || undefined

  return { cpu, ramGB, ramType, storageGB, storageDescription, storageType, bandwidth, uplink, cpuModel, hardware, description, location, databases, backups }
}

export function formatStorageType(type: ParsedSpecs["storageType"]): string {
  switch (type) {
    case "nvme": return "NVMe Storage"
    case "ssd": return "SSD Storage"
    case "hdd": return "HDD Storage"
    default: return "Storage"
  }
}

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

export interface ObjectStorageSpecs {
  storageGB?: number
  storageValue?: string
  storageType?: ParsedSpecs["storageType"]
  accessKeys?: string
  egress?: string
  apiRequests?: string
  archivePolicy?: string
  features: string[]
}

const OBJECT_STORAGE_LABELS: Record<string, keyof ObjectStorageSpecs> = {
  "storage limit": "storageValue",
  "access keys": "accessKeys",
  "monthly egress": "egress",
  "egress": "egress",
  "api requests": "apiRequests",
  "auto-archive threshold": "archivePolicy",
}

export function parseObjectStorageSpecs(html: string | null): ObjectStorageSpecs {
  const result: ObjectStorageSpecs = { features: [] }
  if (!html) return result

  for (const line of bulletLines(html)) {
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/)
    const key = m ? OBJECT_STORAGE_LABELS[m[1].trim().toLowerCase()] : undefined

    if (m && key) {
      const value = m[2].trim()
      if (key === "storageValue") {
        result.storageValue = value
        result.storageGB = firstSizeGB(value)
        result.storageType = /nvme/i.test(value)
          ? "nvme"
          : /ssd/i.test(value)
            ? "ssd"
            : /hdd/i.test(value)
              ? "hdd"
              : "generic"
      } else {
        (result as unknown as Record<string, string>)[key] = value
      }
      continue
    }

    result.features.push(line)
  }

  return result
}

export interface BotSpecs {
  worksWith?: string
  ramMB?: number
  vcpu?: number
  storageGB?: number
  backups?: number
  features: string[]
}

export function parseBotSpecs(html: string | null): BotSpecs {
  const result: BotSpecs = { features: [] }
  if (!html) return result

  for (const line of bulletLines(html)) {
    const worksWith = line.match(/^works with\s*:?\s*(.+)$/i)
    if (worksWith) {
      result.worksWith = worksWith[1].trim()
      continue
    }

    const ram = line.match(/([\d.]+)\s*(MB|GB)\s*(?:of\s+)?RAM\b/i)
    if (ram && result.ramMB == null) {
      const amount = parseFloat(ram[1])
      result.ramMB = /gb/i.test(ram[2]) ? Math.round(amount * 1024) : Math.round(amount)
      continue
    }

    const cpu = line.match(/([\d.]+)\s*v(?:CPU|Core)s?\b/i)
    if (cpu && result.vcpu == null) {
      result.vcpu = parseFloat(cpu[1])
      continue
    }

    if (/storage|disk|ssd|nvme/i.test(line) && result.storageGB == null) {
      const size = line.match(/([\d.]+)\s*(MB|GB|TB)\b/i)
      if (size) {
        const amount = parseFloat(size[1])
        const unit = size[2].toUpperCase()
        result.storageGB = unit === "TB" ? amount * 1024 : unit === "MB" ? amount / 1024 : amount
        continue
      }
    }

    const backups = line.match(/(\d+)\s*Backups?\b/i)
    if (backups && result.backups == null) {
      result.backups = parseInt(backups[1])
      continue
    }

    result.features.push(line)
  }

  return result
}
