import { jwtVerify } from 'jose';

function getEdgeSecret(): Uint8Array | null {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === 'production'
      ? ''
      : 'dev-only-secret-change-before-production');
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export type EdgeAuthResult = {
  valid: boolean;
  role?: string;
  id?: number;
};

/** Cryptographically verify JWT for Edge middleware. */
export async function verifyAuthToken(
  token: string | undefined
): Promise<EdgeAuthResult> {
  if (!token) return { valid: false };
  const secret = getEdgeSecret();
  if (!secret) return { valid: false };
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = typeof payload.role === 'string' ? payload.role : undefined;
    const id = typeof payload.id === 'number' ? payload.id : undefined;
    return { valid: true, role, id };
  } catch {
    return { valid: false };
  }
}

/** @deprecated Use verifyAuthToken — unsigned structure checks are insecure. */
export function isAuthTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    ) as { exp?: number };
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}
