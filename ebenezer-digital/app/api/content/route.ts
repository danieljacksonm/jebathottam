import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [services, portfolio, testimonials, blogPosts, team, settings] = await Promise.all([
      db.getServices(true),
      db.getPortfolio(true),
      db.getTestimonials(true),
      db.getBlogPosts(true),
      db.getTeam(),
      db.getSettings(),
    ]);

    return NextResponse.json({
      services,
      portfolio,
      testimonials,
      blogPosts,
      team,
      settings,
    });
  } catch (error) {
    console.error("Public content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
