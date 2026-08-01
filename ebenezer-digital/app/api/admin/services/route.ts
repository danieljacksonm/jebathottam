import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const services = await db.getServices();
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const service = await db.createService({
      title: body.title,
      description: body.description,
      icon: body.icon || "FileText",
      category: body.category || "other",
      features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
      status: body.status || "draft",
    });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    if (Array.isArray(body.ids)) {
      const services = await db.reorderServices(body.ids);
      return NextResponse.json({ services });
    }
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const { id, ...data } = body;
    const service = await db.updateService(id, data);
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ service });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const deleted = await db.deleteService(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
