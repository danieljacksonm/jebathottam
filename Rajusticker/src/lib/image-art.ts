/**
 * Art direction for Raju Stickers product imagery.
 *
 * All assets: 1024×1536 (2:3) dense marketing posters.
 * Car photography sits in the UPPER band (~8%–42% from top).
 * Lower 55%+ is rolls, icons, specs — never use as the focal.
 *
 * Placement rule:
 * - Prefer object-position framing over aggressive transform zoom
 * - Landscape stages naturally reveal the car band
 * - Use mild scale only when the stage is still too tall
 */

export type MediaKind =
  | "hero"
  | "editorial"
  | "product"
  | "poster"
  | "lifestyle"
  | "banner"
  | "category";

export type FocalKey =
  | "chrome-gold"
  | "holographic-carbon"
  | "gloss-white"
  | "nardo-blue"
  | "carbon-fiber"
  | "chrome-silver"
  | "chrome-red"
  | "nardo-blue-metallic"
  | "metallic-red-matte"
  | "iridescent-matte"
  | "metallic-blue";

/**
 * object-position aimed at the car body (not headlight macro, not poster footer).
 * X% = horizontal bias of the car · Y% = vertical center of the car band.
 */
export const FOCAL: Record<FocalKey, string> = {
  "chrome-gold": "52% 22%",
  "holographic-carbon": "68% 24%",
  "gloss-white": "58% 24%",
  "nardo-blue": "55% 22%",
  "carbon-fiber": "62% 24%",
  "chrome-silver": "55% 22%",
  "chrome-red": "62% 28%",
  "nardo-blue-metallic": "55% 22%",
  "metallic-red-matte": "58% 24%",
  "iridescent-matte": "55% 22%",
  "metallic-blue": "58% 24%",
};

export const FOCAL_MOBILE: Partial<Record<FocalKey, string>> = {
  "chrome-gold": "50% 20%",
  "holographic-carbon": "65% 22%",
  "chrome-red": "60% 26%",
  "gloss-white": "55% 22%",
};

export function keyFromSrc(src: string): FocalKey | null {
  const key = src
    .replace(/^\/products\//, "")
    .replace(/\.(jpe?g|png|webp)$/i, "") as FocalKey;
  return FOCAL[key] ? key : null;
}

export function focalFromSrc(src: string): string {
  const key = keyFromSrc(src);
  return (key && FOCAL[key]) || "55% 22%";
}

export function focalMobileFromSrc(src: string): string {
  const key = keyFromSrc(src);
  if (!key) return "50% 20%";
  return FOCAL_MOBILE[key] || FOCAL[key];
}

export const HERO_IMAGE = "/products/chrome-gold.jpg";
export const BANNER_IMAGE = "/products/chrome-red.jpg";
export const FEATURED_POSTER = "/products/holographic-carbon.jpg";
export const CUSTOM_IMAGE = "/products/iridescent-matte.jpg";
export const ATTITUDE_IMAGE = "/products/carbon-fiber.jpg";
