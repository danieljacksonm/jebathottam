import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function walkImages(dir: string, basePublic: string, acc: string[] = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "_unused") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(full, basePublic, acc);
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      const rel = full
        .slice(basePublic.length)
        .split(path.sep)
        .join("/");
      acc.push(rel.startsWith("/") ? rel : `/${rel}`);
    }
  }
  return acc;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const limit = Math.min(Number(url.searchParams.get("limit") || 120), 400);

  const publicDir = path.join(process.cwd(), "public");
  const roots = [
    path.join(publicDir, "images", "travel"),
    path.join(publicDir, "images", "kodai"),
  ];
  let images: string[] = [];
  for (const root of roots) {
    walkImages(root, publicDir, images);
  }
  images = [...new Set(images)].sort();
  if (q) images = images.filter((src) => src.toLowerCase().includes(q));

  return NextResponse.json({
    total: images.length,
    images: images.slice(0, limit).map((src) => ({
      src,
      name: path.basename(src),
    })),
  });
}
