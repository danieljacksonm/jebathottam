import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { SeoLocale } from "@/lib/site-url";
import { EN_SHELL, type ShellMessages } from "./en-shell";
import {
  EN_HOME,
  EN_STUDIO,
  type HomeMessages,
  type StudioMessages,
} from "./page-messages";
import { isCorruptTranslationText } from "./supported-locales";
import { pageHome, pageUi } from "./page-ui";

export type ServiceTranslation = {
  title: string;
  forWho: string;
  value: string;
  capabilities: string[];
  process: string[];
  faq: { q: string; a: string }[];
};

export type JournalTranslation = {
  title: string;
  excerpt: string;
  body: string;
};

export type LocaleMessages = {
  shell: ShellMessages;
  home: HomeMessages;
  studio: StudioMessages;
  sections: {
    services: string;
    whatWeDeliver: string;
    howWeWork: string;
    technology: string;
    faq: string;
    relatedLinks: string;
    contactUs: string;
    allServices: string;
    whoItIsFor: string;
    serviceNotFound: string;
  };
  services: Record<string, ServiceTranslation>;
  journal?: Record<string, JournalTranslation>;
};

const ROOT = process.cwd();
const MESSAGES_DIR = join(ROOT, "data", "i18n", "messages");

const EN_SECTIONS = {
  services: "Services",
  whatWeDeliver: "What we deliver",
  howWeWork: "How we work",
  technology: "Technology",
  faq: "FAQ",
  relatedLinks: "Related links",
  contactUs: "Contact us",
  allServices: "All services",
  whoItIsFor: "Who it is for",
  serviceNotFound: "Service not found.",
};

let enCache: LocaleMessages | null = null;

function deepHasCorrupt(value: unknown, depth = 0): boolean {
  if (depth > 8) return false;
  if (isCorruptTranslationText(value)) return true;
  if (Array.isArray(value)) return value.some((v) => deepHasCorrupt(v, depth + 1));
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((v) =>
      deepHasCorrupt(v, depth + 1)
    );
  }
  return false;
}

function readJson(path: string): LocaleMessages | null {
  try {
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8")) as LocaleMessages;
    if (deepHasCorrupt(parsed)) {
      console.error(`[i18n] Corrupt translation bundle rejected: ${path}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** English master — from bundled JSON or inline fallback. */
export function getEnglishMessages(): LocaleMessages {
  if (enCache) return enCache;
  const fromFile = readJson(join(MESSAGES_DIR, "en.json"));
  if (fromFile) {
    enCache = {
      ...fromFile,
      home: { ...EN_HOME, ...fromFile.home },
      studio: { ...EN_STUDIO, ...fromFile.studio },
    };
    return enCache;
  }
  enCache = {
    shell: EN_SHELL,
    home: EN_HOME,
    studio: EN_STUDIO,
    sections: EN_SECTIONS,
    services: {},
  };
  return enCache;
}

const cache = new Map<string, LocaleMessages>();
const missingWarned = new Set<string>();

function warnMissing(key: string) {
  if (process.env.NODE_ENV === "production") return;
  if (missingWarned.has(key)) return;
  missingWarned.add(key);
  console.warn(`[i18n] missing translation: ${key}`);
}

/**
 * Load messages for a locale.
 * - English: master bundle
 * - Other locales: require a real JSON file; corrupt/missing → English shell only for
 *   non-indexable soft shells, with explicit warnings (never silent Hindi→English page fakery
 *   for published routes — callers must check hasLocaleBundle / hasServiceTranslation).
 */
export function loadMessages(locale: SeoLocale): LocaleMessages {
  if (locale === "en") return getEnglishMessages();
  if (cache.has(locale)) return cache.get(locale)!;

  const file = readJson(join(MESSAGES_DIR, `${locale}.json`));
  const en = getEnglishMessages();
  const ui = pageUi(locale);
  const home = { ...en.home, ...pageHome(locale), ...file?.home };
  const merged: LocaleMessages = {
    shell: { ...en.shell, ...ui?.shell, ...file?.shell },
    home,
    studio: { ...en.studio, ...ui?.studio, ...file?.studio },
    sections: { ...en.sections, ...ui?.sections, ...file?.sections },
    // Never copy English service pages into another language.
    services: file?.services ? { ...file.services } : {},
    journal: file?.journal,
  };
  if (!file) warnMissing(`${locale}:bundle`);
  cache.set(locale, merged);
  return merged;
}

export function hasLocaleBundle(locale: SeoLocale): boolean {
  if (locale === "en") return true;
  const path = join(MESSAGES_DIR, `${locale}.json`);
  if (!existsSync(path)) return false;
  const file = readJson(path);
  return !!file;
}

/** True when a service slug has a complete non-English translation (no EN field fallback). */
export function hasServiceTranslation(locale: SeoLocale, slug: string): boolean {
  if (locale === "en") return true;
  const messages = loadMessages(locale);
  const t = messages.services?.[slug];
  if (!t) {
    warnMissing(`${locale}:services.${slug}`);
    return false;
  }
  if (
    !t.title ||
    !t.value ||
    !t.forWho ||
    !t.capabilities?.length ||
    !t.process?.length ||
    !t.faq?.length ||
    isCorruptTranslationText(t.title) ||
    isCorruptTranslationText(t.value)
  ) {
    warnMissing(`${locale}:services.${slug}:incomplete`);
    return false;
  }
  return true;
}
