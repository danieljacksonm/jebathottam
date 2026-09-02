import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function slugify(title: string) {
  return String(title || "news")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseBody(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const articles = await db.getNewsArticles();
  return NextResponse.json({ articles });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.title);
    const status = body.status || "draft";
    const article = await db.createNewsArticle({
      title: body.title || "Untitled",
      slug,
      dek: body.dek || "",
      body: parseBody(body.body),
      region: body.region || "World",
      topic: body.topic || "General",
      location: body.location || "Global",
      sourceLabel: body.sourceLabel || "Ebenezer News Desk",
      coverImage: body.coverImage || "/images/journal/hero.jpg",
      breaking: Boolean(body.breaking),
      featured: Boolean(body.featured),
      pinned: Boolean(body.pinned),
      status,
      publishedAt: status === "published" ? new Date() : undefined,
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const data: Record<string, unknown> = { ...rest };
    if (rest.body !== undefined) data.body = parseBody(rest.body);
    if (rest.status === "published" && !rest.publishedAt) {
      data.publishedAt = new Date();
    }

    const article = await db.updateNewsArticle(id, data);
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  } catch (error) {
    console.error("Update news error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const ok = await db.deleteNewsArticle(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
