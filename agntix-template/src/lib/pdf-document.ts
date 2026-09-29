import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { companyProfile } from "@/lib/company";
import { formatMoney, lineTotal, summarize, type LineInput } from "@/lib/money";

type PdfDocInput = {
  kind: "Invoice" | "Quote";
  number: string;
  dateLabel: string;
  dateValue: string;
  status: string;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  destination?: string;
  travelDates?: string;
  reference?: string;
  currency: string;
  lines: LineInput[];
  headerDiscountMinor: number;
  paidMinor?: number;
  notes?: string;
  paymentTerms?: string;
  cancellationNotes?: string;
  gst?: string;
};

export async function renderBusinessPdf(input: PdfDocInput) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const company = companyProfile();
  const gold = rgb(0.72, 0.55, 0.22);
  const ink = rgb(0.08, 0.1, 0.14);
  const mute = rgb(0.35, 0.38, 0.42);

  let y = 800;
  try {
    const logo = await readFile(
      path.join(process.cwd(), "public", "brand", "canaan-logo.jpeg"),
    );
    const image = await pdf.embedJpg(logo);
    page.drawImage(image, { x: 48, y: y - 36, width: 42, height: 42 });
  } catch {
    // Logo is optional if the file is missing.
  }

  page.drawText(company.name, {
    x: 100,
    y: y - 8,
    size: 16,
    font: bold,
    color: ink,
  });
  const companyLines = [company.address, company.email, company.phone].filter(
    Boolean,
  );
  companyLines.forEach((line, index) => {
    page.drawText(line, {
      x: 100,
      y: y - 24 - index * 12,
      size: 9,
      font,
      color: mute,
    });
  });
  const gst = input.gst?.trim() || company.gst;
  if (gst) {
    page.drawText(`GST: ${gst}`, {
      x: 100,
      y: y - 24 - companyLines.length * 12,
      size: 9,
      font,
      color: mute,
    });
  }

  page.drawText(input.kind.toUpperCase(), {
    x: 430,
    y: y - 6,
    size: 14,
    font: bold,
    color: gold,
  });
  page.drawText(input.number, {
    x: 430,
    y: y - 24,
    size: 11,
    font: bold,
    color: ink,
  });
  page.drawText(`${input.dateLabel}: ${input.dateValue || "—"}`, {
    x: 430,
    y: y - 40,
    size: 9,
    font,
    color: mute,
  });
  page.drawText(`Status: ${input.status}`, {
    x: 430,
    y: y - 54,
    size: 9,
    font,
    color: mute,
  });

  y = 700;
  page.drawText("Bill to", { x: 48, y, size: 9, font: bold, color: gold });
  const bill = [
    input.customerName,
    input.address || "",
    input.email,
    input.phone,
    input.destination ? `Destination: ${input.destination}` : "",
    input.travelDates ? `Travel: ${input.travelDates}` : "",
    input.reference ? `Reference: ${input.reference}` : "",
  ].filter(Boolean);
  bill.forEach((line, index) => {
    page.drawText(line.slice(0, 90), {
      x: 48,
      y: y - 16 - index * 13,
      size: 10,
      font: index === 0 ? bold : font,
      color: ink,
    });
  });

  y = 560;
  page.drawRectangle({
    x: 48,
    y: y - 6,
    width: 500,
    height: 22,
    color: rgb(0.95, 0.93, 0.88),
  });
  const headers = ["Description", "Qty", "Rate", "Total"];
  const xs = [52, 340, 400, 470];
  headers.forEach((header, index) => {
    page.drawText(header, { x: xs[index], y, size: 9, font: bold, color: ink });
  });

  y -= 22;
  for (const line of input.lines.slice(0, 16)) {
    page.drawText(line.description.slice(0, 52), {
      x: 52,
      y,
      size: 9,
      font,
      color: ink,
    });
    page.drawText(String(line.quantity), { x: 340, y, size: 9, font, color: ink });
    page.drawText(formatMoney(line.unitMinor, input.currency), {
      x: 390,
      y,
      size: 9,
      font,
      color: ink,
    });
    page.drawText(formatMoney(lineTotal(line), input.currency), {
      x: 460,
      y,
      size: 9,
      font,
      color: ink,
    });
    y -= 16;
  }

  const summary = summarize(input.lines, input.headerDiscountMinor);
  y -= 10;
  const rows: [string, string][] = [
    ["Subtotal", formatMoney(summary.subtotalMinor, input.currency)],
    ["Discount", formatMoney(summary.discountMinor, input.currency)],
    ["Tax", formatMoney(summary.taxMinor, input.currency)],
    ["Grand total", formatMoney(summary.totalMinor, input.currency)],
  ];
  if (typeof input.paidMinor === "number") {
    rows.push(["Amount paid", formatMoney(input.paidMinor, input.currency)]);
    rows.push([
      "Balance due",
      formatMoney(summary.totalMinor - input.paidMinor, input.currency),
    ]);
  }
  for (const [label, value] of rows) {
    page.drawText(label, { x: 360, y, size: 9, font: bold, color: ink });
    page.drawText(value, { x: 450, y, size: 9, font, color: ink });
    y -= 14;
  }

  y -= 16;
  const extras = [
    input.paymentTerms ? `Payment terms: ${input.paymentTerms}` : "",
    input.cancellationNotes ? `Cancellation: ${input.cancellationNotes}` : "",
    input.notes ? `Notes: ${input.notes}` : "",
  ].filter(Boolean);
  for (const extra of extras) {
    const chunks = extra.match(/.{1,95}/g) || [];
    for (const chunk of chunks.slice(0, 4)) {
      page.drawText(chunk, { x: 48, y, size: 8, font, color: mute });
      y -= 11;
    }
  }

  page.drawText("Canaan Travel Hub — amounts are those recorded on this document.", {
    x: 48,
    y: 36,
    size: 8,
    font,
    color: mute,
  });

  return Buffer.from(await pdf.save());
}
