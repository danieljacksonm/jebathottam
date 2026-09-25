import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { pageMetadata } from "@/lib/site-url";
import { SERVICE_LANDINGS } from "@/lib/services-catalog";
import { getLocalizedService } from "@/lib/i18n/localize-service";
import { loadMessages } from "@/lib/i18n/load-messages";
import type { SeoLocale } from "@/lib/site-url";
import { SITE_NAV } from "@/lib/site-nav";
import { ecosystemLinksForTopic } from "@/lib/internal-links";

function requestLocale(): SeoLocale {
  return (headers().get("x-eben-locale") || "en").toLowerCase() as SeoLocale;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const locale = requestLocale();
  const service = getLocalizedService(params.slug, locale);
  if (!service) return { title: "Service | Ebenezer Digital", robots: { index: false } };
  return pageMetadata({
    title: `${service.title} | Ebenezer Digital`,
    description: service.value,
    path: `/services/${service.slug}`,
  });
}

export function generateStaticParams() {
  return SERVICE_LANDINGS.map((s) => ({ slug: s.slug }));
}

export default function ServiceLandingPage({ params }: { params: { slug: string } }) {
  const locale = requestLocale();
  const labels = loadMessages(locale).sections;
  const service = getLocalizedService(params.slug, locale);

  if (!service) {
    return (
      <main className="bg-[#070708] px-4 py-28">
        <p className="text-[var(--st-muted)]">{labels.serviceNotFound}</p>
        <Link href="/services" className="mt-4 inline-block underline">
          {labels.allServices}
        </Link>
      </main>
    );
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.value,
    provider: { "@type": "Organization", name: "Ebenezer Digital", url: SITE_NAV.home },
    areaServed: "Worldwide",
    inLanguage: locale,
  };

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <p className="studio-kicker">{labels.services}</p>
      <h1 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">{service.title.toUpperCase()}.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">{service.value}</p>
      <p className="mt-4 max-w-2xl text-sm text-white/45">
        {labels.whoItIsFor}: {service.forWho}
      </p>

      <section className="mt-16 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">{labels.whatWeDeliver}</h2>
        <ul className="mt-6 space-y-3 text-[var(--st-muted)]">
          {service.capabilities.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">{labels.howWeWork}</h2>
        <ol className="mt-6 space-y-3 text-[var(--st-muted)]">
          {service.process.map((step, i) => (
            <li key={step}>
              <span className="text-emerald-400">{String(i + 1).padStart(2, "0")}</span> {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">{labels.technology}</h2>
        <p className="mt-4 text-[var(--st-muted)]">{service.tech.join(" · ")}</p>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">{labels.faq}</h2>
        <div className="mt-8 max-w-2xl space-y-8">
          {service.faq.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg text-white">{f.q}</h3>
              <p className="mt-2 text-[var(--st-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">{labels.relatedLinks}</h2>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {ecosystemLinksForTopic(`${service.title} ${service.value} ${service.forWho}`).map((link) => (
            <Link key={link.href} href={link.href} className="underline hover:text-white">
              {link.label}
            </Link>
          ))}
          {service.relatedInsights?.map((slug) => (
            <Link key={slug} href={`/insights/${slug}`} className="underline hover:text-white">
              Insight: {slug.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-4 text-sm">
        <Link href="/work" className="underline hover:text-white">
          Selected work
        </Link>
        <Link href="/contact" className="rounded-full border border-emerald-500/40 px-5 py-2 text-emerald-400 hover:bg-emerald-500/10">
          {labels.contactUs}
        </Link>
        <Link href="/services" className="underline hover:text-white">
          {labels.allServices}
        </Link>
      </div>
    </main>
  );
}
