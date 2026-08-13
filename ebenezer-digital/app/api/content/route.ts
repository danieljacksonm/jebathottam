import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Public site content. Blog list omits full body to keep payload light (1000+ edu posts). */
export async function GET() {
  try {
    const [services, portfolio, testimonials, blogPosts, team, settings, digitalProducts] =
      await Promise.all([
        db.getServices(true),
        db.getPortfolio(true),
        db.getTestimonials(true),
        db.getBlogPosts(true),
        db.getTeam(),
        db.getSettings(),
        db.getDigitalProducts(true),
      ]);

    const lightBlog = blogPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      gallery: p.gallery?.slice(0, 6),
      category: p.category,
      tags: p.tags,
      author: p.author,
      publishedAt: p.publishedAt,
      relatedSlugs: p.relatedSlugs,
      aiPrompt: p.aiPrompt,
      promoteProducts: p.promoteProducts,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
    }));

    return NextResponse.json({
      services,
      portfolio,
      testimonials,
      blogPosts: lightBlog,
      team,
      settings,
      digitalProducts,
    });
  } catch (error) {
    console.error("Public content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
