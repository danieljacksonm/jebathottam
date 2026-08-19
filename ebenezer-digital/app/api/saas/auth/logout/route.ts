import { NextResponse } from "next/server";
import { clearSaasAuthCookie } from "@/lib/saas-auth";

export async function POST() {
  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": clearSaasAuthCookie(),
      },
    }
  );
}
