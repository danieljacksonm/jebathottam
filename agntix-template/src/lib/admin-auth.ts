import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE = "canaan_admin_session";

function expectedToken() {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  if (!secret) return "";
  return createHash("sha256")
    .update(`canaan-admin:${secret}`)
    .digest("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export async function isAdminAuthenticated() {
  const token = expectedToken();
  if (!token) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value ?? "";
  if (!raw || raw.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(raw), Buffer.from(token));
  } catch {
    return false;
  }
}

export function adminCookieValue() {
  return expectedToken();
}

export const ADMIN_COOKIE_NAME = COOKIE;

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
