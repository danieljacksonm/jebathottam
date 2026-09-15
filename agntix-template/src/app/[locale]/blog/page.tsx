import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  getBlogContinentOptions,
  getBlogDestinationOptions,
  getLocalizedBlogs,
  KODAI_BLOG_IMAGE,
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

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ destination?: string; continent?: string }>;
}) {
  const { locale } = await params;
  const { destination, continent } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = await getLocale();
  const filters = { destination, continent };
  const posts = await getLocalizedBlogs(loc, filters);
  const destinationOptions = await getBlogDestinationOptions(loc);
  const continentOptions = await getBlogContinentOptions();

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

  const cards = posts.map((post) => ({
    slug: post.slug,
    date: post.date,
    readMinutes: post.readMinutes,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    readLabel: t("read", { count: post.readMinutes }),
    image: post.image,
    destinationLabel: post.destinationName ?? undefined,
  }));

  const nav = await getTranslations("nav");

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
        image={KODAI_BLOG_IMAGE}
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
          intro: filterLabel
            ? t("filteredIntro", { destination: filterLabel })
            : t("gridIntro"),
          storiesCount: t("storiesCount", { count: posts.length }),
          readMore: t("readMore"),
        }}
      />
    </PageAtmosphere>
  );
}
