import { NextRequest, NextResponse } from "next/server";
import { getSaasCookieName, verifySaasToken } from "@/lib/saas-auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSaasCookieName())?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  const payload = verifySaasToken(token);
  if (!payload) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({
    authenticated: true,
    user: {
      email: payload.email,
      product: payload.product,
    },
  });
}
