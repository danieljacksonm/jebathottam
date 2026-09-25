import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedDestinations } from "@/data/destinations";
import { destinationCardImage } from "@/data/image-registry";
import { formatInr, getPackageRows } from "@/data/packages";

const PACKAGE_DESTINATION_PRIORITY = ["kodaikanal", "darjeeling"];

export async function FeaturedDestinations() {
  const t = await getTranslations("platform");
  const locale = await getLocale();
  const [raw, packageRows] = await Promise.all([
    getFeaturedDestinations(locale, 12),
    getPackageRows(),
  ]);
  const withPackages = new Set(packageRows.map((p) => p.destinationSlug));

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
    .slice(0, 6);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
          {t("availableNow")}
        </p>
        <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
          {t("featuredDestinations")}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((dest) => {
            const hasPrice =
              typeof dest.priceFrom === "number" && dest.priceFrom > 0;
            const hasPackages = withPackages.has(dest.slug);
            const card = destinationCardImage(dest.slug, dest.image);
            return (
              <article key={dest.slug} className="overflow-hidden border border-[var(--line)] bg-[#04101f]/40">
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={card.src}
                      alt={card.alt || dest.name}
                      fill
                      quality={75}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={card.src.startsWith("http")}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                      {dest.status === "coming_soon"
                        ? t("comingSoon")
                        : hasPackages
                          ? t("packagesAvailable", { country: dest.country })
                          : `${dest.country} · ${dest.continent}`}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-white">
                      {dest.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                      {dest.tagline}
                    </p>
                    <p className="mt-auto pt-6 text-sm text-gold-bright">
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
        <div className="mt-10 text-center">
          <Link href="/destinations" className="btn-ghost">
            {t("viewAllDestinations")}
          </Link>
        </div>
      </div>
    </section>
  );
}
