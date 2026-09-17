/** Major world languages — prefix URL model: /{locale}/path (English unprefixed). */
export const SEO_LOCALES = [
  "en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
  "it", "nl", "pl", "vi", "th", "sv", "no", "da", "fi", "cs", "ro",
  "hu", "uk", "he", "fa", "ms", "sw",
  "el", "bg", "sr", "hr", "sk", "lt", "lv", "et", "ne", "sl", "af",
  "ca", "fil", "sq", "am", "km", "lo", "my", "ka", "kk", "uz", "az",
  "be", "eu", "gl", "is", "cy", "ga", "mk", "bs", "hy", "mn",
] as const;

export type SeoLocale = (typeof SEO_LOCALES)[number];

export function isSeoLocaleCode(code: string): code is SeoLocale {
  return (SEO_LOCALES as readonly string[]).includes(code);
}
