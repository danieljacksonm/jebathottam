import type { SeoLocale } from "@/lib/site-url";
import { EN_SHELL, type ShellMessages } from "./en-shell";
import enJson from "@/data/i18n/messages/en.json";
import taJson from "@/data/i18n/messages/ta.json";
import hiJson from "@/data/i18n/messages/hi.json";

/** Client nav strings — same JSON as the server bundles (en, ta, hi only). */
const SHELLS: Partial<Record<SeoLocale, Partial<ShellMessages>>> = {
  en: enJson.shell,
  ta: taJson.shell,
  hi: hiJson.shell,
};

export function clientShellMessages(locale: SeoLocale): ShellMessages {
  return { ...EN_SHELL, ...SHELLS[locale] };
}
