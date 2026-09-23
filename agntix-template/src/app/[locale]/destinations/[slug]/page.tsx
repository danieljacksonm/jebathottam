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
  getPackagesForDestination,
} from "@/data/packages";
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
  const blogT = await getTranslations("blog");
  const places = await getPlacesForDestination(dest.id, locale);
  const packages = getPackagesForDestination(resolved.slug, locale);
  const blogPosts = await getLocalizedBlogs(locale, {
    destination: resolved.slug,
  });
  const blogCount = await getBlogCount({ destination: resolved.slug });

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
        eyebrow={
          dest.status === "coming_soon"
            ? "Coming soon"
            : dest.status === "enquiry"
              ? "Custom planning"
              : dest.country
        }
        title={dest.name}
        subtitle={dest.tagline}
        image={dest.image}
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

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <p className="text-base leading-relaxed text-soft-gray md:text-lg">
          {dest.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/plan-your-trip?destination=${dest.slug}`}
            className="btn-gold"
          >
            Plan this trip
          </Link>
          {packages.length > 0 ? (
            <Link href="/packages" className="btn-ghost">
              View packages
            </Link>
          ) : (
            <Link href="/enquire" className="btn-ghost">
              Enquire
            </Link>
          )}
          {blogCount > 0 ? (
            <Link
              href={`/blog?destination=${dest.slug}`}
              className="btn-ghost"
            >
              {blogT("viewAllGuides", { destination: dest.name })}
            </Link>
          ) : null}
        </div>
        {dest.priceFrom ? (
          <p className="mt-6 text-gold-bright">
            From {formatInr(dest.priceFrom)} per person (where published)
          </p>
        ) : null}
      </section>

      {packages.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-cream">
              Available packages
            </h2>
            <Link
              href="/packages"
              className="text-sm uppercase tracking-[0.12em] text-gold hover:text-gold-bright"
            >
              All packages →
            </Link>
          </div>
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
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist/70">
                      {pkg.days}D / {pkg.nights}N
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-cream">
                      {pkg.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                      {pkg.blurb}
                    </p>
                    {pkg.highlights.length > 0 ? (
                      <ul className="mt-4 space-y-1 text-sm text-mist/80">
                        {pkg.highlights.slice(0, 4).map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-5 text-gold-bright">
                      From {formatInr(pkg.priceFrom)} per person
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {places.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <h2 className="font-display text-3xl text-cream">Top places</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {places.map((place) => (
              <article key={place.slug} className="lux-card overflow-hidden">
                <Link
                  href={`/destinations/${dest.slug}/places/${place.slug}`}
                  className="block"
                >
                  {place.image ? (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="font-display text-xl text-white">
                      {place.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                      {place.summary}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gold">
                      50 guides →
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {blogCount > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
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
              <article key={post.slug} className="lux-card overflow-hidden">
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

      <section className="border-t border-[var(--line)] bg-[#04101f]/70 px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-cream">
              Plan a {dest.name} trip
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-soft-gray">
              Share dates, travellers, and preferences — we respond with a clear
              plan based on published packages or a custom enquiry.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/plan-your-trip?destination=${dest.slug}`}
              className="btn-gold"
            >
              Plan My Trip
            </Link>
            <Link href="/enquire" className="btn-ghost">
              Enquire
            </Link>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
