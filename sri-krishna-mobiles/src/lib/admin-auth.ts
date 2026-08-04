import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const ADMIN_ROLES = ["admin", "superadmin", "staff", "cashier"];

/** Accept NextAuth staff session OR legacy x-admin-key header. */
export async function requireAdmin(request: Request) {
  const key = request.headers.get("x-admin-key");
  if (key && process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET) {
    return { ok: true as const };
  }

  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "";
  if (session?.user && ADMIN_ROLES.includes(role)) {
    return { ok: true as const, session };
  }

  return {
    ok: false as const,
    error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}
