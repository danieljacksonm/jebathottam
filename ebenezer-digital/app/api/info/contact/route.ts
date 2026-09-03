import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const FILE = path.join(process.cwd(), "data", "info-contact.json");

type Row = { name: string; email: string; message: string; at: string };

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
  const limited = rateLimit(req, "info-contact", 6, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const name = String(body?.name || "").trim().slice(0, 120);
    const email = String(body?.email || "")
      .trim()
      .toLowerCase()
      .slice(0, 160);
    const message = String(body?.message || "").trim().slice(0, 4000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const rows = await readRows();
    rows.push({ name, email, message, at: new Date().toISOString() });
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
