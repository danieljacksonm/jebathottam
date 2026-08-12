import { NextRequest, NextResponse } from "next/server";
import { getPublicNewsBySlug } from "@/lib/news-service";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const item = await getPublicNewsBySlug(params.slug);
    if (!item) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("News slug error:", error);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
