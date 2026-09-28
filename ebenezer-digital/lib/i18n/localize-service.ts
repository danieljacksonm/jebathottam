import type { ServiceLanding } from "@/lib/services-catalog";
import { getServiceLanding } from "@/lib/services-catalog";
import type { SeoLocale } from "@/lib/site-url";
import { hasServiceTranslation, loadMessages } from "./load-messages";

/**
 * Service landing for a locale.
 * Non-English: requires a complete translation — never silently return English under /ta or /hi.
 */
export function getLocalizedService(
  slug: string,
  locale: SeoLocale
): ServiceLanding | undefined {
  const base = getServiceLanding(slug);
  if (!base) return undefined;
  if (locale === "en") return base;

  if (!hasServiceTranslation(locale, slug)) return undefined;

  const t = loadMessages(locale).services[slug];
  return {
    ...base,
    title: t.title,
    forWho: t.forWho,
    value: t.value,
    capabilities: t.capabilities,
    process: t.process,
    faq: t.faq,
  };
}
