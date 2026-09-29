import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { syncInvoiceStatus } from "@/lib/crm";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const amountMinor = Math.round(Number(body.amountMinor) || 0);
  if (amountMinor <= 0) {
    return NextResponse.json({ ok: false, error: "Payment amount must be greater than zero" }, { status: 400 });
  }
  await prisma.invoicePayment.create({
    data: {
      invoiceId: id,
      amountMinor,
      paidOn: String(body.paidOn || new Date().toISOString().slice(0, 10)).slice(0, 20),
      method: String(body.method || "").slice(0, 40),
      reference: String(body.reference || "").slice(0, 80),
      notes: String(body.notes || "").slice(0, 400),
    },
  });
  if (invoice.status === "DRAFT" || invoice.status === "CANCELLED") {
    await prisma.invoice.update({ where: { id }, data: { status: "SENT" } });
  }
  const totals = await syncInvoiceStatus(id);
  return NextResponse.json({
    ok: true,
    status: totals?.invoice.status,
    balanceMinor: totals?.balanceMinor,
    paidMinor: totals?.paidMinor,
  });
}
