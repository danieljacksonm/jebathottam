import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const STAFF_ROLES = ["ADMIN", "EDITOR", "FINANCE", "MARKETING"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function hashStaffPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `${salt.toString("hex")}.${hash.toString("hex")}`;
}

export function verifyStaffPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(".");
  if (!saltHex || !hashHex) return false;
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), 32);
  const expected = Buffer.from(hashHex, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

