import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  destinationCopy,
  getPublishedDestinations,
} from "@/data/destinations";
import { formatInr } from "@/data/packages";
import { pageMetadata } from "@/lib/seo";

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
    image: "/images/darjeeling/hero/darjeeling-hero.jpg",
    imageAlt: "Canaan Travel Hub destinations",
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
  const platform = await getTranslations("platform");
  const loc = (await getLocale()) as "en" | "ta" | "hi";
  const list = getPublishedDestinations();

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={nav("destinations")}
        title={t("destinationsTitle")}
        subtitle={t("destinationsDescription")}
        image="/images/darjeeling/hero/darjeeling-hero.jpg"
        imageAlt="Hill destination for Canaan travellers"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations") },
        ]}
      />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((dest) => {
            const copy = destinationCopy[dest.slug];
            const hasPrice =
              typeof dest.priceFrom === "number" && dest.priceFrom > 0;
            return (
              <article key={dest.slug} className="lux-card overflow-hidden">
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={dest.image}
                      alt={copy.name[loc] ?? copy.name.en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
                      {dest.status === "coming_soon"
                        ? platform("comingSoon")
                        : dest.country}
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-white">
                      {copy.name[loc] ?? copy.name.en}
                    </h2>
                    <p className="mt-4 text-soft-gray">
                      {copy.tagline[loc] ?? copy.tagline.en}
                    </p>
                    <p className="mt-6 text-sm text-gold-bright">
                      {hasPrice
                        ? `${platform("from")} ${formatInr(dest.priceFrom!)} ${platform("perPerson")} →`
                        : `${platform("requestEnquiry")} →`}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </PageAtmosphere>
  );
}
