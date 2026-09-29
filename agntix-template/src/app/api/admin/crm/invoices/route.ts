import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { nextDocumentNumber } from "@/lib/document-numbers";
import { cleanLines } from "@/lib/crm";
import { companyProfile } from "@/lib/company";

export async function POST(request: Request) {
  const denied = await denyUnlessRole(["ADMIN", "FINANCE"]);
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const customerName = String(body.customerName || "").trim();
  if (!customerName) {
    return NextResponse.json({ ok: false, error: "Customer name is required" }, { status: 400 });
  }
  const lines = cleanLines(body.items);
  const number = await nextDocumentNumber("INV");
  const company = companyProfile();
  const invoice = await prisma.invoice.create({
    data: {
      number,
      customerName,
      email: String(body.email || "").trim().toLowerCase(),
      phone: String(body.phone || "").replace(/\D/g, ""),
      customerAddress: String(body.customerAddress || "").slice(0, 400),
      destination: String(body.destination || "").slice(0, 120),
      reference: String(body.reference || "").slice(0, 40),
      invoiceDate: String(body.invoiceDate || new Date().toISOString().slice(0, 10)),
      dueDate: String(body.dueDate || "").slice(0, 20),
      travelStart: String(body.travelStart || "").slice(0, 20),
      travelEnd: String(body.travelEnd || "").slice(0, 20),
      currency: String(body.currency || "INR").slice(0, 8),
      discountMinor: Math.max(0, Math.round(Number(body.discountMinor) || 0)),
      companyGst: String(body.companyGst || company.gst || "").slice(0, 40),
      paymentTerms: String(body.paymentTerms || "").slice(0, 1000),
      cancellationNotes: String(body.cancellationNotes || "").slice(0, 1000),
      notes: String(body.notes || "").slice(0, 2000),
      status: "DRAFT",
      items: {
        create: lines.map((line, index) => ({ ...line, sortOrder: index })),
      },
    },
  });
  return NextResponse.json({ ok: true, id: invoice.id, number: invoice.number });
}
