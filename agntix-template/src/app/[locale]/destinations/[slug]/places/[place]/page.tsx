import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getAllPlaceParams, getPlace } from "@/data/destinations";
import { getBlogCount, getLocalizedBlogs } from "@/data/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata, placeJsonLd } from "@/lib/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  const rows = await getAllPlaceParams();
  return rows.slice(0, 80).map((r) => ({
    slug: r.destination,
    place: r.place,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; place: string }>;
}) {
  const { locale, slug, place: placeSlug } = await params;
  const place = await getPlace(slug, placeSlug, locale);
  if (!place) return {};
  return pageMetadata({
    locale,
    path: `/destinations/${slug}/places/${placeSlug}`,
    title: `${place.name} Travel Guide | ${place.destinationName} | Canaan`,
    description: place.detail || place.summary,
    image: place.image ?? undefined,
    imageAlt: place.name,
  });
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; place: string }>;
}) {
  const resolved = await params;
  setRequestLocale(resolved.locale);
  const locale = await getLocale();
  const place = await getPlace(resolved.slug, resolved.place, locale);
  if (!place) notFound();

  const nav = await getTranslations("nav");
  const blogT = await getTranslations("blog");
  const blogs = await getLocalizedBlogs(locale, {
    destination: resolved.slug,
    place: resolved.place,
    take: 12,
  });
  const blogCount = await getBlogCount({
    destination: resolved.slug,
    place: resolved.place,
  });

  return (
    <PageAtmosphere>
      <JsonLd
        data={placeJsonLd({
          name: place.name,
          description: place.detail || place.summary,
          image: place.image ?? "",
          url: absoluteUrl(
            resolved.locale,
            `/destinations/${resolved.slug}/places/${resolved.place}`,
          ),
          destinationName: place.destinationName,
        })}
      />
      <CinematicPageHero
        eyebrow={place.destinationName ?? resolved.slug}
        title={place.name}
        subtitle={place.summary}
        image={place.image ?? place.destinationImage}
        imageAlt={place.name}
        tone="mist"
      />
      <Breadcrumbs
        locale={resolved.locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations"), href: "/destinations" },
          {
            name: place.destinationName ?? resolved.slug,
            href: `/destinations/${resolved.slug}`,
          },
          { name: place.name },
        ]}
      />

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        {place.image ? (
          <div className="relative mb-10 aspect-[21/9] overflow-hidden">
            <Image
              src={place.image}
              alt={place.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ) : null}
        <p className="text-base leading-relaxed text-soft-gray md:text-lg">
          {place.detail || place.summary}
        </p>
        {place.bestTime ? (
          <p className="mt-6 text-sm text-gold-bright">
            Best time: {place.bestTime}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/plan-your-trip?destination=${resolved.slug}&place=${place.slug}`}
            className="btn-gold"
          >
            Plan this place
          </Link>
          <Link
            href={`/blog?destination=${resolved.slug}`}
            className="btn-ghost"
          >
            {blogT("viewAllGuides", {
              destination: place.destinationName ?? place.name,
            })}
          </Link>
        </div>
      </section>

      {blogCount > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <h2 className="font-display text-3xl text-cream">
            {blogCount} guides about {place.name}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blogs.map((post) => (
              <article key={post.slug} className="lux-card overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                      {post.date} · {blogT("read", { count: post.readMinutes })}
                    </p>
                    <h3 className="mt-3 font-display text-xl text-white">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageAtmosphere>
  );
}
