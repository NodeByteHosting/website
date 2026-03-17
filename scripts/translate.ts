#!/usr/bin/env bun
/**
 * Automated translation script using the DeepL API.
 *
 * Usage:
 *   bun run scripts/translate.ts                  # Translate all missing keys for all locales
 *   bun run scripts/translate.ts --locale de-DE   # Specific locale only
 *   bun run scripts/translate.ts --force           # Re-translate even existing keys
 *   bun run scripts/translate.ts --dry-run         # Preview without writing files
 *
 * Requires:
 *   DEEPL_API_KEY environment variable (free or paid tier both work)
 *   https://www.deepl.com/pro-api
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, resolve } from "path"

// ─── Config ─────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dir, "..")
const TEMPLATE_PATH = join(ROOT, "translations", "templates", "en.json")
const MESSAGES_DIR = join(ROOT, "translations", "messages")
const LOCALES_PATH = join(ROOT, "translations", "locales.json")

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
// Free tier uses api-free.deepl.com; paid uses api.deepl.com
const DEEPL_BASE_URL = DEEPL_API_KEY?.endsWith(":fx")
  ? "https://api-free.deepl.com/v2"
  : "https://api.deepl.com/v2"

// Maximum texts per DeepL API call (API limit is 50)
const BATCH_SIZE = 50

// DeepL language code mapping from our locale codes
// null = not supported by DeepL, will be skipped
const DEEPL_LOCALE_MAP: Record<string, string | null> = {
  "en":    null, // Source language
  "en-US": null, // Also English
  "af-ZA": null, // Afrikaans — not supported by DeepL
  "ar-SA": "AR",
  "ca-ES": null, // Catalan — not supported by DeepL
  "cs-CZ": "CS",
  "da-DK": "DA",
  "de-DE": "DE",
  "el-GR": "EL",
  "es-ES": "ES",
  "fi-FI": "FI",
  "fr-FR": "FR",
  "he-IL": null, // Hebrew — not supported by DeepL
  "hu-HU": "HU",
  "it-IT": "IT",
  "ja-JP": "JA",
  "ko-KR": "KO",
  "nl-NL": "NL",
  "no-NO": "NB",
  "pl-PL": "PL",
  "pt-BR": "PT-BR",
  "pt-PT": "PT-PT",
  "ro-RO": "RO",
  "ru-RU": "RU",
  "sr-SP": "SR",
  "sv-SE": "SV",
  "tr-TR": "TR",
  "uk-UA": "UK",
  "vi-VN": "VI",
  "zh-CN": "ZH-HANS",
  "zh-TW": "ZH-HANT",
}

// ─── Argument parsing ────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const targetLocale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : null
const startFrom = args.includes("--start-from") ? args[args.indexOf("--start-from") + 1] : null
const forceRetranslate = args.includes("--force")
const dryRun = args.includes("--dry-run")

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Flatten a nested JSON object into dot-notation key paths.
 * e.g., { a: { b: "hello" } } => { "a.b": "hello" }
 */
function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val as Record<string, unknown>, path))
    } else if (typeof val === "string") {
      result[path] = val
    }
  }
  return result
}

/**
 * Set a deeply nested key in an object given a dot-notation path.
 */
function setNestedKey(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split(".")
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current) || typeof current[part] !== "object") {
      current[part] = {}
    }
    current = current[part] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}

/**
 * Escape ICU/next-intl placeholders like {name} so DeepL doesn't translate them.
 * Uses opaque numeric tokens (NBPH0, NBPH1, ...) that DeepL treats as untranslatable.
 */
function escapePlaceholders(text: string): { escaped: string; map: Map<string, string> } {
  const map = new Map<string, string>()
  let index = 0
  const escaped = text.replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, (match) => {
    const token = `NBPH${index}X`
    map.set(token, match)
    index++
    return token
  })
  return { escaped, map }
}

/**
 * Restore escaped placeholders in translated text.
 */
function restorePlaceholders(translated: string, map: Map<string, string>): string {
  let result = translated
  for (const [token, original] of map) {
    // Use a global replace in case DeepL duplicated or split the token
    result = result.replaceAll(token, original)
  }
  return result
}

// ─── DeepL API ───────────────────────────────────────────────────────────────

interface DeepLTranslation {
  detected_source_language: string
  text: string
}

