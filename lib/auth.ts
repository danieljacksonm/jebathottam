import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
  name: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<UserPayload | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth_token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify user still exists
  const users = await query<any[]>(
    'SELECT id, email, role, name FROM users WHERE id = ?',
    [payload.id]
  );

  if (users.length === 0) return null;

  return {
    id: users[0].id,
    email: users[0].email,
    role: users[0].role,
    name: users[0].name,
  };
}

// Middleware to check authentication
export async function requireAuth(request: NextRequest): Promise<{ user: UserPayload } | NextResponse> {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { user };
}

// Middleware to check role
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ user: UserPayload } | NextResponse> {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  return { user };
}
