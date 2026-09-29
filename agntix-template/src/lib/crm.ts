import { prisma } from "@/lib/prisma";
import { nextDocumentNumber } from "@/lib/document-numbers";
import { lineTotal, summarize, type LineInput } from "@/lib/money";

export const ENQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTE_SENT",
  "FOLLOW_UP",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "LOST",
] as const;

export const QUOTE_STATUSES = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
] as const;

export const INVOICE_STATUSES = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

export async function findOrCreateCustomer(input: {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.replace(/\D/g, "");
  const whatsapp = (input.whatsapp || "").replace(/\D/g, "");
  let customer = email
    ? await prisma.customer.findFirst({ where: { email } })
    : null;
  if (!customer && phone) {
    customer = await prisma.customer.findFirst({ where: { phone } });
  }
  if (!customer) {
    return prisma.customer.create({
      data: {
        name: input.name,
        email,
        phone,
        whatsapp,
        country: input.country?.trim() || "",
      },
    });
  }
  return prisma.customer.update({
    where: { id: customer.id },
    data: {
      name: customer.name || input.name,
      whatsapp: customer.whatsapp || whatsapp,
      country: customer.country || input.country?.trim() || "",
      phone: customer.phone || phone,
      email: customer.email || email,
    },
  });
}

export function cleanLines(raw: unknown): LineInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        description: String(item.description || "").trim().slice(0, 400),
        quantity: Math.max(1, Number(item.quantity) || 1),
        unitMinor: Math.max(0, Math.round(Number(item.unitMinor) || 0)),
        discountMinor: Math.max(0, Math.round(Number(item.discountMinor) || 0)),
        taxMinor: Math.max(0, Math.round(Number(item.taxMinor) || 0)),
      };
    })
    .filter((line) => line.description);
}

export async function createQuoteFromEnquiry(enquiryId: string) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: { quotes: { include: { invoice: true } } },
  });
  if (!enquiry) return null;
  const number = await nextDocumentNumber("QTN");
  const travellers = [
    `${enquiry.adults} adults`,
    enquiry.children ? `${enquiry.children} children` : "",
    enquiry.infants ? `${enquiry.infants} infants` : "",
  ]
    .filter(Boolean)
    .join(", ");
  const quote = await prisma.quote.create({
    data: {
      number,
      enquiryId: enquiry.id,
      customerId: enquiry.customerId,
      customerName: enquiry.customerName,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      packageSlug: enquiry.packageSlug,
      travelStart: enquiry.travelStartDate,
      travelEnd: enquiry.travelEndDate,
      travellers,
      currency: enquiry.currency || "INR",
      notes: enquiry.message,
      items: {
        create: [
          {
            description: enquiry.packageSlug
              ? `Travel arrangement — ${enquiry.packageSlug}`
              : enquiry.destination
                ? `Travel arrangement — ${enquiry.destination}`
                : "Travel arrangement",
            quantity: 1,
            unitMinor: 0,
            sortOrder: 0,
          },
        ],
      },
    },
    include: { items: true },
  });
  await prisma.enquiryActivity.create({
    data: {
      enquiryId: enquiry.id,
      kind: "status",
      body: `Quote ${number} created as draft.`,
    },
  });
  return quote;
}

export async function invoiceTotals(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, payments: true },
  });
  if (!invoice) return null;
  const lines = invoice.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitMinor: item.unitMinor,
    discountMinor: item.discountMinor,
    taxMinor: item.taxMinor,
  }));
  const summary = summarize(lines, invoice.discountMinor);
  const paidMinor = invoice.payments.reduce(
    (sum, payment) => sum + payment.amountMinor,
    0,
  );
  const balanceMinor = summary.totalMinor - paidMinor;
  return { invoice, ...summary, paidMinor, balanceMinor, lines };
}

export async function syncInvoiceStatus(invoiceId: string) {
  const totals = await invoiceTotals(invoiceId);
  if (!totals) return null;
  const { invoice, balanceMinor, paidMinor, totalMinor } = totals;
  if (invoice.status === "CANCELLED" || invoice.status === "DRAFT") {
    return totals;
  }
  let status = invoice.status;
  if (totalMinor > 0 && balanceMinor <= 0) status = "PAID";
  else if (paidMinor > 0) status = "PARTIALLY_PAID";
  else if (invoice.dueDate && invoice.dueDate < todayIso()) status = "OVERDUE";
  else status = "SENT";
  if (status !== invoice.status) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });
  }
  return { ...totals, invoice: { ...invoice, status } };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function createInvoiceFromQuote(quoteId: string) {
  const existing = await prisma.invoice.findUnique({ where: { quoteId } });
  if (existing) return existing;
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: { orderBy: { sortOrder: "asc" } }, enquiry: true },
  });
  if (!quote) return null;
  const number = await nextDocumentNumber("INV");
  const invoice = await prisma.invoice.create({
    data: {
      number,
      quoteId: quote.id,
      customerId: quote.customerId,
      status: "DRAFT",
      customerName: quote.customerName,
      email: quote.email,
      phone: quote.phone,
      destination: quote.destination,
      reference: quote.enquiry?.referenceNumber || quote.number,
      invoiceDate: todayIso(),
      travelStart: quote.travelStart,
      travelEnd: quote.travelEnd,
      currency: quote.currency,
      discountMinor: quote.discountMinor,
      paymentTerms: quote.paymentTerms,
      cancellationNotes: quote.cancellationNotes,
      notes: quote.notes,
      items: {
        create: quote.items.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unitMinor: item.unitMinor,
          discountMinor: item.discountMinor,
          taxMinor: item.taxMinor,
          sortOrder: index,
        })),
      },
    },
  });
  if (quote.enquiryId) {
    await prisma.enquiryActivity.create({
      data: {
        enquiryId: quote.enquiryId,
        kind: "status",
        body: `Invoice ${number} created from quote ${quote.number}.`,
      },
    });
  }
  return invoice;
}

export { lineTotal };
