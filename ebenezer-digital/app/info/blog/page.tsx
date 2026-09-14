import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/site-url";
import { journalArticleHref, SITE_NAV } from "@/lib/site-nav";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Blog | Ebenezer Digital Information",
  description:
    "Original articles on technology, AI, business, websites and digital life — from the Ebenezer Journal.",
  path: "/info/blog",
});

const BLOG_CATEGORIES = [
  "Technology",
  "AI",
  "Business",
  "Websites",
  "Digital Tools",
  "Digital Life",
  "Travel",
  "How-To Guides",
];

export default async function InfoBlogIndexPage() {
  const posts = await db.getBlogPosts(true).catch(() => []);
  const sorted = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt || 0).getTime() -
        new Date(a.publishedAt || a.createdAt || 0).getTime()
    );

  return (
    <div className="info-page">
      <p className="info-kicker">Blog</p>
      <h1 className="info-title">Original articles</h1>
      <p className="info-lead mt-3">
        Long-form writing lives in the Ebenezer Journal. This hub lists the latest posts so you can
        start here — each article opens on its canonical Journal URL.
      </p>
      <p className="info-meta mt-4">
        Categories: {BLOG_CATEGORIES.join(" · ")}
      </p>
      <ul className="mt-10 space-y-8">
        {sorted.map((post) => {
          const published = post.publishedAt || post.createdAt;
          return (
            <li key={post.id}>
              <a href={journalArticleHref(post.slug)} className="info-story-title hover:underline">
                {post.title}
              </a>
              <p className="info-meta mt-1">
                {post.category || "Article"}
                {published
                  ? ` · ${new Date(published).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`
                  : ""}
              </p>
              <p className="info-story-dek mt-1">{post.excerpt}</p>
            </li>
          );
        })}
        {sorted.length === 0 ? <li className="info-lead">No blog posts published yet.</li> : null}
      </ul>
      <p className="mt-10">
        <Link href={SITE_NAV.journal} className="info-btn info-btn-outline">
          Open full Journal
        </Link>
      </p>
    </div>
  );
}
