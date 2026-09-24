import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const STAFF_COOKIE = "rs_staff";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "raju-stickers-desk-secret";
}

export function expectedPassword() {
  return process.env.ADMIN_PASSWORD || "raju-stickers";
}

export function passwordMatches(input: string) {
  const expected = expectedPassword().trim().replace(/^"|"$/g, "");
  const a = Buffer.from(input.trim());
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signStaffToken() {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp, role: "staff" })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyStaffToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export function staffFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)rs_staff=([^;]+)/);
  return verifyStaffToken(match ? decodeURIComponent(match[1]) : null);
}

export async function isStaff() {
  const jar = await cookies();
  return verifyStaffToken(jar.get(STAFF_COOKIE)?.value);
}

export function staffCookie() {
  return {
    name: STAFF_COOKIE,
    value: signStaffToken(),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://"),
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  };
}
