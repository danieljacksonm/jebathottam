import { mkdir, appendFile, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { sendEnquiryNotification } from "@/lib/mail";
import { packageRows, LEGACY_PACKAGE_REDIRECTS } from "@/data/packages";
import { services } from "@/data/services";

type EnquiryBody = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  travelers?: string;
  dates?: string;
  packageId?: string;
  message?: string;
  locale?: string;
  source?: string;
  hotelPreference?: string;
  budget?: string;
  startCity?: string;
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

    const allowedPackageIds = new Set<string>([
      ...packageRows.map((p) => String(p.id)),
      ...Object.keys(LEGACY_PACKAGE_REDIRECTS),
      ...services.map((s) => String(s.slug)),
    ]);

    let packageId = sanitizeSingleLine(body.packageId ?? "");
    if (packageId && LEGACY_PACKAGE_REDIRECTS[packageId]) {
      packageId = LEGACY_PACKAGE_REDIRECTS[packageId];
    }
    if (packageId && !allowedPackageIds.has(packageId) && !packageRows.some((p) => p.id === packageId)) {
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

    const entry = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      name,
      email,
      phone,
      travelers: body.travelers?.trim() || null,
      dates: body.dates?.trim() || null,
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
