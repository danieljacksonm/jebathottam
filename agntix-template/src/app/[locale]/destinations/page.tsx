import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getContinents, getDestinationsByContinent } from "@/data/destinations";
import { formatInr } from "@/data/packages";
import { pageMetadata } from "@/lib/seo";

const HERO = "/images/kodai/hero.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/destinations",
    title: t("destinationsTitle"),
    description: t("destinationsDescription"),
    image: HERO,
    imageAlt: "Worldwide destinations with Canaan Travel Hub",
  });
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seo");
  const nav = await getTranslations("nav");
  const pkgT = await getTranslations("packages");
  const continents = await getContinents();

  const grouped = await Promise.all(
    continents.map(async (continent) => ({
      continent,
      destinations: await getDestinationsByContinent(continent, locale),
    })),
  );

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={nav("destinations")}
        title={t("destinationsTitle")}
        subtitle={t("destinationsDescription")}
        image={HERO}
        imageAlt="Worldwide travel destinations"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations") },
        ]}
      />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {grouped.map(({ continent, destinations }) => (
          <section key={continent} className="mb-16 last:mb-0">
            <h2 className="font-display text-3xl text-cream">{continent}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <article key={dest.slug} className="lux-card overflow-hidden">
                  <Link href={`/destinations/${dest.slug}`} className="block">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {dest.featured ? (
                        <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <div className="p-6">
                      <p className="text-[0.65rem] uppercase tracking-[0.14em] text-gold">
                        {dest.country}
                        {dest.status === "coming_soon"
                          ? " · Coming soon"
                          : dest.status === "enquiry"
                            ? " · Enquire"
                            : ""}
                      </p>
                      <h3 className="mt-2 font-display text-2xl text-white">
                        {dest.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                        {dest.tagline}
                      </p>
                      {dest.priceFrom ? (
                        <p className="mt-4 text-gold-bright">
                          {pkgT("from")} {formatInr(dest.priceFrom)}{" "}
                          {pkgT("perPerson")}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageAtmosphere>
  );
}
