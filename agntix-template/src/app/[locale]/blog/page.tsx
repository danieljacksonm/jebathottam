import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  getLocalizedBlogs,
  KODAI_BLOG_IMAGE,
} from "@/data/blog";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
    path: "/blog",
    title: t("blogTitle"),
    description: t("blogDescription"),
    image: KODAI_BLOG_IMAGE,
    imageAlt: "Kodaikanal travel stories",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = await getLocale();
  const posts = getLocalizedBlogs(loc);

  const cards = posts.map((post) => ({
    slug: post.slug,
    date: post.date,
    readMinutes: post.readMinutes,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    readLabel: t("read", { count: post.readMinutes }),
    image: post.image,
  }));

  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={KODAI_BLOG_IMAGE}
        imageAlt="Kodaikanal pine forest for travel stories"
        tone="forest"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("blog") },
        ]}
      />
      <BlogGrid posts={cards} />
    </PageAtmosphere>
  );
}
