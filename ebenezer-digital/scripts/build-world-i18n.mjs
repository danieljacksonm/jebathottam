/**
 * Generate world-language message bundles from English master.
 * Uses MyMemory free translation API (no key required, rate-limited).
 *
 * Usage: node scripts/build-world-i18n.mjs [locale]
 *   locale optional — e.g. "hi" for one language, omit for all non-en SEO locales
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "i18n", "messages");
const CACHE = join(ROOT, "data", "i18n", ".translate-cache.json");

const SEO_LOCALES = [
  "en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
  "it", "nl", "pl", "vi", "th", "sv", "no", "da", "fi", "cs", "ro",
  "hu", "uk", "he", "fa", "ms", "sw",
  "el", "bg", "sr", "hr", "sk", "lt", "lv", "et", "ne", "sl", "af",
  "ca", "fil", "sq", "am", "km", "lo", "my", "ka", "kk", "uz", "az",
  "be", "eu", "gl", "is", "cy", "ga", "mk", "bs", "hy", "mn",
];

/** MyMemory uses ISO codes; map our codes where needed. */
const TARGET_MAP = {
  fil: "tl",
  zh: "zh-CN",
  no: "nb",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(c) {
  writeFileSync(CACHE, JSON.stringify(c, null, 0));
}

/** Protect brand names and tech terms from machine mistranslation. */
const GLOSSARY = [
  ["Ebenezer Digital", "[[EBEN_DIGITAL]]"],
  ["Ebenezer", "[[EBEN]]"],
  ["Yegova", "[[YEGOVA]]"],
  ["SaaS", "[[SAAS]]"],
  ["Next.js", "[[NEXTJS]]"],
  ["NestJS", "[[NESTJS]]"],
  ["Prisma", "[[PRISMA]]"],
  ["MySQL", "[[MYSQL]]"],
  ["Redis", "[[REDIS]]"],
  ["TypeScript", "[[TS]]"],
  ["Tailwind", "[[TAILWIND]]"],
  ["Laravel", "[[LARAVEL]]"],
  ["Stripe/Razorpay", "[[PAY]]"],
  ["PM2", "[[PM2]]"],
  ["JSON-LD", "[[JSONLD]]"],
  ["Core Web Vitals", "[[CWV]]"],
  ["Search Console", "[[GSC]]"],
  ["Let's Encrypt", "[[LE]]"],
];

function protectTerms(text) {
  let out = text;
  for (const [term, token] of GLOSSARY) out = out.split(term).join(token);
  return out;
}

function restoreTerms(text) {
  let out = text.replace(/&amp;nbsp;/g, " ").replace(/&nbsp;/g, " ");
  const map = Object.fromEntries(GLOSSARY.map(([term, token]) => [token, term]));
  for (const [token, term] of Object.entries(map)) out = out.split(token).join(term);
  return out;
}

async function translateText(text, target) {
  if (!text?.trim()) return text;
  const key = `${target}::${text}`;
  const cache = loadCache();
  if (cache[key]) return restoreTerms(cache[key]);

  const protectedText = protectTerms(text);
  const tgt = TARGET_MAP[target] || target;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(protectedText.slice(0, 450))}&langpair=en|${tgt}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    const out = restoreTerms(data?.responseData?.translatedText || text);
    cache[key] = out;
    saveCache(cache);
    await sleep(350);
    return out;
  } catch (e) {
    console.warn(`  translate fail (${target}): ${text.slice(0, 40)}… — ${e.message}`);
    await sleep(500);
    return text;
  }
}

async function translateValue(val, target) {
  if (typeof val === "string") return translateText(val, target);
  if (Array.isArray(val)) {
    const out = [];
    for (const item of val) out.push(await translateValue(item, target));
    return out;
  }
  if (val && typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = await translateValue(v, target);
    }
    return out;
  }
  return val;
}

function buildEnglishMaster() {
  // Dynamic import of TS catalog — read JSON if exists, else build from inline
  const enPath = join(OUT, "en.json");
  if (existsSync(enPath)) return JSON.parse(readFileSync(enPath, "utf8"));

  const { SERVICE_LANDINGS } = (() => {
    const src = readFileSync(join(ROOT, "lib", "services-catalog.ts"), "utf8");
    const services = {};
    const blocks = src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?forWho:\s*"([^"]+)"[\s\S]*?value:\s*"([^"]+)"/g);
    for (const m of blocks) {
      services[m[1]] = { slug: m[1] };
    }
    return { SERVICE_LANDINGS: [] };
  })();

  // Import via tsx eval — simpler: require en.json pre-built
  throw new Error("Run: npx tsx scripts/export-en-i18n.ts first to create data/i18n/messages/en.json");
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const enPath = join(OUT, "en.json");
  if (!existsSync(enPath)) {
    console.error("Missing en.json — run: npx tsx scripts/export-en-i18n.ts");
    process.exit(1);
  }
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  const only = process.argv[2];
  const targets = only
    ? [only]
    : SEO_LOCALES.filter((l) => l !== "en");

  console.log(`\nBuilding ${targets.length} locale bundle(s) → ${OUT}\n`);

  for (const locale of targets) {
    const outPath = join(OUT, `${locale}.json`);
    if (existsSync(outPath) && !process.env.FORCE_I18N) {
      console.log(`SKIP ${locale} (exists — set FORCE_I18N=1 to rebuild)`);
      continue;
    }
    console.log(`Translating → ${locale}…`);
    const translated = await translateValue(
      { shell: en.shell, sections: en.sections, services: en.services, journal: en.journal },
      locale
    );
    writeFileSync(outPath, JSON.stringify(translated, null, 2));
    console.log(`  wrote ${locale}.json`);
  }
  console.log("\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
