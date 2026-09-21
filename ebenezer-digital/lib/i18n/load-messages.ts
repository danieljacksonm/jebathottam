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

function readJson(path: string): LocaleMessages | null {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8")) as LocaleMessages;
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

/** Load translated messages for a locale (falls back to English for missing keys). */
export function loadMessages(locale: SeoLocale): LocaleMessages {
  if (locale === "en") return getEnglishMessages();
  if (cache.has(locale)) return cache.get(locale)!;
  const file = readJson(join(MESSAGES_DIR, `${locale}.json`));
  const en = getEnglishMessages();
  if (!file) {
    cache.set(locale, en);
    return en;
  }
  const merged: LocaleMessages = {
    shell: { ...en.shell, ...file.shell },
    home: { ...en.home, ...file.home },
    studio: { ...en.studio, ...file.studio },
    sections: { ...en.sections, ...file.sections },
    services: { ...en.services, ...file.services },
    journal: { ...en.journal, ...file.journal },
  };
  cache.set(locale, merged);
  return merged;
}

export function hasLocaleBundle(locale: SeoLocale): boolean {
  if (locale === "en") return true;
  return existsSync(join(MESSAGES_DIR, `${locale}.json`));
}
