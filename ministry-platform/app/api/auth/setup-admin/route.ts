import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

/**
 * One-time admin password reset. Only works when SETUP_ADMIN_SECRET is set.
 * Call once to fix "invalid email or password", then remove SETUP_ADMIN_SECRET from .env.
 *
 * POST /api/auth/setup-admin
 * Body: { "secret": "your-SETUP_ADMIN_SECRET-value", "newPassword": "admin123" }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SETUP_ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Setup not enabled. Set SETUP_ADMIN_SECRET in .env to use this endpoint once.' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const providedSecret = typeof body.secret === 'string' ? body.secret : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';

    if (providedSecret !== secret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'newPassword required (min 6 characters)' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(newPassword);

    const result = await query<any>(
      "UPDATE users SET password = ? WHERE LOWER(email) = 'admin@ministry.com'",
      [hashed]
    );

    const affected = (result as any).affectedRows ?? 0;
    if (affected === 0) {
      await query<any>(
        "INSERT INTO users (name, email, password, role) VALUES ('Super Admin', 'admin@ministry.com', ?, 'super_admin')",
        [hashed]
      );
    }

    return NextResponse.json({
      message: affected ? 'Admin password updated. Log in with admin@ministry.com and your new password.' : 'Admin user created. Log in with admin@ministry.com and your new password.',
      hint: 'Remove SETUP_ADMIN_SECRET from .env.production and redeploy for security.',
    });
  } catch (err: any) {
    console.error('Setup admin error:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error' },
      { status: 500 }
    );
  }
}
