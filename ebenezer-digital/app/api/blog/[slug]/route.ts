import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const post = await db.getBlogPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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
