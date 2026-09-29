import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  getDestination,
  getDestinationSlugs,
  getPlacesForDestination,
} from "@/data/destinations";
import { getBlogCount, getLocalizedBlogs } from "@/data/blog";
import {
  formatInr,
  formatPackagePrice,
  getPackagesForDestinationAsync,
  isEnquiryPriced,
} from "@/data/packages";
import { destinationHero } from "@/data/image-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, destinationJsonLd, pageMetadata } from "@/lib/seo";
import KodaikanalPage from "../../kodaikanal/page";

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dest = await getDestination(slug, locale);
  if (!dest) return {};
  return pageMetadata({
    locale,
    path: `/destinations/${slug}`,
    title: `${dest.name} Travel Guide | Canaan Travel Hub`,
    description: dest.body,
    image: dest.image,
    imageAlt: dest.name,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  if (resolved.slug === "kodaikanal") {
    return KodaikanalPage({
      params: Promise.resolve({ locale: resolved.locale }),
    });
  }

  setRequestLocale(resolved.locale);
  const locale = await getLocale();
  const dest = await getDestination(resolved.slug, locale);
  if (!dest) notFound();

  const nav = await getTranslations("nav");
  const t = await getTranslations("destinationPage");
  const blogT = await getTranslations("blog");
  const places = await getPlacesForDestination(dest.id, locale);
  const packages = await getPackagesForDestinationAsync(resolved.slug, locale);
  const blogPosts = await getLocalizedBlogs(locale, {
    destination: resolved.slug,
    take: 3,
  });
  const blogCount = await getBlogCount({ destination: resolved.slug });
  const hero = destinationHero(resolved.slug);
  const heroSrc = dest.image?.startsWith("/") ? dest.image : hero.src;

  const leadPlaces = places.slice(0, 1);
  const morePlaces = places.slice(1, 7);
  const statusLabel =
    dest.status === "coming_soon"
      ? t("comingSoon")
      : dest.status === "enquiry"
        ? t("customPlanning")
        : dest.country;

  return (
    <PageAtmosphere>
      <JsonLd
        data={destinationJsonLd({
          name: dest.name,
          description: dest.body,
          image: dest.image,
          url: absoluteUrl(resolved.locale, `/destinations/${resolved.slug}`),
          country: dest.country,
        })}
      />
      <CinematicPageHero
        eyebrow={statusLabel}
        title={dest.name}
        subtitle={dest.tagline}
        image={heroSrc}
        imageAlt={dest.name}
        tone="mist"
      />
      <Breadcrumbs
        locale={resolved.locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations"), href: "/destinations" },
          { name: dest.name },
        ]}
      />

      {/* Editorial intro + quick facts */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_0.8fr] md:px-8 md:py-20">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("overview")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
            {t("whyVisit", { name: dest.name })}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-soft-gray md:text-lg">
            {dest.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/plan-your-trip?destination=${dest.slug}`}
              className="btn-gold"
            >
              {t("planThisTrip")}
            </Link>
            {packages.length > 0 ? (
              <Link href="/packages" className="btn-ghost">
                {t("viewPackages")}
              </Link>
            ) : (
              <Link href={`/enquire?destination=${dest.slug}&source=destination`} className="btn-ghost">
                {t("enquire")}
              </Link>
            )}
          </div>
        </div>
        <aside className="border border-[var(--line)] bg-[#04101f]/50 p-6 md:p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            {t("quickFacts")}
          </p>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-mist/70">{t("region")}</dt>
              <dd className="mt-1 text-cream">
                {dest.region || dest.country} · {dest.continent}
              </dd>
            </div>
            <div>
              <dt className="text-mist/70">{t("travelStyle")}</dt>
              <dd className="mt-1 text-cream">{t("travelStyleValue")}</dd>
            </div>
            {dest.priceFrom ? (
              <div>
                <dt className="text-mist/70">{t("from")}</dt>
                <dd className="mt-1 text-gold-bright">
                  {formatInr(dest.priceFrom)} {t("perPerson")}
                </dd>
              </div>
            ) : (
              <div>
                <dt className="text-mist/70">{t("planning")}</dt>
                <dd className="mt-1 text-cream">{t("enquiryBased")}</dd>
              </div>
            )}
          </dl>
        </aside>
      </section>

      {/* Featured place — magazine lead */}
      {leadPlaces[0] ? (
        <section className="border-y border-[var(--line)] bg-[#04101f]/40">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
            <div className="relative min-h-[22rem] lg:min-h-[32rem]">
              {leadPlaces[0].image ? (
                <Image
                  src={leadPlaces[0].image}
                  alt={leadPlaces[0].name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : null}
            </div>
            <div className="flex flex-col justify-center px-5 py-12 md:px-10 md:py-16">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
                {t("placesToVisit")}
              </p>
              <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
                {leadPlaces[0].name}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-soft-gray">
                {leadPlaces[0].summary || leadPlaces[0].detail}
              </p>
              <Link
                href={`/destinations/${dest.slug}/places/${leadPlaces[0].slug}`}
                className="mt-8 text-[0.68rem] uppercase tracking-[0.16em] text-gold-bright"
              >
                {t("explorePlace")} →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {morePlaces.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            {t("morePlaces")}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {morePlaces.map((place) => (
              <article key={place.slug} className="group overflow-hidden border border-[var(--line)]">
                <Link
                  href={`/destinations/${dest.slug}/places/${place.slug}`}
                  className="block"
                  data-cursor="view"
                >
                  {place.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-white group-hover:text-gold-bright">
                      {place.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-soft-gray">
                      {place.summary}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {packages.length > 0 ? (
        <section className="border-t border-[var(--line)] bg-[#04101f]/60 px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
                  {t("packagesEyebrow")}
                </p>
                <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
                  {t("packagesTitle", { name: dest.name })}
                </h2>
              </div>
              <Link
                href="/packages"
                className="text-sm uppercase tracking-[0.12em] text-gold hover:text-gold-bright"
              >
                {t("allPackages")} →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {packages.map((pkg) => (
                <article key={pkg.id} className="lux-card overflow-hidden">
                  <Link href={`/packages/${pkg.id}`} className="block" data-cursor="view">
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
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist/70">
                        {pkg.days}D / {pkg.nights}N
                      </p>
                      <h3 className="mt-2 font-display text-2xl text-cream">
                        {pkg.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                        {pkg.blurb}
                      </p>
                      <p className="mt-5 text-gold-bright">
                        {isEnquiryPriced(pkg)
                          ? formatPackagePrice(pkg)
                          : `${t("from")} ${formatInr(pkg.priceFrom)} ${t("perPerson")}`}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {blogCount > 0 ? (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-cream">
              {blogT("recentGuides")}
            </h2>
            <Link
              href={`/blog?destination=${dest.slug}`}
              className="text-sm uppercase tracking-[0.12em] text-gold hover:text-gold-bright"
            >
              {blogT("viewAllGuides", { destination: dest.name })}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.slug} className="border border-[var(--line)] bg-[#04101f]/35">
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                    {post.date} · {blogT("read", { count: post.readMinutes })}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-white">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-[var(--line)] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-3xl text-gold-bright">Canaan</p>
          <h2 className="mt-4 font-display text-4xl text-cream md:text-5xl">
            {t("planTitle", { name: dest.name })}
          </h2>
          <p className="mt-5 text-soft-gray">{t("planBody")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href={`/plan-your-trip?destination=${dest.slug}`}
              className="btn-gold"
            >
              {t("planThisTrip")}
            </Link>
            <Link href={`/enquire?destination=${dest.slug}&source=destination`} className="btn-ghost">
              {t("enquire")}
            </Link>
            <Link href="/services/travel-consulting" className="btn-ghost">
              {nav("consulting")}
            </Link>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
