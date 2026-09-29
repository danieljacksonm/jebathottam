import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

function secretKey() {
  const secret =
    process.env.SOCIAL_TOKEN_KEY?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "";
  if (!secret) return null;
  return scryptSync(secret, "canaan-social-v1", 32);
}

export function encryptSecret(plain: string) {
  const key = secretKey();
  if (!key) {
    throw new Error(
      "Set SOCIAL_TOKEN_KEY or ADMIN_PASSWORD before storing social credentials.",
    );
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptSecret(payload: string) {
  const key = secretKey();
  if (!key || !payload) return "";
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) return "";
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return plain.toString("utf8");
}
