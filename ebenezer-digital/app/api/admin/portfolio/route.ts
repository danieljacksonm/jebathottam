import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const portfolio = await db.getPortfolio();
  return NextResponse.json({ portfolio });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const item = await db.createPortfolioItem({
      title: body.title,
      clientName: body.clientName || "",
      category: Array.isArray(body.category) ? body.category : [body.category || "web"],
      description: body.description || "",
      challenge: body.challenge,
      solution: body.solution,
      result: body.result,
      coverImage: body.coverImage || "/images/work-1.jpg",
      galleryImages: body.galleryImages || [],
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      liveUrl: body.liveUrl,
      status: body.status || "draft",
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Create portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const { id, ...data } = body;
    const item = await db.updatePortfolioItem(id, data);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const deleted = await db.deletePortfolioItem(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
