import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { invoiceTotals } from "@/lib/crm";
import { renderBusinessPdf } from "@/lib/pdf-document";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { id } = await params;
  const totals = await invoiceTotals(id);
  if (!totals) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const invoice = totals.invoice;
  const pdf = await renderBusinessPdf({
    kind: "Invoice",
    number: invoice.number,
    dateLabel: "Invoice date",
    dateValue: invoice.invoiceDate,
    status: invoice.status,
    customerName: invoice.customerName,
    email: invoice.email,
    phone: invoice.phone,
    address: invoice.customerAddress,
    destination: invoice.destination,
    travelDates: [invoice.travelStart, invoice.travelEnd].filter(Boolean).join(" – "),
    reference: invoice.reference,
    currency: invoice.currency,
    lines: invoice.items,
    headerDiscountMinor: invoice.discountMinor,
    paidMinor: totals.paidMinor,
    notes: invoice.notes,
    paymentTerms: invoice.paymentTerms,
    cancellationNotes: invoice.cancellationNotes,
    gst: invoice.companyGst,
  });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
    },
  });
}
