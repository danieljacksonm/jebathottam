import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const payload = verifyToken(token);
  if (!payload) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
  return { payload };
}
