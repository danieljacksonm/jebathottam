import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog — Car Wrap Guides & Ideas",
  description:
    "Practical guides from Raju Stickers: how to apply wraps, care tips, JDM ideas, placement, and custom sticker advice.",
  path: "/blog",
  image: "/products/carbon-fiber.jpg",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <h1 className="section-title mb-2">Blog</h1>
      <p className="section-sub mb-10">
        Useful wrap and sticker content — application, care, style, and placement.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="card-surface overflow-hidden flex flex-col">
            <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] block bg-[var(--bg-muted)]">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
            <div className="p-5 flex flex-col gap-2 flex-1">
              <p className="text-xs text-[var(--text-subtle)]">
                {post.date} · {post.readingTime}
              </p>
              <h2 className="font-display text-2xl">
                <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)]">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-[var(--text-muted)] line-clamp-3">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-sm text-[var(--accent)] mt-auto pt-2">
                Read article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
