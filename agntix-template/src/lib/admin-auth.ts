import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { STAFF_ROLES, type StaffRole } from "@/lib/staff-auth";

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

function signStaff(id: string, role: string) {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(`${id}.${role}`).digest("hex");
}

export function staffCookieValue(id: string, role: string) {
  return `s.${id}.${role}.${signStaff(id, role)}`;
}

export async function getAdminSession(): Promise<{
  role: StaffRole;
  name: string;
} | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value ?? "";
  const owner = expectedToken();
  if (owner && raw.length === owner.length) {
    try {
      if (timingSafeEqual(Buffer.from(raw), Buffer.from(owner))) {
        return { role: "ADMIN", name: "Owner" };
      }
    } catch {
      return null;
    }
  }
  const [prefix, id, role, mac] = raw.split(".");
  if (prefix !== "s" || !id || !role || !mac) return null;
  if (!STAFF_ROLES.includes(role as StaffRole)) return null;
  const expectedMac = signStaff(id, role);
  const a = Buffer.from(mac);
  const b = Buffer.from(expectedMac);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const staff = await prisma.staffAccount.findUnique({ where: { id } });
  if (!staff?.active || staff.role !== role) return null;
  return { role: staff.role as StaffRole, name: staff.name };
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
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
