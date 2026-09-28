/**
 * Multilingual QA — run: node scripts/audit-i18n.mjs
 * Fails on: cookie override risks, corrupt bundles, EN contamination markers,
 * missing published service translations, silent Hindi/Tamil on English masters.
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MSG = join(ROOT, "data", "i18n", "messages");
const PUBLISHED = ["en", "ta", "hi"];

const failures = [];
const warnings = [];

function fail(msg) {
  failures.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function isCorrupt(s) {
  if (typeof s !== "string") return false;
  const u = s.toUpperCase();
  return (
    u.includes("MYMEMORY WARNING") ||
    u.includes("AVAILABLE FREE TRANSLATIONS") ||
    u.includes("QUERY LENGTH LIMIT")
  );
}

function walkCorrupt(obj, path = "") {
  if (typeof obj === "string") {
    if (isCorrupt(obj)) fail(`Corrupt string at ${path}`);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walkCorrupt(v, `${path}[${i}]`));
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) walkCorrupt(v, path ? `${path}.${k}` : k);
  }
}

function hasDevanagari(s) {
  return /[\u0900-\u097F]/.test(s);
}
function hasTamil(s) {
  return /[\u0B80-\u0BFF]/.test(s);
}

// 1) Published bundles exist and are clean
const en = JSON.parse(readFileSync(join(MSG, "en.json"), "utf8"));
for (const loc of PUBLISHED) {
  const p = join(MSG, `${loc}.json`);
  if (!existsSync(p)) {
    fail(`Missing published bundle: ${loc}.json`);
    continue;
  }
  const j = JSON.parse(readFileSync(p, "utf8"));
  walkCorrupt(j, loc);
  if (loc === "en") {
    const blob = JSON.stringify(j);
    if (hasDevanagari(blob)) fail("English en.json contains Devanagari (Hindi) characters");
    if (hasTamil(blob)) fail("English en.json contains Tamil script characters");
  }
}

// 2) Service completeness for published locales
const enServices = Object.keys(en.services || {});
for (const loc of PUBLISHED.filter((l) => l !== "en")) {
  const j = JSON.parse(readFileSync(join(MSG, `${loc}.json`), "utf8"));
  for (const slug of enServices) {
    const t = j.services?.[slug];
    if (!t) {
      fail(`${loc}: missing service ${slug}`);
      continue;
    }
    for (const field of ["title", "forWho", "value"]) {
      if (!t[field] || isCorrupt(t[field])) fail(`${loc}:${slug}.${field} missing/corrupt`);
    }
    if (!t.capabilities?.length || !t.process?.length || !t.faq?.length) {
      fail(`${loc}:${slug} incomplete arrays`);
    }
  }
}

// 3) Soft locale files that are corrupt should not be treated as publishable
const softCorrupt = [];
for (const f of readdirSync(MSG).filter((n) => n.endsWith(".json"))) {
  const code = f.replace(/\.json$/, "");
  if (PUBLISHED.includes(code)) continue;
  const raw = readFileSync(join(MSG, f), "utf8");
  if (isCorrupt(raw.slice(0, 4000))) softCorrupt.push(code);
}
if (softCorrupt.length) {
  warn(
    `${softCorrupt.length} non-published bundles look corrupt (OK if unpublished): ${softCorrupt.slice(0, 12).join(",")}…`
  );
}

// 4) Source guards — cookie must not override URL
const useShell = readFileSync(join(ROOT, "lib/i18n/use-shell-messages.ts"), "utf8");
if (useShell.includes("localeFromCookie()") && useShell.includes("fromPath !== \"en\"")) {
  fail("use-shell-messages still falls back to cookie when path is English");
}
const reqLoc = readFileSync(join(ROOT, "lib/i18n/request-locale.ts"), "utf8");
if (reqLoc.includes("cookies()") && reqLoc.includes("eben-locale")) {
  fail("request-locale still reads eben-locale cookie (URL must win)");
}
const localize = readFileSync(join(ROOT, "lib/i18n/localize-service.ts"), "utf8");
if (localize.includes("|| base.title") || localize.includes("return base")) {
  // return base for en is OK; field fallback is not
  if (localize.includes("t.title || base.title")) {
    fail("localize-service still mixes English fields into non-English pages");
  }
}

console.log("=== Ebenezer i18n audit ===");
console.log(`Published locales: ${PUBLISHED.join(", ")}`);
console.log(`English services: ${enServices.length}`);
if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log("  ⚠", w));
}
if (failures.length) {
  console.log("\nFailures:");
  failures.forEach((f) => console.log("  ✖", f));
  process.exit(1);
}
console.log("\nPASS — published locales clean; URL-over-cookie guards present; services complete.");
