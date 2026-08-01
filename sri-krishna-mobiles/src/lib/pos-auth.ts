import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const POS_ROLES = ["admin", "superadmin", "staff", "cashier"];

export async function requirePosSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role || "customer";
  if (!POS_ROLES.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return {
    session,
    userId: session.user.id || "pos-user",
    userName: session.user.name || session.user.email || "Cashier",
  };
}
