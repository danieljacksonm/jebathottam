import { NextRequest, NextResponse } from "next/server";
import { authenticateSaasUser, generateSaasToken, setSaasAuthCookie } from "@/lib/saas-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const ok = authenticateSaasUser(email, password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid SaaS credentials" }, { status: 401 });
    }

    const token = generateSaasToken(email);
    const cookie = setSaasAuthCookie(token);

    return NextResponse.json(
      { ok: true, email: String(email).trim().toLowerCase() },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error("SaaS login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
