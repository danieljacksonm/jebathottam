import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      status: true,
      date: true,
      readMinutes: true,
      image: true,
      updatedAt: true,
      destination: { select: { slug: true, nameEn: true } },
    },
    take: 200,
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const slug = String(body.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  if (!slug || !body.titleEn) {
    return NextResponse.json(
      { error: "slug and titleEn are required" },
      { status: 400 },
    );
  }

  const status = body.status === "draft" ? "draft" : "published";
  const post = await prisma.blogPost.create({
    data: {
      slug,
      status,
      publishedAt: status === "published" ? new Date() : null,
      featured: Boolean(body.featured),
      date: String(body.date || new Date().toISOString().slice(0, 10)),
      readMinutes: Number(body.readMinutes) || 8,
      image: String(body.image || "/images/travel/d/darjeeling.jpg"),
      tagsEn: JSON.stringify(body.tagsEn ?? []),
      tagsTa: JSON.stringify(body.tagsTa ?? body.tagsEn ?? []),
      tagsHi: JSON.stringify(body.tagsHi ?? body.tagsEn ?? []),
      titleEn: String(body.titleEn),
      titleTa: String(body.titleTa || body.titleEn),
      titleHi: String(body.titleHi || body.titleEn),
      excerptEn: String(body.excerptEn || ""),
      excerptTa: String(body.excerptTa || body.excerptEn || ""),
      excerptHi: String(body.excerptHi || body.excerptEn || ""),
      bodyEn: JSON.stringify(body.bodyEn ?? []),
      bodyTa: JSON.stringify(body.bodyTa ?? body.bodyEn ?? []),
      bodyHi: JSON.stringify(body.bodyHi ?? body.bodyEn ?? []),
      seoTitleEn: String(body.seoTitleEn || ""),
      seoTitleTa: String(body.seoTitleTa || ""),
      seoTitleHi: String(body.seoTitleHi || ""),
      seoDescriptionEn: String(body.seoDescriptionEn || ""),
      seoDescriptionTa: String(body.seoDescriptionTa || ""),
      seoDescriptionHi: String(body.seoDescriptionHi || ""),
      ogImage: body.ogImage ? String(body.ogImage) : null,
      canonicalUrl: body.canonicalUrl ? String(body.canonicalUrl) : null,
      authorEn: String(body.authorEn || "Canaan Travel Hub"),
      authorTa: String(body.authorTa || "கானான் டிராவல் ஹப்"),
      authorHi: String(body.authorHi || "कानान ट्रैवल हब"),
      destinationId: body.destinationId || null,
    },
  });

  revalidatePath("/en/blog");
  revalidatePath("/ta/blog");
  revalidatePath("/hi/blog");
  return NextResponse.json({ post });
}
