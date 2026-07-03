import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, User } from "./db";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return 'build-time-placeholder-not-used-at-runtime';
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev-only-ebenezer-secret';
}

const JWT_EXPIRES_IN = '7d';

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  const payload: AuthToken = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthToken;
  } catch {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  await db.ensureAdminPassword(defaultPassword);

  const user = await db.findUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  const token = generateToken(user);
  return { user, token };
}

// Cookie helpers
export function setAuthCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict${secure}; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAuthCookie(): string {
  return `auth-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
