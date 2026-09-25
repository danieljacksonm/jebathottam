"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  formatPackagePrice,
  getLocalizedPackages,
  isEnquiryPriced,
  type LocalizedPackage,
} from "@/data/packages";
import { useReveal } from "./motion";
import { TiltCard } from "./TiltCard";
import { MagneticCta } from "./MagneticCta";

const DESTINATION_ORDER = [
  "kodaikanal",
  "darjeeling",
  "goa",
  "ooty",
  "madurai",
  "delhi",
  "bali",
] as const;

function destinationLabel(slug: string, locale: string, fallback: string) {
  const labels: Record<string, Record<string, string>> = {
    kodaikanal: { en: "Kodaikanal", ta: "கொடைக்கானல்", hi: "कोडाइकनाल" },
    darjeeling: { en: "Darjeeling", ta: "டார்ஜீலிங்", hi: "दार्जिलिंग" },
    goa: { en: "Goa", ta: "கோவா", hi: "गोवा" },
    ooty: { en: "Ooty", ta: "ஊட்டி", hi: "ऊटी" },
    madurai: { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
    delhi: { en: "Delhi", ta: "டெல்லி", hi: "दिल्ली" },
    bali: { en: "Bali", ta: "பாலி", hi: "बाली" },
  };
  return labels[slug]?.[locale] ?? labels[slug]?.en ?? fallback;
}

function groupByDestination(list: LocalizedPackage[]) {
  const map = new Map<string, LocalizedPackage[]>();
  for (const pkg of list) {
    const bucket = map.get(pkg.destinationSlug) ?? [];
    bucket.push(pkg);
    map.set(pkg.destinationSlug, bucket);
  }

  const ordered: { slug: string; packages: LocalizedPackage[] }[] = [];
  for (const slug of DESTINATION_ORDER) {
    const packages = map.get(slug);
    if (packages?.length) {
      ordered.push({ slug, packages });
      map.delete(slug);
    }
  }
  for (const [slug, packages] of map) {
    ordered.push({ slug, packages });
  }
  return ordered;
}

export function LuxuryPackages({
  hideIntro = false,
  featuredOnly = false,
  packages: packagesProp,
}: {
  hideIntro?: boolean;
  featuredOnly?: boolean;
  packages?: LocalizedPackage[];
}) {
  const locale = useLocale();
  const t = useTranslations("packages");
  const j = useTranslations("journey");
  const ref = useReveal([]);
  const list = (packagesProp ?? getLocalizedPackages(locale)).filter((pkg) =>
    featuredOnly ? pkg.featured : true,
  );
  const groups = groupByDestination(list);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad relative overflow-hidden bg-navy-mid"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,166,74,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        {!hideIntro && (
          <div data-reveal className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
              {t("luxuryEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
              {j("packagesLead")}
            </h2>
            <p className="mt-3 font-display text-3xl text-gold-bright md:text-4xl">
              {j("packagesLead2")}
            </p>
            <p className="mt-5 text-soft-gray">{t("luxuryBody")}</p>
          </div>
        )}

        <div className={hideIntro ? "space-y-16" : "mt-14 space-y-16"}>
          {groups.map((group) => (
            <div key={group.slug} id={`dest-${group.slug}`}>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold/80">
                    {t("destination")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-cream md:text-4xl">
                    {destinationLabel(
                      group.slug,
                      locale,
                      group.packages[0]?.details.destination ?? group.slug,
                    )}
                  </h3>
                </div>
                <Link
                  href={`/destinations/${group.slug}`}
                  className="text-sm text-gold hover:text-gold-bright"
                >
                  {t("exploreDestination")}
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.packages.map((pkg) => (
                  <TiltCard key={pkg.id}>
                    <article
                      data-reveal
                      className="lux-card group"
                      data-cursor="view"
                    >
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="relative block aspect-[16/11] overflow-hidden"
                      >
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                      </Link>
                      <div className="p-6">
                        <h4 className="font-display text-3xl text-white">
                          {pkg.title}
                        </h4>
                        <p className="mt-2 text-sm text-mist">
                          {t("days", { count: pkg.days })} ·{" "}
                          {t("nights", { count: pkg.nights })}
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-soft-gray">
                          {pkg.blurb}
                        </p>
                        <div className="mt-6 flex items-end justify-between border-t border-[var(--line)] pt-5">
                          <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist">
                              {isEnquiryPriced(pkg) ? t("pricing") : t("from")}
                            </p>
                            <p className="font-display text-2xl text-gold-bright md:text-3xl">
                              {formatPackagePrice(pkg, t("requestQuote"))}
                            </p>
                          </div>
                          <Link
                            href={`/enquire?package=${pkg.id}`}
                            className="btn-ghost !px-4 !py-2.5 text-[0.65rem]"
                            data-cursor="book"
                          >
                            {t("enquire")}
                          </Link>
                        </div>
                      </div>
                    </article>
                  </TiltCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12 flex justify-center">
          <MagneticCta href="/enquire" className="btn-gold">
            {j("ctaButton")}
            <span data-mag-arrow>→</span>
          </MagneticCta>
        </div>
      </div>
    </section>
  );
}
