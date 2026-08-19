import jwt from "jsonwebtoken";

const SAAS_COOKIE_NAME = "saas-auth-token";
const SAAS_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

export interface SaasAuthToken {
  email: string;
  product: "saas";
}

function getSaasJwtSecret(): string {
  const secret = process.env.SAAS_JWT_SECRET;
  if (secret) return secret;
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder-not-used-at-runtime";
  }
  if (process.env.NODE_ENV === "production") {
    console.error("WARNING: SAAS_JWT_SECRET is missing. Set it in .env on the VPS.");
    return "INSECURE-fallback-set-SAAS_JWT_SECRET";
  }
  return "dev-only-ebenezer-saas-secret";
}

function getSaasEmail(): string {
  return (process.env.SAAS_LOGIN_EMAIL || "saas@ebenezerdigital.com").trim().toLowerCase();
}

function getSaasPassword(): string {
  return process.env.SAAS_LOGIN_PASSWORD || "change-me-saas-password";
}

export function authenticateSaasUser(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized === getSaasEmail() && password.trim() === getSaasPassword().trim();
}

export function generateSaasToken(email: string): string {
  const payload: SaasAuthToken = {
    email: email.trim().toLowerCase(),
    product: "saas",
  };
  return jwt.sign(payload, getSaasJwtSecret(), { expiresIn: "7d" });
}

export function verifySaasToken(token: string): SaasAuthToken | null {
  try {
    return jwt.verify(token, getSaasJwtSecret()) as SaasAuthToken;
  } catch {
    return null;
  }
}

export function getSaasCookieName(): string {
  return SAAS_COOKIE_NAME;
}

export function setSaasAuthCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SAAS_COOKIE_NAME}=${token}; Path=/saas; HttpOnly; SameSite=Lax${secure}; Max-Age=${SAAS_EXPIRES_SECONDS}`;
}

export function clearSaasAuthCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SAAS_COOKIE_NAME}=; Path=/saas; HttpOnly; SameSite=Lax${secure}; Max-Age=0`;
}
