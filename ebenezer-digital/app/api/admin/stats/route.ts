import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify auth token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const stats = await db.getStats();

    // Get inquiries trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inquiriesTrend = await db.getInquiries().then((inquiries) => {
      const trend: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];
        trend[dateKey] = 0;
      }

      inquiries.forEach((inquiry) => {
        const dateKey = inquiry.createdAt.toISOString().split("T")[0];
        if (trend[dateKey] !== undefined) {
          trend[dateKey]++;
        }
      });

      return Object.entries(trend).map(([date, count]) => ({
        date,
        count,
      }));
    });

    // Get recent inquiries
    const recentInquiries = await db.getInquiries().then((inquiries) =>
      inquiries.slice(0, 5).map((i) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        service: i.service,
        status: i.status,
        createdAt: i.createdAt.toISOString(),
      }))
    );

    return NextResponse.json({
      stats,
      inquiriesTrend,
      recentInquiries,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
