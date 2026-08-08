import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blogCopy, blogPosts } from "@/data/blog";
import type { Locale } from "@/i18n/routing";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = (await getLocale()) as Locale;

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=80"
        tone="forest"
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2 lg:grid-cols-3 md:px-8 md:py-24">
        {blogPosts.map((post) => {
          const copy = blogCopy[post.slug];
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="lux-card block">
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.image}
                  alt={copy.title[loc]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                  {post.date} · {t("read", { count: post.readMinutes })}
                </p>
                <h2 className="mt-3 font-display text-2xl text-white">
                  {copy.title[loc]}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {copy.excerpt[loc]}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </PageAtmosphere>
  );
}
