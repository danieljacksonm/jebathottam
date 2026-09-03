import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const FILE = path.join(process.cwd(), "data", "info-newsletter.json");

type Row = { email: string; at: string; source?: string };

async function readRows(): Promise<Row[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "info-newsletter", 10, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const source = String(body?.source || "unknown").slice(0, 64);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    const rows = await readRows();
    if (!rows.some((r) => r.email === email)) {
      rows.push({ email, at: new Date().toISOString(), source });
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
