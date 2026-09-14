import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  destinationCopy,
  getDestination,
  getPublishedDestinations,
  packagesForDestination,
  type DestinationSlug,
} from "@/data/destinations";
import {
  formatInr,
  localizePackage,
} from "@/data/packages";
import { DARJEELING_MEDIA } from "@/lib/media-registry";
import { pageMetadata } from "@/lib/seo";
import KodaikanalPage from "../../kodaikanal/page";

export function generateStaticParams() {
  return getPublishedDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return {};
  const t = await getTranslations({ locale, namespace: "seo" });
  const copy = destinationCopy[dest.slug];

  if (slug === "kodaikanal") {
    return pageMetadata({
      locale,
      path: "/destinations/kodaikanal",
      title: t("kodaiTitle"),
      description: t("kodaiDescription"),
      image: dest.image,
      imageAlt: copy.name.en,
    });
  }

  return pageMetadata({
    locale,
    path: `/destinations/${slug}`,
    title: t("darjeelingTitle"),
    description: t("darjeelingDescription"),
    image: dest.image,
    imageAlt: copy.name.en,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  const dest = getDestination(resolved.slug);
  if (!dest) notFound();

  if (resolved.slug === "kodaikanal") {
    return KodaikanalPage({
      params: Promise.resolve({ locale: resolved.locale }),
    });
  }

  setRequestLocale(resolved.locale);
  const locale = (await getLocale()) as "en" | "ta" | "hi";
  const nav = await getTranslations("nav");
  const platform = await getTranslations("platform");
  const copy = destinationCopy[dest.slug as DestinationSlug];
  const packages = packagesForDestination(dest.slug).map((row) =>
    localizePackage(row, locale),
  );
  const gallery = [
    DARJEELING_MEDIA.g1,
    DARJEELING_MEDIA.g2,
    DARJEELING_MEDIA.g3,
    DARJEELING_MEDIA.g4,
    DARJEELING_MEDIA.g5,
  ];

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={dest.country}
        title={copy.name[locale] ?? copy.name.en}
        subtitle={copy.tagline[locale] ?? copy.tagline.en}
        image={dest.image}
        imageAlt={copy.name.en}
        tone="mist"
      />
      <Breadcrumbs
        locale={resolved.locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations"), href: "/destinations" },
          { name: copy.name[locale] ?? copy.name.en },
        ]}
      />

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <p className="text-base leading-relaxed text-soft-gray md:text-lg">
          {copy.body[locale] ?? copy.body.en}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/plan-your-trip?destination=darjeeling" className="btn-gold">
            Plan this trip
          </Link>
          <Link href="/packages" className="btn-ghost">
            View packages
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <h2 className="font-display text-3xl text-cream">Available packages</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <article key={pkg.id} className="lux-card overflow-hidden">
              <Link href={`/packages/${pkg.id}`} className="block">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-white">{pkg.title}</h3>
                  <p className="mt-3 text-sm text-soft-gray">{pkg.blurb}</p>
                  <p className="mt-4 text-gold-bright">
                    {platform("from")} {formatInr(pkg.priceFrom)}{" "}
                    {platform("perPerson")}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <h2 className="font-display text-3xl text-cream">Gallery</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {gallery.map((item) => (
            <div key={item.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>
    </PageAtmosphere>
  );
}
