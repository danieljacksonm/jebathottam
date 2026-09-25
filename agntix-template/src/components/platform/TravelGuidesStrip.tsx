import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocalizedBlogs } from "@/data/blog";

/** Homepage editorial strip using real published guides (no invented articles). */
export async function TravelGuidesStrip() {
  const t = await getTranslations("platform");
  const blogT = await getTranslations("blog");
  const locale = await getLocale();
  const featuredPosts = await getLocalizedBlogs(locale, {
    featured: true,
    take: 4,
  });
  const posts =
    featuredPosts.length >= 4
      ? featuredPosts
      : [
          ...featuredPosts,
          ...(
            await getLocalizedBlogs(locale, {
              take: 4 - featuredPosts.length,
            })
          ).filter((p) => !featuredPosts.some((f) => f.slug === p.slug)),
        ].slice(0, 4);
  if (!posts.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {t("guidesEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {t("guidesTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-soft-gray">{t("guidesBody")}</p>
          </div>
          <Link href="/blog" className="text-sm text-gold hover:text-gold-bright">
            {t("viewAllGuides")}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative min-h-[22rem] overflow-hidden border border-[var(--line)]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={featured.image.startsWith("http")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold">
                {featured.destinationName ?? blogT("eyebrow")} ·{" "}
                {blogT("read", { count: featured.readMinutes })}
              </p>
              <h3 className="mt-3 max-w-xl font-display text-3xl text-cream md:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-lg line-clamp-2 text-sm text-white/75">
                {featured.excerpt}
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[7.5rem_1fr] gap-4 border border-[var(--line)] bg-[#04101f]/35 p-3 transition hover:border-gold/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={post.image.startsWith("http")}
                  />
                </div>
                <div className="flex flex-col justify-center pr-2">
                  <p className="text-[0.58rem] uppercase tracking-[0.14em] text-mist">
                    {post.destinationName ?? post.continent ?? blogT("eyebrow")}
                  </p>
                  <h3 className="mt-1 font-display text-xl leading-snug text-white group-hover:text-gold-bright">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
