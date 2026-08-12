import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await db.getDigitalProducts(true);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Store products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
