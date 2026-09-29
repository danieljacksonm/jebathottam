import { randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { encryptSecret } from "@/lib/token-crypto";

export const OAUTH_STATE_COOKIE = "canaan_oauth_state";

export const OAUTH_APPS = {
  facebook: {
    idEnv: "FACEBOOK_APP_ID",
    secretEnv: "FACEBOOK_APP_SECRET",
  },
  linkedin: {
    idEnv: "LINKEDIN_CLIENT_ID",
    secretEnv: "LINKEDIN_CLIENT_SECRET",
  },
  youtube: {
    idEnv: "GOOGLE_CLIENT_ID",
    secretEnv: "GOOGLE_CLIENT_SECRET",
  },
} as const;

export type OauthPlatform = keyof typeof OAUTH_APPS;

export function isOauthPlatform(value: string): value is OauthPlatform {
  return value === "facebook" || value === "linkedin" || value === "youtube";
}

export function oauthConfigured(platform: OauthPlatform) {
  const app = OAUTH_APPS[platform];
  return Boolean(process.env[app.idEnv]?.trim() && process.env[app.secretEnv]?.trim());
}

export function oauthRedirectUri(platform: OauthPlatform) {
  return `${SITE_URL}/api/admin/social/oauth/${platform}/callback`;
}

export function newOauthState() {
  return randomBytes(16).toString("hex");
}

export function statesMatch(leftValue: string, rightValue: string) {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  if (!left.length || left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function saveConnectedAccount(input: {
  platform: string;
  accountName: string;
  externalId: string;
  token: string;
  permissions: string;
}) {
  const tokenCipher = encryptSecret(input.token);
  const existing = await prisma.socialAccount.findFirst({
    where: { platform: input.platform, externalId: input.externalId },
  });
  const data = {
    accountName: input.accountName.slice(0, 120),
    externalId: input.externalId.slice(0, 120),
    status: "CONNECTED",
    tokenCipher,
    permissions: input.permissions.slice(0, 200),
    lastError: "",
    lastSync: new Date().toISOString(),
  };
  if (existing) {
    await prisma.socialAccount.update({ where: { id: existing.id }, data });
    return existing.id;
  }
  const created = await prisma.socialAccount.create({
    data: { platform: input.platform, ...data },
  });
  return created.id;
}
