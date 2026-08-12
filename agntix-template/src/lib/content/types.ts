/** Shared content-database types (JSON tables under /content/db). */

export type LocaleCode = "en" | "ta" | "hi";

export type LocalizedString = Record<LocaleCode, string>;
export type LocalizedStringList = Record<LocaleCode, string[]>;

export function pickLocalized<T>(
  value: Record<LocaleCode, T>,
  locale: string,
): T {
  const key = (locale === "ta" || locale === "hi" ? locale : "en") as LocaleCode;
  return value[key] ?? value.en;
}

export type ContentTable<T> = {
  table: string;
  version: number;
  rows: T[];
};
