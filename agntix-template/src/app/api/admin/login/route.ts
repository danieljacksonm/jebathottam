import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieValue,
  isAdminConfigured,
  staffCookieValue,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { verifyStaffPassword } from "@/lib/staff-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured on the server." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
    name?: string;
  } | null;
  const password = body?.password ?? "";
  const name = body?.name?.trim() ?? "";
  let cookie = "";
  if (verifyAdminPassword(password)) {
    cookie = adminCookieValue();
  } else {
    const people = await prisma.staffAccount.findMany({ where: { active: true } });
    const matches = people.filter(
      (person) =>
        verifyStaffPassword(password, person.passwordHash) &&
        (!name || person.name === name),
    );
    if (matches.length !== 1) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    cookie = staffCookieValue(matches[0].id, matches[0].role);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
