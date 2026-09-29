import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { renderBusinessPdf } from "@/lib/pdf-document";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await denyUnlessRole(["ADMIN", "FINANCE"]);
  if (denied) return denied;
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!quote) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const pdf = await renderBusinessPdf({
    kind: "Quote",
    number: quote.number,
    dateLabel: "Valid until",
    dateValue: quote.validityDate,
    status: quote.status,
    customerName: quote.customerName,
    email: quote.email,
    phone: quote.phone,
    destination: quote.destination,
    travelDates: [quote.travelStart, quote.travelEnd].filter(Boolean).join(" – "),
    reference: quote.number,
    currency: quote.currency,
    lines: quote.items,
    headerDiscountMinor: quote.discountMinor,
    notes: [quote.itinerary, quote.notes].filter(Boolean).join("\n"),
    paymentTerms: quote.paymentTerms,
    cancellationNotes: quote.cancellationNotes,
  });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.number}.pdf"`,
    },
  });
}
