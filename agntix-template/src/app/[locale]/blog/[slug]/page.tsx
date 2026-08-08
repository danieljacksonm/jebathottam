import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blogCopy, blogPosts, getBlogPost } from "@/data/blog";
import type { Locale } from "@/i18n/routing";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const loc = (await getLocale()) as Locale;
  const copy = blogCopy[post.slug];

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={`${post.date} · ${t("read", { count: post.readMinutes })}`}
        title={copy.title[loc]}
        subtitle={copy.excerpt[loc]}
        image={post.image}
        tone="mist"
        compact
      />

      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <Link href="/blog" className="text-sm text-gold hover:text-gold-bright">
          ← {t("back")}
        </Link>
        <div className="mt-10 space-y-6">
          {copy.body.map((para) => (
            <p key={para.slice(0, 28)} className="text-lg leading-relaxed text-soft-gray">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-mist"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative mt-14 aspect-[21/9] overflow-hidden rounded-3xl">
          <Image src={post.image} alt="" fill className="object-cover" sizes="100vw" />
        </div>
      </article>
    </PageAtmosphere>
  );
}
