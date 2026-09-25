import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, slug: true, nameEn: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const status =
    body.status === "draft" || body.status === "archived"
      ? body.status
      : "published";

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: body.slug
        ? String(body.slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
        : undefined,
      status,
      publishedAt:
        status === "published"
          ? (existing.publishedAt ?? new Date())
          : existing.publishedAt,
      featured:
        typeof body.featured === "boolean" ? body.featured : undefined,
      date: body.date ? String(body.date) : undefined,
      readMinutes:
        typeof body.readMinutes === "number"
          ? body.readMinutes
          : undefined,
      image: body.image ? String(body.image) : undefined,
      tagsEn:
        body.tagsEn != null ? JSON.stringify(body.tagsEn) : undefined,
      tagsTa:
        body.tagsTa != null ? JSON.stringify(body.tagsTa) : undefined,
      tagsHi:
        body.tagsHi != null ? JSON.stringify(body.tagsHi) : undefined,
      titleEn: body.titleEn != null ? String(body.titleEn) : undefined,
      titleTa: body.titleTa != null ? String(body.titleTa) : undefined,
      titleHi: body.titleHi != null ? String(body.titleHi) : undefined,
      excerptEn:
        body.excerptEn != null ? String(body.excerptEn) : undefined,
      excerptTa:
        body.excerptTa != null ? String(body.excerptTa) : undefined,
      excerptHi:
        body.excerptHi != null ? String(body.excerptHi) : undefined,
      bodyEn: body.bodyEn != null ? JSON.stringify(body.bodyEn) : undefined,
      bodyTa: body.bodyTa != null ? JSON.stringify(body.bodyTa) : undefined,
      bodyHi: body.bodyHi != null ? JSON.stringify(body.bodyHi) : undefined,
      seoTitleEn:
        body.seoTitleEn != null ? String(body.seoTitleEn) : undefined,
      seoTitleTa:
        body.seoTitleTa != null ? String(body.seoTitleTa) : undefined,
      seoTitleHi:
        body.seoTitleHi != null ? String(body.seoTitleHi) : undefined,
      seoDescriptionEn:
        body.seoDescriptionEn != null
          ? String(body.seoDescriptionEn)
          : undefined,
      seoDescriptionTa:
        body.seoDescriptionTa != null
          ? String(body.seoDescriptionTa)
          : undefined,
      seoDescriptionHi:
        body.seoDescriptionHi != null
          ? String(body.seoDescriptionHi)
          : undefined,
      ogImage:
        body.ogImage === ""
          ? null
          : body.ogImage != null
            ? String(body.ogImage)
            : undefined,
      canonicalUrl:
        body.canonicalUrl === ""
          ? null
          : body.canonicalUrl != null
            ? String(body.canonicalUrl)
            : undefined,
      authorEn: body.authorEn != null ? String(body.authorEn) : undefined,
      authorTa: body.authorTa != null ? String(body.authorTa) : undefined,
      authorHi: body.authorHi != null ? String(body.authorHi) : undefined,
      destinationId:
        body.destinationId === ""
          ? null
          : body.destinationId != null
            ? body.destinationId
            : undefined,
    },
  });

  revalidatePath("/en/blog");
  revalidatePath("/ta/blog");
  revalidatePath("/hi/blog");
  revalidatePath(`/en/blog/${post.slug}`);
  revalidatePath(`/ta/blog/${post.slug}`);
  revalidatePath(`/hi/blog/${post.slug}`);
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const post = await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/en/blog");
  return NextResponse.json({ ok: true });
}
