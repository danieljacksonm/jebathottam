import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  blogRows,
  getLocalizedBlog,
} from "@/data/blog";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, articleJsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogRows.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getLocalizedBlog(slug, locale);
  if (!post) return {};
  return pageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.image,
    imageAlt: post.title,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = await getLocale();
  const post = getLocalizedBlog(slug, loc);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          image: post.image,
          url: absoluteUrl(locale, `/blog/${post.slug}`),
          datePublished: post.date,
        })}
      />
      <CinematicPageHero
        eyebrow={`${post.date} · ${t("read", { count: post.readMinutes })}`}
        title={post.title}
        subtitle={post.excerpt}
        image={post.image}
        imageAlt={post.title}
        tone="mist"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("blog"), href: "/blog" },
          { name: post.title },
        ]}
      />
      <BlogArticle
        backLabel={t("back")}
        paragraphs={post.body}
        tags={post.tags}
        image={post.image}
        imageAlt={post.title}
      />
    </PageAtmosphere>
  );
}
