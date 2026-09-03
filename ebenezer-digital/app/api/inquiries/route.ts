import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "inquiries", 8, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  try {
    const body = await request.json();
    const { name, email, phone, service, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const inquiry = await db.createInquiry({
      name,
      email,
      phone,
      service: service || "other",
      budget,
      message,
    });

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    const isWrite = /EACCES|EPERM|read-only|Failed to save|ENOENT/i.test(detail);
    return NextResponse.json(
      {
        error: isWrite
          ? "Server cannot save inquiries. Please email us directly."
          : "Failed to submit inquiry",
        detail: process.env.NODE_ENV === "development" ? detail : undefined,
      },
      { status: 500 }
    );
  }
}
