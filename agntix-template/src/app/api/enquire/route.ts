import { mkdir, appendFile, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { sendEnquiryNotification } from "@/lib/mail";
import { saveEnquiry } from "@/lib/save-enquiry";
import { getPackageRows, LEGACY_PACKAGE_REDIRECTS } from "@/data/packages";
import { services } from "@/data/services";

type EnquiryBody = {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  website?: string;
  travelers?: string;
  dates?: string;
  packageId?: string;
  message?: string;
  locale?: string;
  source?: string;
  sourcePage?: string;
  hotelPreference?: string;
  budget?: string;
  startCity?: string;
  destination?: string;
  departureLocation?: string;
  service?: string;
  services?: string[];
  travelType?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  infants?: number;
  currency?: string;
  transportPreference?: string;
  specialRequirements?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

function sanitizeSingleLine(value: string) {
  // Prevent header injection / weird formatting in emails.
  return value.replace(/[\r\n]+/g, " ").trim();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function isValidEmail(value: string) {
  // Practical email validation (not perfect, but blocks obvious junk).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength && contentLength > 10_000) {
      return NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 },
      );
    }

    const body = (await request.json()) as EnquiryBody;

    const honeypot = body.website?.trim();
    if (honeypot) {
      return NextResponse.json(
        { ok: false, error: "Spam detected" },
        { status: 400 },
      );
    }

    const name = sanitizeSingleLine(body.name ?? "");
    const email = sanitizeSingleLine(body.email ?? "");
    const phone = normalizePhone(sanitizeSingleLine(body.phone ?? ""));
    const message = sanitizeSingleLine(body.message ?? "");

    const packageRows = await getPackageRows();
    const allowedPackageIds = new Set<string>([
      ...packageRows.map((p) => String(p.id)),
      ...Object.keys(LEGACY_PACKAGE_REDIRECTS),
      ...services.map((s) => String(s.slug)),
      "trains",
      "consulting",
      "corporate",
      "tours",
      "flights",
      "hotels",
      "visa",
    ]);

    let packageId = sanitizeSingleLine(body.packageId ?? "");
    if (packageId && LEGACY_PACKAGE_REDIRECTS[packageId]) {
      packageId = LEGACY_PACKAGE_REDIRECTS[packageId];
    }
    if (
      packageId &&
      !allowedPackageIds.has(packageId) &&
      !packageRows.some((p) => p.id === packageId)
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid package selection" },
        { status: 400 },
      );
    }

    const MAX_NAME = 80;
    const MAX_MESSAGE = 2000;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (name.length > MAX_NAME) {
      return NextResponse.json(
        { ok: false, error: "Name is too long" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 },
      );
    }

    if (phone.length < 10 || phone.length > 15) {
      return NextResponse.json(
        { ok: false, error: "Invalid phone number" },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { ok: false, error: "Message is too long" },
        { status: 400 },
      );
    }

    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });

    // Simple file-based rate limiting (per IP).
    const ipHeader = request.headers.get("x-forwarded-for");
    const ip =
      ipHeader?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateFile = path.join(dir, "enquire-rate.json");
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 5;
    const now = Date.now();

    let rate: Record<string, { windowStart: number; count: number }> = {};
    try {
      const raw = await readFile(rateFile, "utf8");
      rate = JSON.parse(raw);
    } catch {
      // ignore missing/corrupt file
    }

    const entryRate = rate[ip] ?? { windowStart: now, count: 0 };
    if (now - entryRate.windowStart > windowMs) {
      entryRate.windowStart = now;
      entryRate.count = 0;
    }
    entryRate.count += 1;
    rate[ip] = entryRate;

    if (entryRate.count > maxRequests) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Try again later." },
        { status: 429 },
      );
    }

    await writeFile(rateFile, JSON.stringify(rate), "utf8");

    const allowedSources = new Set([
      "enquire",
      "plan-your-trip",
      "contact",
      "homepage",
      "destination",
      "package",
      "blog",
      "service",
      "corporate",
    ]);
    const sourceRaw = sanitizeSingleLine(body.source ?? "enquire");
    const source = allowedSources.has(sourceRaw) ? sourceRaw : "enquire";

    const hotelPreference = sanitizeSingleLine(body.hotelPreference ?? "").slice(
      0,
      40,
    );
    const budget = sanitizeSingleLine(body.budget ?? "").slice(0, 80);
    const startCity = sanitizeSingleLine(body.startCity ?? "").slice(0, 80);

    const travelers = body.travelers?.trim() || "";
    const adultMatch = travelers.match(/(\d+)\s*adult/i);
    const childMatch = travelers.match(/(\d+)\s*child/i);
    const selectedServices = Array.isArray(body.services)
      ? body.services.map((item) => sanitizeSingleLine(String(item))).filter(Boolean)
      : [];
    const serviceValue = sanitizeSingleLine(body.service ?? selectedServices.join(", "));

    const saved = await saveEnquiry({
      name,
      email,
      phone,
      whatsapp: sanitizeSingleLine(body.whatsapp ?? ""),
      country: sanitizeSingleLine(body.country ?? ""),
      destination: sanitizeSingleLine(body.destination ?? ""),
      departureLocation:
        sanitizeSingleLine(body.departureLocation ?? "") || startCity,
      packageSlug: packageId,
      service: serviceValue,
      travelType: sanitizeSingleLine(body.travelType ?? ""),
      travelStartDate: sanitizeSingleLine(body.travelStartDate ?? body.dates ?? ""),
      travelEndDate: sanitizeSingleLine(body.travelEndDate ?? ""),
      flexibleDates: Boolean(body.flexibleDates),
      adults: Number(body.adults) || (adultMatch ? Number(adultMatch[1]) : 1),
      children: Number(body.children) || (childMatch ? Number(childMatch[1]) : 0),
      infants: Number(body.infants) || 0,
      budgetRange: budget,
      currency: sanitizeSingleLine(body.currency ?? "INR"),
      hotelPreference,
      transportPreference: sanitizeSingleLine(body.transportPreference ?? ""),
      specialRequirements: sanitizeSingleLine(body.specialRequirements ?? ""),
      message,
      source,
      sourcePage: sanitizeSingleLine(body.sourcePage ?? ""),
      locale: body.locale || "en",
      utmSource: sanitizeSingleLine(body.utmSource ?? ""),
      utmMedium: sanitizeSingleLine(body.utmMedium ?? ""),
      utmCampaign: sanitizeSingleLine(body.utmCampaign ?? ""),
      utmContent: sanitizeSingleLine(body.utmContent ?? ""),
    });

    const entry = {
      id: saved.referenceNumber,
      receivedAt: saved.createdAt.toISOString(),
      name,
      email,
      phone,
      travelers: travelers || null,
      dates: body.dates?.trim() || body.travelStartDate || null,
      packageId: packageId || null,
      message: message || null,
      locale: body.locale || "en",
      source,
      hotelPreference: hotelPreference || null,
      budget: budget || null,
      startCity: startCity || null,
    };

    await appendFile(
      path.join(dir, "enquiries.jsonl"),
      `${JSON.stringify(entry)}\n`,
      "utf8",
    );

    let emailStatus = "not_sent";
    try {
      const mailed = await sendEnquiryNotification(entry);
      emailStatus = mailed.sent ? "sent" : mailed.reason || "not_sent";
    } catch (error) {
      console.error("Enquiry email failed:", error);
      emailStatus = "failed";
    }

    const { prisma } = await import("@/lib/prisma");
    await prisma.enquiry.update({
      where: { id: saved.id },
      data: { emailStatus },
    });

    return NextResponse.json({ ok: true, referenceNumber: saved.referenceNumber });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save enquiry" },
      { status: 500 },
    );
  }
}
