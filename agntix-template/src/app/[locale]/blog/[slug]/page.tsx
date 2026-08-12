import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  blogRows,
  getLocalizedBlog,
} from "@/data/blog";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { BlogArticle } from "@/components/blog/BlogArticle";

export function generateStaticParams() {
  return blogRows.map((post) => ({ slug: post.slug }));
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

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={`${post.date} · ${t("read", { count: post.readMinutes })}`}
        title={post.title}
        subtitle={post.excerpt}
        image={post.image}
        tone="mist"
        compact
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
