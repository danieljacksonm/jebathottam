import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatInr,
  formatPackagePrice,
  getLocalizedPackageAsync,
  getPackageRows,
  isEnquiryPriced,
  LEGACY_PACKAGE_REDIRECTS,
} from "@/data/packages";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, packageJsonLd, pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const rows = await getPackageRows();
  const live = rows.map((pkg) => ({ id: pkg.id }));
  const legacy = Object.keys(LEGACY_PACKAGE_REDIRECTS).map((id) => ({ id }));
  return [...live, ...legacy];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const resolved = LEGACY_PACKAGE_REDIRECTS[id] ?? id;
  const pkg = await getLocalizedPackageAsync(resolved, locale);
  if (!pkg) return {};
  return pageMetadata({
    locale,
    path: `/packages/${pkg.id}`,
    title: pkg.title,
    description: pkg.blurb,
    image: pkg.image,
    imageAlt: pkg.title,
  });
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--line)] py-3 last:border-0">
      <dt className="text-[0.62rem] uppercase tracking-[0.16em] text-mist/60">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white/85">{value}</dd>
    </div>
  );
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const legacyTarget = LEGACY_PACKAGE_REDIRECTS[id];
  if (legacyTarget) {
    permanentRedirect(`/${locale}/packages/${legacyTarget}`);
  }

  const loc = await getLocale();
  const pkg = await getLocalizedPackageAsync(id, loc);
  if (!pkg) notFound();

  const t = await getTranslations("packages");
  const nav = await getTranslations("nav");
  const d = pkg.details;
  const wa = whatsappUrl({ type: "package", packageName: pkg.title });

  const faqLd =
    d.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: d.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <PageAtmosphere>
      <JsonLd
        data={packageJsonLd({
          name: pkg.title,
          description: pkg.blurb,
          image: pkg.image,
          priceFrom: isEnquiryPriced(pkg) ? null : pkg.priceFrom,
          url: absoluteUrl(locale, `/packages/${pkg.id}`),
        })}
      />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <CinematicPageHero
        eyebrow={`${pkg.days} Days · ${pkg.nights} Night${pkg.nights === 1 ? "" : "s"}`}
        title={pkg.title}
        subtitle={pkg.tagline ?? pkg.blurb}
        image={pkg.image}
        imageAlt={pkg.title}
        tone="forest"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("packages"), href: "/packages" },
          { name: pkg.title },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.35fr_0.75fr] md:px-8 md:py-24">
        <div className="space-y-14">
          <div>
            <p className="text-lg leading-relaxed text-soft-gray md:text-xl">
              {pkg.body}
            </p>
            <ul className="mt-8 space-y-3">
              {pkg.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {pkg.tiers.length > 0 ? (
            <div>
              <h2 className="font-display text-3xl text-cream">{t("tiersTitle")}</h2>
              <p className="mt-2 text-sm text-mist/80">{t("tiersSubtitle")}</p>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {pkg.tiers.map((tier) => (
                  <article
                    key={tier.id}
                    className="relative flex flex-col rounded-2xl border border-[var(--line)] bg-navy-mid/30 p-5"
                  >
                    {tier.bestValue ? (
                      <span className="absolute -top-2.5 right-4 rounded-full bg-[#c41e24] px-2.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white">
                        {t("bestValue")}
                      </span>
                    ) : null}
                    <h3 className="font-display text-xl text-gold-bright">
                      {tier.label}
                    </h3>
                    <p className="mt-2 text-sm text-white/80">{tier.roomType}</p>
                    <ul className="mt-4 flex-1 space-y-1.5 text-xs text-mist/80">
                      {pkg.sharedInclusions.map((inc) => (
                        <li key={inc} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 font-display text-3xl text-cream">
                      {formatInr(tier.pricePerPerson)}
                    </p>
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist/60">
                      {t("perPerson")}
                    </p>
                    <Link
                      href={`/enquire?package=${pkg.id}&tier=${tier.id}&travelers=${tier.pax}`}
                      className="btn-gold mt-5 w-full !py-2.5 text-[0.65rem]"
                    >
                      {t("requestTier")}
                    </Link>
                  </article>
                ))}
              </div>
              {pkg.groupNote ? (
                <p className="mt-6 rounded-2xl border border-gold/35 px-5 py-4 text-sm text-gold-bright">
                  ★ {pkg.groupNote}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <h2 className="font-display text-3xl text-cream">{t("quickFacts")}</h2>
            <dl className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-8">
              <Fact
                label={t("duration")}
                value={t("durationValue", {
                  days: pkg.days,
                  nights: pkg.nights,
                })}
              />
              <Fact label={t("startingLocation")} value={d.startingLocation} />
              <Fact label={t("destination")} value={d.destination} />
              <Fact label={t("bestFor")} value={d.suitableFor} />
              <Fact label={t("hotelCategory")} value={d.hotelCategory} />
              <Fact label={t("transport")} value={d.transportSummary} />
              <Fact label={t("meals")} value={d.mealPlan} />
            </dl>
          </div>

          <div>
            <h2 className="font-display text-3xl text-cream">{t("itinerary")}</h2>
            <div className="mt-8 space-y-8">
              {d.itinerary.map((day) => (
                <article
                  key={day.day}
                  className="border-l border-gold/40 pl-5 md:pl-6"
                >
                  <h3 className="font-display text-xl text-gold-bright">
                    {t("dayLabel", { day: day.day })} — {day.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {day.parts.map((part) => (
                      <li key={part.label} className="text-sm text-white/80">
                        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-mist/60">
                          {part.label}
                        </span>
                        <p className="mt-1 leading-relaxed">{part.detail}</p>
                      </li>
                    ))}
                  </ul>
                  {day.overnight ? (
                    <p className="mt-4 text-sm text-mist/80">
                      <span className="text-gold">{t("overnight")}: </span>
                      {day.overnight}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-cream">{t("included")}</h2>
              <ul className="mt-4 space-y-2.5">
                {d.inclusions.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl text-cream">{t("notIncluded")}</h2>
              <ul className="mt-4 space-y-2.5">
                {d.exclusions.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl text-cream">{t("accommodation")}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-soft-gray">
              {d.accommodationNote}
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-cream">{t("transportTitle")}</h2>
            <ul className="mt-4 space-y-2.5">
              {d.transportDetails.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-cream">{t("pricingTitle")}</h2>
            <p className="mt-3 font-display text-3xl text-gold-bright">
              {isEnquiryPriced(pkg)
                ? t("requestQuote")
                : t("startingFrom", { price: formatInr(pkg.priceFrom) })}
            </p>
            <ul className="mt-4 space-y-2.5">
              {d.pricingAssumptions.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/75">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-cream">{t("cancellation")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                {d.cancellationPolicy}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-cream">{t("payment")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                {d.paymentTerms}
              </p>
            </div>
          </div>

          {d.faqs.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl text-cream">{t("packageFaq")}</h2>
              <div className="mt-6 space-y-5">
                {d.faqs.map((f) => (
                  <div key={f.question}>
                    <h3 className="text-base text-cream">{f.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="h-fit space-y-4 md:sticky md:top-28">
          <div className="rounded-3xl border border-[var(--line)] bg-navy-mid/40 p-7">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-mist">
              {isEnquiryPriced(pkg) ? t("pricing") : t("from")}
            </p>
            <p className="font-display text-4xl text-gold-bright">
              {formatPackagePrice(pkg, t("requestQuote"))}
            </p>
            {!isEnquiryPriced(pkg) ? (
              <>
                <p className="text-sm text-mist">{t("perPerson")}</p>
                <p className="mt-2 text-xs text-mist/70">{t("fromNote")}</p>
              </>
            ) : (
              <p className="mt-2 text-xs text-mist/70">{t("enquireNote")}</p>
            )}
            <p className="mt-4 text-sm text-white/70">{d.suitableFor}</p>
            <Link
              href={`/enquire?package=${pkg.id}`}
              className="btn-gold mt-7 w-full"
            >
              {t("detailCta")}
            </Link>
            <Link
              href="/plan-your-trip"
              className="btn-ghost mt-3 w-full !border-[var(--line)]"
            >
              {t("customTrip")}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-gold/40 px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-gold-bright transition hover:bg-gold/10"
            >
              {t("whatsappCta")}
            </a>
            <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          </div>
        </aside>
      </section>
    </PageAtmosphere>
  );
}
