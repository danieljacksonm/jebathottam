import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword, generateToken } from '@/lib/auth';
import { query } from '@/lib/db';

/**
 * Public self-registration is disabled.
 * Only super_admin can create visitor accounts (invite-only).
 */
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['super_admin']);
  if (authResult instanceof NextResponse) {
    return NextResponse.json(
      { error: 'Public registration is disabled. Contact the ministry admin.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const role = body.role === 'media_team' || body.role === 'ministry_member' || body.role === 'visitor'
      ? body.role
      : 'visitor';

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existing = await query<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const result = await query<any>(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = (result as any).insertId;

    return NextResponse.json({
      user: { id: userId, email, role, name },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
