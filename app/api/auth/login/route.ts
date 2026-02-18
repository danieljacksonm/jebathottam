import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let users: any[];
    try {
      users = await query<any[]>(
        'SELECT id, email, password, role, name FROM users WHERE LOWER(email) = LOWER(?)',
        [email]
      );
    } catch (dbError: any) {
      console.error('Login DB error:', dbError);
      const isDev = process.env.NODE_ENV !== 'production';
      const msg = dbError?.message || String(dbError);
      const hint = isDev
        ? ` Database error: ${msg}. Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT (default 3306), and DB_SSL (use false for IONOS).`
        : ' Check your server configuration and environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).';
      return NextResponse.json(
        { error: 'Database connection failed.' + hint },
        { status: 503 }
      );
    }

    const list = Array.isArray(users) ? users : [];
    if (list.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = list[0];
    const hash = user.password;
    if (!hash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    let isValid: boolean;
    try {
      isValid = await verifyPassword(password, hash);
    } catch (verifyErr) {
      console.error('Login verify error:', verifyErr);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || '',
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || '',
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