interface DeepLResponse {
  translations: DeepLTranslation[]
}

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const body: Record<string, unknown> = {
    text: texts,
    source_lang: "EN",
    target_lang: targetLang,
    preserve_formatting: true,
  }

  const res = await fetch(`${DEEPL_BASE_URL}/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text()
    const err = new Error(`DeepL API error ${res.status}: ${errorText}`) as Error & { status: number }
    err.status = res.status
    throw err
  }

  const data = (await res.json()) as DeepLResponse
  return data.translations.map((t) => t.text)
}

/**
 * Translate an array of texts to the target DeepL language code.
 * Handles chunking to stay within the API's per-request limit.
 */
async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  const results: string[] = []
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const translated = await translateBatch(batch, targetLang)
    results.push(...translated)
    // Small delay between batches to be a good API citizen
    if (i + BATCH_SIZE < texts.length) {
      await new Promise((r) => setTimeout(r, 300))
    }
  }
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!DEEPL_API_KEY) {
    console.error("❌  DEEPL_API_KEY environment variable is not set.")
    console.error("    Get a free key at: https://www.deepl.com/pro-api")
    process.exit(1)
  }

  // Load source template
  const template = JSON.parse(readFileSync(TEMPLATE_PATH, "utf-8")) as Record<string, unknown>
  const sourceFlat = flattenObject(template)
  const sourceKeys = Object.keys(sourceFlat)

  console.log(`📄  Loaded template with ${sourceKeys.length} keys`)

  // Load locale list
  const localesConfig = JSON.parse(readFileSync(LOCALES_PATH, "utf-8")) as { locales: string[] }
  const allLocales = localesConfig.locales.filter((l) => l !== "en")

  const localesToProcess = targetLocale ? [targetLocale] : allLocales

  if (targetLocale && !allLocales.includes(targetLocale)) {
    console.error(`❌  Unknown locale: ${targetLocale}`)
    console.error(`    Available: ${allLocales.join(", ")}`)
    process.exit(1)
  }

  if (dryRun) console.log("🔍  Dry run — no files will be written\n")

  let totalTranslated = 0
  let skippedToStart = startFrom !== null

  for (const locale of localesToProcess) {
    // --start-from: skip locales until we reach the specified one
    if (skippedToStart && locale !== startFrom) {
      console.log(`⏩  ${locale} — skipping (before --start-from ${startFrom})`)
      continue
    }
    skippedToStart = false
    const deeplLang = DEEPL_LOCALE_MAP[locale]

    if (deeplLang === null) {
      console.log(`⏭️   ${locale} — skipped (language not supported by DeepL)`)
      continue
    }

    if (deeplLang === undefined) {
      console.log(`⚠️   ${locale} — no DeepL mapping configured, skipping`)
      continue
    }

    // The messages folder uses locale codes like "de-DE.json"
    // but en-US maps to "en-US.json" in messages/ (Crowdin uses en-US as the English locale)
    const messagesFile = join(MESSAGES_DIR, `${locale}.json`)

    let existing: Record<string, unknown> = {}
    if (existsSync(messagesFile)) {
      try {
        existing = JSON.parse(readFileSync(messagesFile, "utf-8"))
      } catch {
        console.warn(`⚠️   ${locale} — failed to parse existing file, will recreate`)
      }
    }

    const existingFlat = flattenObject(existing)

    // Determine which keys need translation
    const missingKeys = forceRetranslate
      ? sourceKeys
      : sourceKeys.filter((k) => !(k in existingFlat))

    if (missingKeys.length === 0) {
      console.log(`✅  ${locale} — already complete (${sourceKeys.length} keys)`)
      continue
    }

    console.log(`🌐  ${locale} (${deeplLang}) — translating ${missingKeys.length} missing keys...`)

    // Escape placeholders before sending to DeepL
    const escapedTexts: string[] = []
    const placeholderMaps: Map<string, string>[] = []

    for (const key of missingKeys) {
      const { escaped, map } = escapePlaceholders(sourceFlat[key])
      escapedTexts.push(escaped)
      placeholderMaps.push(map)
    }

    let translatedTexts: string[]
    try {
      translatedTexts = await translateTexts(escapedTexts, deeplLang)
    } catch (err) {
      const status = (err as Error & { status?: number }).status
      if (status === 456) {
        console.error(`\n❌  Monthly DeepL quota exceeded.`)
        console.error(`    Locales completed so far are saved.`)
        console.error(`    Resume next month with:`)
        console.error(`    bun run translate:force -- --start-from ${locale}`)
        process.exit(1)
      }
      console.error(`❌  ${locale} — translation failed: ${err}`)
      continue
    }

    // Merge translations back into the existing structure
    const merged: Record<string, unknown> = structuredClone(existing)
    for (let i = 0; i < missingKeys.length; i++) {
      const key = missingKeys[i]
      const restored = restorePlaceholders(translatedTexts[i], placeholderMaps[i])
      setNestedKey(merged, key, restored)
    }

    if (!dryRun) {
      writeFileSync(messagesFile, JSON.stringify(merged, null, 2) + "\n", "utf-8")
    }

    totalTranslated += missingKeys.length
    console.log(`   ✅  ${missingKeys.length} keys translated${dryRun ? " (dry run)" : ""}`)
  }

  console.log(`\n🎉  Done! ${totalTranslated} keys translated across ${localesToProcess.length} locale(s).`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
