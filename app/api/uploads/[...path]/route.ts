import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const RESIZEABLE = ['.jpg', '.jpeg', '.png', '.webp'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const segments = (await params).path;
    const safePath = segments.map(s => s.replace(/\.\./g, '')).join('/');
    const filePath = path.join(process.cwd(), 'public', 'uploads', safePath);

    const fileStat = await stat(filePath).catch(() => null);
    if (!fileStat || !fileStat.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const { searchParams } = new URL(request.url);
    const w = searchParams.get('w');
    const q = searchParams.get('q');
    const width = w ? Math.min(2400, Math.max(1, parseInt(w, 10) || 0)) : 0;
    const quality = q ? Math.min(100, Math.max(1, parseInt(q, 10) || 82)) : 82;

    if (width > 0 && RESIZEABLE.includes(ext)) {
      try {
        const buffer = await readFile(filePath);
        let pipeline = sharp(buffer).resize(width, undefined, { withoutEnlargement: true });
        if (ext === '.png') {
          pipeline = pipeline.png({ compressionLevel: 9 });
        } else if (ext === '.webp') {
          pipeline = pipeline.webp({ quality });
        } else {
          pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        }
        const out = await pipeline.toBuffer();
        const outContentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        return new NextResponse(out, {
          headers: {
            'Content-Type': outContentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch (sharpErr) {
        console.warn('Image resize failed, serving original:', sharpErr);
      }
    }

    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
