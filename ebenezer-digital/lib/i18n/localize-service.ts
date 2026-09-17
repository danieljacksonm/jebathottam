import type { ServiceLanding } from "@/lib/services-catalog";
import { getServiceLanding } from "@/lib/services-catalog";
import type { SeoLocale } from "@/lib/site-url";
import { loadMessages } from "./load-messages";

/** Return service landing with translated fields when a locale bundle exists. */
export function getLocalizedService(slug: string, locale: SeoLocale): ServiceLanding | undefined {
  const base = getServiceLanding(slug);
  if (!base) return undefined;
  if (locale === "en") return base;

  const messages = loadMessages(locale);
  const t = messages.services[slug];
  if (!t) return base;

  return {
    ...base,
    title: t.title || base.title,
    forWho: t.forWho || base.forWho,
    value: t.value || base.value,
    capabilities: t.capabilities?.length ? t.capabilities : base.capabilities,
    process: t.process?.length ? t.process : base.process,
    faq: t.faq?.length ? t.faq : base.faq,
  };
}
