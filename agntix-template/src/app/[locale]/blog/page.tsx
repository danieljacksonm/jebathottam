import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getBlogContinentOptions,
  getBlogCount,
  getBlogDestinationOptions,
  getBlogHeroImage,
  getLocalizedBlogs,
} from "@/data/blog";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { BlogFilterChips } from "@/components/blog/BlogFilterChips";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: "seo" });
  const blog = await getTranslations({ locale, namespace: "blog" });
  const heroImage = await getBlogHeroImage();
  return pageMetadata({
    locale,
    path: "/blog",
    title: seo("blogTitle"),
    description: seo("blogDescription"),
    image: heroImage,
    imageAlt: blog("listImageAlt"),
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    destination?: string;
    continent?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  const { destination, continent, page: pageRaw } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = await getLocale();
  const page = Math.max(1, Number(pageRaw) || 1);
  const filters = { destination, continent };
  const total = await getBlogCount(filters);
  const heroImage = await getBlogHeroImage(filters);
  const posts = await getLocalizedBlogs(loc, {
    ...filters,
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });
  const destinationOptions = await getBlogDestinationOptions(loc);
  const continentOptions = await getBlogContinentOptions();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filterLabel =
    destinationOptions.find((d) => d.slug === destination)?.label ??
    continent ??
    null;

  const filterOptions = [
    ...continentOptions.map((row) => ({
      id: row.continent,
      label: row.continent,
      count: row.count,
      param: "continent" as const,
    })),
    ...destinationOptions.slice(0, 12).map((row) => ({
      id: row.slug,
      label: row.label,
      count: row.count,
      param: "destination" as const,
    })),
  ];

  const featured = page === 1 && !filterLabel ? posts[0] : null;
  const gridPosts = featured ? posts.slice(1) : posts;

  const cards = gridPosts.map((post) => ({
    slug: post.slug,
    date: post.date,
    readMinutes: post.readMinutes,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    readLabel: t("read", { count: post.readMinutes }),
    image: post.image,
    destinationLabel: post.placeName
      ? `${post.placeName}${post.destinationName ? ` · ${post.destinationName}` : ""}`
      : post.destinationName ?? undefined,
  }));

  const nav = await getTranslations("nav");
  const queryBase = destination
    ? `destination=${destination}`
    : continent
      ? `continent=${encodeURIComponent(continent)}`
      : "";

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={
          filterLabel
            ? t("filteredTitle", { destination: filterLabel })
            : t("title")
        }
        subtitle={
          filterLabel
            ? t("filteredSubtitle", { destination: filterLabel })
            : t("subtitle")
        }
        image={heroImage}
        imageAlt={t("heroImageAlt")}
        tone="forest"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("blog") },
        ]}
      />

      {featured ? (
        <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">
            {t("featured")}
          </p>
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-5 grid overflow-hidden border border-[var(--line)] lg:grid-cols-[1.4fr_1fr]"
          >
            <div className="relative min-h-[16rem] lg:min-h-[22rem]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized={featured.image.startsWith("http")}
              />
            </div>
            <div className="flex flex-col justify-center bg-[#04101f]/55 p-7 md:p-10">
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-mist">
                {featured.destinationName ?? t("eyebrow")} ·{" "}
                {t("read", { count: featured.readMinutes })}
              </p>
              <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-soft-gray">
                {featured.excerpt}
              </p>
              <span className="mt-6 text-xs uppercase tracking-[0.14em] text-gold">
                {t("readMore")} →
              </span>
            </div>
          </Link>
          <p className="mt-12 text-[0.68rem] uppercase tracking-[0.2em] text-gold">
            {t("latest")}
          </p>
        </section>
      ) : null}

      <BlogFilterChips options={filterOptions} />
      <BlogGrid
        posts={cards}
        labels={{
          intro: filterLabel
            ? t("filteredIntro", { destination: filterLabel })
            : t("gridIntro"),
          storiesCount: t("storiesCount", { count: total }),
          readMore: t("readMore"),
        }}
      />
      {totalPages > 1 ? (
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-5 pb-16 md:px-8">
          {page > 1 ? (
            <Link
              href={`/blog?${queryBase}${queryBase ? "&" : ""}page=${page - 1}`}
              className="border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-mist hover:border-gold/40"
            >
              {t("prev")}
            </Link>
          ) : null}
          <span className="text-xs uppercase tracking-[0.14em] text-soft-gray">
            {t("pageLabel", { page, total: totalPages })}
          </span>
          {page < totalPages ? (
            <Link
              href={`/blog?${queryBase}${queryBase ? "&" : ""}page=${page + 1}`}
              className="border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-mist hover:border-gold/40"
            >
              {t("next")}
            </Link>
          ) : null}
        </div>
      ) : null}
    </PageAtmosphere>
  );
}
