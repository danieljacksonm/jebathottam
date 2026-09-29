import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { SOCIAL_PLATFORMS } from "@/lib/social/providers";
import { encryptSecret } from "@/lib/token-crypto";

export async function POST(request: Request) {
  const denied = await denyUnlessRole(["ADMIN", "MARKETING"]);
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const platform = String(body.platform || "");
  if (!SOCIAL_PLATFORMS.includes(platform as (typeof SOCIAL_PLATFORMS)[number])) {
    return NextResponse.json({ ok: false, error: "Unsupported platform" }, { status: 400 });
  }
  const accountName = String(body.accountName || "").trim();
  if (!accountName) {
    return NextResponse.json({ ok: false, error: "Account name is required" }, { status: 400 });
  }
  const token = String(body.token || "").trim();
  let tokenCipher = "";
  let status = "NOT_CONNECTED";
  if (token) {
    try {
      tokenCipher = encryptSecret(token);
      status = "CONNECTED";
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: error instanceof Error ? error.message : "Could not store credential" },
        { status: 400 },
      );
    }
  }
  const account = await prisma.socialAccount.create({
    data: {
      platform,
      accountName: accountName.slice(0, 120),
      externalId: String(body.externalId || "").slice(0, 120),
      status,
      tokenCipher,
      permissions: String(body.permissions || "").slice(0, 200),
    },
  });
  return NextResponse.json({
    ok: true,
    id: account.id,
    status: account.status,
  });
}
