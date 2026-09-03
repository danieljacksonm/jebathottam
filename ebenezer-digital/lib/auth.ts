import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, User } from "./db";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret && secret.length >= 16 && !secret.startsWith("INSECURE-")) return secret;
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder-not-used-at-runtime";
  }
  if (process.env.NODE_ENV === "production") {
    console.error(
      "CRITICAL: JWT_SECRET is missing or weak. Set a strong JWT_SECRET (>=16 chars) in .env."
    );
    // Distinct per-process value so forged tokens with a known fallback string fail;
    // sessions reset on restart until JWT_SECRET is configured.
    return `missing-jwt-secret-${process.pid}-${Date.now()}`;
  }
  return "dev-only-ebenezer-secret";
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
  const configured = process.env.ADMIN_DEFAULT_PASSWORD?.trim();
  if (process.env.NODE_ENV === "production" && !configured) {
    console.error(
      "CRITICAL: ADMIN_DEFAULT_PASSWORD is not set. Refusing default admin password bootstrap."
    );
  } else {
    const defaultPassword = configured || "admin123";
    const forceReset = process.env.ADMIN_FORCE_PASSWORD_RESET === "1";
    await db.ensureAdminPassword(defaultPassword, forceReset);
  }

  const user = await db.findUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password.trim(), user.password);
  if (!isValid) return null;

  const token = generateToken(user);
  return { user, token };
}

// Cookie helpers
export function setAuthCookie(token: string): string {
  // SameSite=Lax works better behind HTTPS reverse proxy than Strict
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAuthCookie(): string {
  return `auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}
