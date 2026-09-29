import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-auth";
import type { StaffRole } from "@/lib/staff-auth";

export async function denyUnlessAdmin() {
  if (!(await isAdminAuthenticated()) && !(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function denyUnlessRole(allowed: StaffRole[]) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!allowed.includes(session.role)) {
    return NextResponse.json(
      { ok: false, error: "This account cannot perform that action." },
      { status: 403 },
    );
  }
  return null;
}
