import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { STAFF_ROLES, hashStaffPassword, type StaffRole } from "@/lib/staff-auth";

export async function GET() {
  const denied = await denyUnlessRole(["ADMIN"]);
  if (denied) return denied;
  const people = await prisma.staffAccount.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json({ people });
}

export async function POST(request: Request) {
  const denied = await denyUnlessRole(["ADMIN"]);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    role?: string;
    password?: string;
  } | null;
  const name = body?.name?.trim() ?? "";
  const role = body?.role ?? "";
  const password = body?.password ?? "";
  if (!name || name.length > 80) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!STAFF_ROLES.includes(role as StaffRole)) {
    return NextResponse.json({ ok: false, error: "Choose a staff role." }, { status: 400 });
  }
  if (password.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Use a password of at least 10 characters." },
      { status: 400 },
    );
  }
  const person = await prisma.staffAccount.create({
    data: {
      name,
      role,
      passwordHash: hashStaffPassword(password),
    },
  });
  return NextResponse.json({ ok: true, id: person.id, name: person.name, role: person.role });
}
