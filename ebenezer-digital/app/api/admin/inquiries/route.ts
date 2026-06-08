import { NextRequest, NextResponse } from "next/server";
import { db, Inquiry } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/admin/inquiries - List all inquiries
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let inquiries = await db.getInquiries();

    // Filter by status
    if (status && status !== "all") {
      inquiries = inquiries.filter((i) => i.status === status);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      inquiries = inquiries.filter(
        (i) =>
          i.name.toLowerCase().includes(searchLower) ||
          i.email.toLowerCase().includes(searchLower) ||
          i.message.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Inquiries list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/inquiries - Update inquiry status
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id, status, notes } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updateData: Partial<Inquiry> = { status };
    if (notes !== undefined) updateData.notes = notes;
    if (status === "replied") updateData.repliedAt = new Date();

    const updated = await db.updateInquiry(id, updateData);

    if (!updated) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ inquiry: updated });
  } catch (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/inquiries - Delete inquiry
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteInquiry(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
