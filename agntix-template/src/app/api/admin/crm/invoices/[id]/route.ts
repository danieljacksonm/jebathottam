import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { INVOICE_STATUSES, cleanLines, syncInvoiceStatus } from "@/lib/crm";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await denyUnlessRole(["ADMIN", "FINANCE"]);
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const requested = String(body.status || invoice.status);
  if (!INVOICE_STATUSES.includes(requested as (typeof INVOICE_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const lines = body.items ? cleanLines(body.items) : null;
  await prisma.invoice.update({
    where: { id },
    data: {
      status: requested,
      customerName: String(body.customerName || invoice.customerName).slice(0, 120),
      email: String(body.email ?? invoice.email).trim().toLowerCase(),
      phone: String(body.phone ?? invoice.phone).replace(/\D/g, ""),
      customerAddress: String(body.customerAddress ?? invoice.customerAddress).slice(0, 400),
      destination: String(body.destination ?? invoice.destination).slice(0, 120),
      reference: String(body.reference ?? invoice.reference).slice(0, 40),
      invoiceDate: String(body.invoiceDate || invoice.invoiceDate).slice(0, 20),
      dueDate: String(body.dueDate ?? invoice.dueDate).slice(0, 20),
      travelStart: String(body.travelStart ?? invoice.travelStart).slice(0, 20),
      travelEnd: String(body.travelEnd ?? invoice.travelEnd).slice(0, 20),
      currency: String(body.currency || invoice.currency).slice(0, 8),
      discountMinor: Math.max(0, Math.round(Number(body.discountMinor ?? invoice.discountMinor) || 0)),
      companyGst: String(body.companyGst ?? invoice.companyGst).slice(0, 40),
      paymentTerms: String(body.paymentTerms ?? invoice.paymentTerms).slice(0, 1000),
      cancellationNotes: String(body.cancellationNotes ?? invoice.cancellationNotes).slice(0, 1000),
      notes: String(body.notes ?? invoice.notes).slice(0, 2000),
    },
  });

  if (lines) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    if (lines.length) {
      await prisma.invoiceItem.createMany({
        data: lines.map((line, index) => ({ ...line, invoiceId: id, sortOrder: index })),
      });
    }
  }

  const totals = await syncInvoiceStatus(id);
  return NextResponse.json({
    ok: true,
    status: totals?.invoice.status,
    balanceMinor: totals?.balanceMinor,
    paidMinor: totals?.paidMinor,
    totalMinor: totals?.totalMinor,
  });
}
