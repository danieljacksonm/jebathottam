import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { requireRole } from '@/lib/auth';

const ALLOWED_TYPES = ['slider', 'testimony', 'gallery', 'team', 'media', 'general'] as const;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';
    const folder = ALLOWED_TYPES.includes(type as any) ? type : 'general';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    const mime = file.type?.toLowerCase() || '';
    if (!mime.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Use an image (JPEG, PNG, WebP, GIF).' },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || (mime.includes('png') ? '.png' : '.jpg');
    const name = randomBytes(8).toString('hex') + ext;
    const dir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await writeFile(filePath, buffer);
    } catch (writeErr: any) {
      const code = writeErr?.code || '';
      if (code === 'EACCES' || code === 'EROFS' || code === 'READONLY') {
        return NextResponse.json(
          { error: 'Image upload not available on this server. Use an image URL (e.g. from imgur.com or your CDN) instead.' },
          { status: 503 }
        );
      }
      throw writeErr;
    }

    const url = `/api/uploads/${folder}/${name}`;
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload error:', error);
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? 'Please log in again' : (error.message || 'Upload failed') },
      { status }
    );
  }
}
