import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as { notes?: string };
  await prisma.customer.update({
    where: { id },
    data: { notes: String(body.notes || "").slice(0, 4000) },
  });
  return NextResponse.json({ ok: true });
}
