import type { SeoLocale } from "@/lib/site-url";
import { EN_SHELL, type ShellMessages } from "./en-shell";
import enJson from "@/data/i18n/messages/en.json";
import taJson from "@/data/i18n/messages/ta.json";
import hiJson from "@/data/i18n/messages/hi.json";
import { siteChrome } from "./site-chrome";
import { pageUi } from "./page-ui";

/** Client nav strings — JSON bundles for en/ta/hi, chrome packs for the wider set. */
const SHELLS: Partial<Record<SeoLocale, Partial<ShellMessages>>> = {
  en: enJson.shell,
  ta: taJson.shell,
  hi: hiJson.shell,
};

export function clientShellMessages(locale: SeoLocale): ShellMessages {
  const chrome = siteChrome(locale);
  const ui = pageUi(locale);
  return {
    ...EN_SHELL,
    ...ui?.shell,
    home: chrome.home,
    news: chrome.news,
    journal: chrome.journal,
    search: chrome.search,
    subscribe: chrome.subscribe,
    ...SHELLS[locale],
  };
}
