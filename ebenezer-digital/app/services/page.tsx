import { resolveRequestLocale } from "@/lib/i18n/request-locale";
import { loadMessages } from "@/lib/i18n/load-messages";
import { SERVICE_LANDINGS } from "@/lib/services-catalog";
import { getLocalizedService } from "@/lib/i18n/localize-service";
import ServicesPageClient from "./ServicesPageClient";

export default function ServicesPage() {
  const locale = resolveRequestLocale();
  const messages = loadMessages(locale);
  const services = SERVICE_LANDINGS.map((s) => getLocalizedService(s.slug, locale)!);

  return (
    <ServicesPageClient
      services={services}
      sections={messages.sections}
      studio={messages.studio}
    />
  );
}
