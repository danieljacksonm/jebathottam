import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

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

// Get current user from request (alias for route handlers)
export async function getCurrentUser(request: NextRequest): Promise<UserPayload | null> {
  return getUserFromRequest(request);
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<UserPayload | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth_token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true, name: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
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
  
  if (user.role !== 'super_admin' && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  return { user };
}

// Middleware to check specific permission on a resource
export async function requirePermission(
  request: NextRequest,
  resource: string,
  permission: 'create' | 'read' | 'update' | 'delete'
): Promise<{ user: UserPayload } | NextResponse> {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  
  // Import permissions dynamically to avoid circular dependency
  const { hasPermission } = await import('./permissions');
  const allowed = await hasPermission(user, resource as any, permission);
  
  if (!allowed) {
    return NextResponse.json(
      { error: `Forbidden - You don't have ${permission} permission for ${resource}` },
      { status: 403 }
    );
  }

  return { user };
}
