import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { ENQUIRY_STATUSES, createQuoteFromEnquiry } from "@/lib/crm";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await denyUnlessRole(["ADMIN", "EDITOR", "FINANCE"]);
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as {
    status?: string;
    priority?: string;
    nextFollowUp?: string;
    assignedAdmin?: string;
    note?: string;
    noteKind?: string;
    createQuote?: boolean;
  };

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const data: Record<string, string> = {};
  if (body.status && ENQUIRY_STATUSES.includes(body.status as (typeof ENQUIRY_STATUSES)[number])) {
    data.status = body.status;
  }
  if (typeof body.priority === "string") data.priority = body.priority.slice(0, 20);
  if (typeof body.nextFollowUp === "string") data.nextFollowUp = body.nextFollowUp.slice(0, 20);
  if (typeof body.assignedAdmin === "string") {
    data.assignedAdmin = body.assignedAdmin.slice(0, 80);
  }

  if (Object.keys(data).length) {
    await prisma.enquiry.update({ where: { id }, data });
  }

  if (body.status && body.status !== enquiry.status) {
    await prisma.enquiryActivity.create({
      data: {
        enquiryId: id,
        kind: "status",
        body: `Status changed from ${enquiry.status} to ${body.status}.`,
      },
    });
  }

  if (body.note?.trim()) {
    const kind = ["note", "call", "whatsapp", "email", "reminder"].includes(
      body.noteKind || "",
    )
      ? body.noteKind!
      : "note";
    await prisma.enquiryActivity.create({
      data: {
        enquiryId: id,
        kind,
        body: body.note.trim().slice(0, 2000),
      },
    });
  }

  let quoteId: string | null = null;
  if (body.createQuote) {
    const quote = await createQuoteFromEnquiry(id);
    quoteId = quote?.id ?? null;
  }

  return NextResponse.json({ ok: true, quoteId });
}
