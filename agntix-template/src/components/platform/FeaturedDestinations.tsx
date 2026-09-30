import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedDestinations } from "@/data/destinations";
import { destinationCardImage } from "@/data/image-registry";
import { formatInr, getPublishedDestinationSlugs } from "@/data/packages";
import { FeaturedDestinationsMotion } from "@/components/platform/FeaturedDestinationsMotion";

const PACKAGE_DESTINATION_PRIORITY = ["kodaikanal", "darjeeling"];

export async function FeaturedDestinations() {
  const t = await getTranslations("platform");
  const locale = await getLocale();
  const [raw, withPackages] = await Promise.all([
    getFeaturedDestinations(locale, 12),
    getPublishedDestinationSlugs(),
  ]);

  const list = [...raw]
    .sort((a, b) => {
      const ai = PACKAGE_DESTINATION_PRIORITY.indexOf(a.slug);
      const bi = PACKAGE_DESTINATION_PRIORITY.indexOf(b.slug);
      const aRank = ai === -1 ? 100 : ai;
      const bRank = bi === -1 ? 100 : bi;
      if (aRank !== bRank) return aRank - bRank;
      const aPkg = withPackages.has(a.slug) ? 0 : 1;
      const bPkg = withPackages.has(b.slug) ? 0 : 1;
      return aPkg - bPkg;
    })
    .slice(0, 5);

  const [lead, ...rest] = list;
  if (!lead) return null;

  const leadCard = destinationCardImage(lead.slug, lead.image);
  const leadHasPackages = withPackages.has(lead.slug);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
          {t("availableNow")}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl text-cream md:text-5xl">
          {t("featuredDestinations")}
        </h2>
        <p className="mt-4 max-w-xl text-soft-gray">{t("destinationsIntro")}</p>

        <FeaturedDestinationsMotion>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <article
              data-reveal
              className="group relative min-h-[28rem] overflow-hidden border border-[var(--line)] md:min-h-[36rem]"
            >
              <Link
                href={`/destinations/${lead.slug}`}
                className="absolute inset-0 block"
                data-cursor="view"
              >
                <Image
                  src={leadCard.src}
                  alt={leadCard.alt || lead.name}
                  fill
                  quality={85}
                  className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized={leadCard.src.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                    {lead.status === "coming_soon"
                      ? t("comingSoon")
                      : leadHasPackages
                        ? t("packagesAvailable", { country: lead.country })
                        : `${lead.country} · ${lead.continent}`}
                  </p>
                  <h3 className="mt-3 font-display text-4xl text-white md:text-5xl">
                    {lead.name}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
                    {lead.tagline}
                  </p>
                  <p className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-gold-bright">
                    {t("exploreDestination")} →
                  </p>
                </div>
              </Link>
            </article>

            <div className="flex flex-col gap-6">
              {rest.map((dest) => {
                const card = destinationCardImage(dest.slug, dest.image);
                const hasPackages = withPackages.has(dest.slug);
                const hasPrice =
                  typeof dest.priceFrom === "number" && dest.priceFrom > 0;
                return (
                  <article
                    key={dest.slug}
                    data-reveal
                    className="group grid min-h-[9.5rem] grid-cols-[7.5rem_1fr] overflow-hidden border border-[var(--line)] bg-[#04101f]/35 transition-[border-color] duration-[var(--dur-fast)] hover:border-gold/35 md:grid-cols-[9rem_1fr]"
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="contents"
                      data-cursor="view"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={card.src}
                          alt={card.alt || dest.name}
                          fill
                          quality={75}
                          className="object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.05]"
                          sizes="120px"
                          unoptimized={card.src.startsWith("http")}
                        />
                      </div>
                      <div className="flex flex-col justify-center p-4 md:p-5">
                        <p className="text-[0.58rem] uppercase tracking-[0.14em] text-mist">
                          {dest.status === "coming_soon"
                            ? t("comingSoon")
                            : hasPackages
                              ? t("packagesAvailable", { country: dest.country })
                              : dest.country}
                        </p>
                        <h3 className="mt-1 font-display text-2xl text-white group-hover:text-gold-bright md:text-3xl">
                          {dest.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-soft-gray">
                          {dest.tagline}
                        </p>
                        <p className="mt-2 text-xs text-gold-bright">
                          {hasPrice
                            ? `${t("from")} ${formatInr(dest.priceFrom!)} ${t("perPerson")}`
                            : t("requestEnquiry")}
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </FeaturedDestinationsMotion>

        <div className="mt-10 text-center">
          <Link href="/destinations" className="btn-ghost">
            {t("viewAllDestinations")}
          </Link>
        </div>
      </div>
    </section>
  );
}
