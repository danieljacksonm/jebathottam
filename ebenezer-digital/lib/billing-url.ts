import { SAAS_URL } from "./site-url";

/** Base URL for the full Yegova billing app (NestJS + Next on saas host via nginx path split). */
export function billingAppOrigin(): string {
  return (process.env.NEXT_PUBLIC_BILLING_URL || SAAS_URL).replace(/\/$/, "");
}

/** Full URL — use from store, journal, and other hosts. */
export function billingLoginUrl(): string {
  return `${billingAppOrigin()}/login`;
}

export function billingRegisterUrl(): string {
  return `${billingAppOrigin()}/register`;
}

/** Relative paths on saas.ebenezerdigital.com (nginx → yegova-web:3001). */
export const BILLING_LOGIN_PATH = "/login";
export const BILLING_REGISTER_PATH = "/register";
