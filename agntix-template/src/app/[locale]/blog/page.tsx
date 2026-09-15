import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  getBlogCountByDestination,
  getBlogDestinations,
  getLocalizedBlogsByDestination,
  KODAI_BLOG_IMAGE,
  type BlogDestination,
} from "@/data/blog";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { BlogFilterChips } from "@/components/blog/BlogFilterChips";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: "seo" });
  const blog = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({
    locale,
    path: "/blog",
    title: seo("blogTitle"),
    description: seo("blogDescription"),
    image: KODAI_BLOG_IMAGE,
    imageAlt: blog("listImageAlt"),
  });
}

const HERO_BY_DESTINATION: Record<BlogDestination, string> = {
  kodaikanal: KODAI_BLOG_IMAGE,
  darjeeling: "/images/darjeeling/hero/darjeeling-hero.jpg",
  goa: "/images/goa/goa-hero.jpg",
};

const DESTINATION_LABEL_KEY = {
  kodaikanal: "destinationKodaikanal",
  darjeeling: "destinationDarjeeling",
  goa: "destinationGoa",
} as const;

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ destination?: string }>;
}) {
  const { locale } = await params;
  const { destination: destinationParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = await getLocale();
  const destinations = getBlogDestinations();
  const activeDestination = destinations.includes(
    destinationParam as BlogDestination,
  )
    ? (destinationParam as BlogDestination)
    : undefined;
  const posts = getLocalizedBlogsByDestination(loc, activeDestination);

  const destinationLabel = activeDestination
    ? t(DESTINATION_LABEL_KEY[activeDestination])
    : null;

  const cards = posts.map((post) => ({
    slug: post.slug,
    date: post.date,
    readMinutes: post.readMinutes,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    readLabel: t("read", { count: post.readMinutes }),
    image: post.image,
    destinationLabel: post.destination
      ? t(DESTINATION_LABEL_KEY[post.destination])
      : undefined,
  }));

  const filterOptions = [
    {
      id: "all" as const,
      label: t("filterAll"),
      count:
        getBlogCountByDestination("kodaikanal") +
        getBlogCountByDestination("darjeeling") +
        getBlogCountByDestination("goa"),
    },
    ...destinations.map((slug) => ({
      id: slug,
      label: t(DESTINATION_LABEL_KEY[slug]),
      count: getBlogCountByDestination(slug),
    })),
  ];

  const nav = await getTranslations("nav");
  const heroImage = activeDestination
    ? HERO_BY_DESTINATION[activeDestination]
    : KODAI_BLOG_IMAGE;

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={activeDestination ? t("filteredTitle", { destination: destinationLabel ?? "" }) : t("title")}
        subtitle={activeDestination ? t("filteredSubtitle", { destination: destinationLabel ?? "" }) : t("subtitle")}
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
      <BlogFilterChips options={filterOptions} />
      <BlogGrid
        posts={cards}
        labels={{
          intro: activeDestination
            ? t("filteredIntro", { destination: destinationLabel ?? "" })
            : t("gridIntro"),
          storiesCount: t("storiesCount", { count: posts.length }),
          readMore: t("readMore"),
        }}
      />
    </PageAtmosphere>
  );
}
