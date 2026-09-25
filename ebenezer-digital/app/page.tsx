import type { Metadata } from "next";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import Contact from "./sections/Contact";
import { pageMetadata } from "@/lib/site-url";
import { resolveRequestLocale } from "@/lib/i18n/request-locale";
import { loadMessages } from "@/lib/i18n/load-messages";
import { SERVICE_LANDINGS } from "@/lib/services-catalog";
import { getLocalizedService } from "@/lib/i18n/localize-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = resolveRequestLocale();
  const messages = loadMessages(locale);
  return pageMetadata({
    title: messages.home.metaTitle,
    description: messages.home.metaDescription,
    path: "/",
  });
}

export default function Home() {
  const locale = resolveRequestLocale();
  const messages = loadMessages(locale);
  const featuredServices = SERVICE_LANDINGS.slice(0, 4).map(
    (s) => getLocalizedService(s.slug, locale)!
  );

  return (
    <main className="min-h-screen bg-[#070708]">
      <Hero home={messages.home} />
      <Services featuredServices={featuredServices} sectionsLabel={messages.sections.services} />
      <Portfolio />
      <Contact />
    </main>
  );
}
