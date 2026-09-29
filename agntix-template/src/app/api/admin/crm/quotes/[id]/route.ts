import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { QUOTE_STATUSES, cleanLines, createInvoiceFromQuote } from "@/lib/crm";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const status = String(body.status || quote.status);
  if (!QUOTE_STATUSES.includes(status as (typeof QUOTE_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const lines = body.items ? cleanLines(body.items) : null;
  await prisma.quote.update({
    where: { id },
    data: {
      status,
      customerName: String(body.customerName || quote.customerName).slice(0, 120),
      email: String(body.email ?? quote.email).trim().toLowerCase(),
      phone: String(body.phone ?? quote.phone).replace(/\D/g, ""),
      destination: String(body.destination ?? quote.destination).slice(0, 120),
      packageSlug: String(body.packageSlug ?? quote.packageSlug).slice(0, 120),
      travelStart: String(body.travelStart ?? quote.travelStart).slice(0, 20),
      travelEnd: String(body.travelEnd ?? quote.travelEnd).slice(0, 20),
      travellers: String(body.travellers ?? quote.travellers).slice(0, 120),
      itinerary: String(body.itinerary ?? quote.itinerary).slice(0, 4000),
      currency: String(body.currency || quote.currency).slice(0, 8),
      discountMinor: Math.max(0, Math.round(Number(body.discountMinor ?? quote.discountMinor) || 0)),
      paymentTerms: String(body.paymentTerms ?? quote.paymentTerms).slice(0, 1000),
      cancellationNotes: String(body.cancellationNotes ?? quote.cancellationNotes).slice(0, 1000),
      validityDate: String(body.validityDate ?? quote.validityDate).slice(0, 20),
      notes: String(body.notes ?? quote.notes).slice(0, 2000),
    },
  });

  if (lines) {
    await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
    if (lines.length) {
      await prisma.quoteItem.createMany({
        data: lines.map((line, index) => ({ ...line, quoteId: id, sortOrder: index })),
      });
    }
  }

  let invoiceId: string | null = null;
  if (body.createInvoice) {
    const invoice = await createInvoiceFromQuote(id);
    invoiceId = invoice?.id ?? null;
  }

  return NextResponse.json({ ok: true, invoiceId });
}
