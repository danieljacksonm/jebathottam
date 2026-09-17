import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contentKeyFor, resolveLocalizedContent } from "@/lib/i18n/resolve-content";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    let post = await db.getBlogPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const locale = (headers().get("x-eben-locale") || "en").toLowerCase();
    if (locale !== "en") {
      const localized = await resolveLocalizedContent(contentKeyFor("journal", params.slug), locale);
      if (localized) {
        post = {
          ...post,
          title: localized.title,
          excerpt: localized.excerpt,
          content: localized.body,
          seoTitle: localized.metaTitle || localized.title,
          seoDescription: localized.metaDescription || localized.excerpt,
        };
      }
    }

    const related = post.relatedSlugs?.length
      ? (
          await Promise.all(post.relatedSlugs.map((s) => db.getBlogPostBySlug(s)))
        )
          .filter(Boolean)
          .map((p) => ({
            id: p!.id,
            title: p!.title,
            slug: p!.slug,
            excerpt: p!.excerpt,
            coverImage: p!.coverImage,
            category: p!.category,
            author: p!.author,
            publishedAt: p!.publishedAt,
          }))
      : [];

    return NextResponse.json({ post, related });
  } catch (error) {
    console.error("Blog slug error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
