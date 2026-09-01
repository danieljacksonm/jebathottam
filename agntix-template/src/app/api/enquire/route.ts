import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { sendEnquiryNotification } from "@/lib/mail";

type EnquiryBody = {
  name?: string;
  email?: string;
  phone?: string;
  travelers?: string;
  dates?: string;
  packageId?: string;
  message?: string;
  locale?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnquiryBody;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const entry = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      name,
      email,
      phone,
      travelers: body.travelers?.trim() || null,
      dates: body.dates?.trim() || null,
      packageId: body.packageId?.trim() || null,
      message: body.message?.trim() || null,
      locale: body.locale || "en",
    };

    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "enquiries.jsonl"),
      `${JSON.stringify(entry)}\n`,
      "utf8",
    );

    try {
      await sendEnquiryNotification(entry);
    } catch (error) {
      console.error("Enquiry email failed:", error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save enquiry" },
      { status: 500 },
    );
  }
}
