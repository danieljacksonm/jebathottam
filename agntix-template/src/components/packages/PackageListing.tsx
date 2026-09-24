import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatInr,
  getLocalizedPackages,
  type LocalizedPackage,
} from "@/data/packages";

const DESTINATION_ORDER = ["kodaikanal", "darjeeling"] as const;

function destinationLabel(slug: string, locale: string, fallback: string) {
  const labels: Record<string, Record<string, string>> = {
    kodaikanal: { en: "Kodaikanal", ta: "கொடைக்கானல்", hi: "कोडाइकनाल" },
    darjeeling: { en: "Darjeeling", ta: "டார்ஜீலிங்", hi: "दार्जिलिंग" },
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

/** Server-rendered package listing — no TiltCard / MagneticCta / GSAP. */
export async function PackageListing({ hideIntro = false }: { hideIntro?: boolean }) {
  const locale = await getLocale();
  const t = await getTranslations("packages");
  const j = await getTranslations("journey");
  const platform = await getTranslations("platform");
  const list = getLocalizedPackages(locale);
  const groups = groupByDestination(list);

  return (
    <section className="section-pad relative overflow-hidden bg-navy-mid">
      <div className="relative mx-auto max-w-7xl">
        {!hideIntro && (
          <div className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
              {t("luxuryEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
              {j("packagesLead")}
            </h2>
            <p className="mt-3 font-display text-2xl text-gold-bright md:text-3xl">
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
                    Destination
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
                  {platform("exploreDestination")} →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.packages.map((pkg) => (
                  <article key={pkg.id} className="lux-card group overflow-hidden">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="relative block aspect-[16/11] overflow-hidden"
                    >
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                    </Link>
                    <div className="p-6">
                      <h4 className="font-display text-2xl text-white md:text-3xl">
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
                            {t("from")}
                          </p>
                          <p className="font-display text-3xl text-gold-bright">
                            {formatInr(pkg.priceFrom)}
                          </p>
                        </div>
                        <Link
                          href={`/enquire?package=${pkg.id}`}
                          className="btn-ghost !px-4 !py-2.5 text-[0.65rem]"
                        >
                          {t("enquire")}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/enquire" className="btn-gold">
            {j("ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
