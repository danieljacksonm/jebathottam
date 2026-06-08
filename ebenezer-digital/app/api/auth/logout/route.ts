import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const cookie = clearAuthCookie();

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}
