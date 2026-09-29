import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { nextDocumentNumber } from "@/lib/document-numbers";
import { cleanLines } from "@/lib/crm";

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const customerName = String(body.customerName || "").trim();
  if (!customerName) {
    return NextResponse.json({ ok: false, error: "Customer name is required" }, { status: 400 });
  }
  const lines = cleanLines(body.items);
  const number = await nextDocumentNumber("QTN");
  const quote = await prisma.quote.create({
    data: {
      number,
      customerName,
      email: String(body.email || "").trim().toLowerCase(),
      phone: String(body.phone || "").replace(/\D/g, ""),
      destination: String(body.destination || "").slice(0, 120),
      packageSlug: String(body.packageSlug || "").slice(0, 120),
      travelStart: String(body.travelStart || "").slice(0, 20),
      travelEnd: String(body.travelEnd || "").slice(0, 20),
      travellers: String(body.travellers || "").slice(0, 120),
      itinerary: String(body.itinerary || "").slice(0, 4000),
      currency: String(body.currency || "INR").slice(0, 8),
      discountMinor: Math.max(0, Math.round(Number(body.discountMinor) || 0)),
      paymentTerms: String(body.paymentTerms || "").slice(0, 1000),
      cancellationNotes: String(body.cancellationNotes || "").slice(0, 1000),
      validityDate: String(body.validityDate || "").slice(0, 20),
      notes: String(body.notes || "").slice(0, 2000),
      status: "DRAFT",
      items: {
        create: lines.map((line, index) => ({ ...line, sortOrder: index })),
      },
    },
  });
  return NextResponse.json({ ok: true, id: quote.id, number: quote.number });
}
