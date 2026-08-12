import packagesTable from "../../content/db/packages.json";
import {
  pickLocalized,
  type ContentTable,
  type LocalizedString,
  type LocalizedStringList,
} from "@/lib/content/types";

export type PackageId =
  | "kodai-escape"
  | "kodai-family"
  | "kodai-honeymoon"
  | "kodai-luxury"
  | "kodai-adventure"
  | "kodai-complete";

export type PackageRow = {
  id: PackageId;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  rating: number;
  reviewCount: number;
  image: string;
  category: "escape" | "family" | "honeymoon" | "luxury" | "adventure" | "complete";
  featured?: boolean;
  highlights: LocalizedStringList;
  title: LocalizedString;
  blurb: LocalizedString;
  body: LocalizedString;
};

export type LocalizedPackage = {
  id: PackageId;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  rating: number;
  reviewCount: number;
  image: string;
  category: PackageRow["category"];
  featured?: boolean;
  highlights: string[];
  title: string;
  blurb: string;
  body: string;
};

const table = packagesTable as ContentTable<PackageRow>;
export const packageRows = table.rows;

export function getPackageRow(id: string) {
  return packageRows.find((p) => p.id === id);
}

export function localizePackage(
  row: PackageRow,
  locale: string,
): LocalizedPackage {
  return {
    id: row.id,
    nights: row.nights,
    days: row.days,
    priceFrom: row.priceFrom,
    currency: row.currency,
    rating: row.rating,
    reviewCount: row.reviewCount,
    image: row.image,
    category: row.category,
    featured: row.featured,
    highlights: pickLocalized(row.highlights, locale),
    title: pickLocalized(row.title, locale),
    blurb: pickLocalized(row.blurb, locale),
    body: pickLocalized(row.body, locale),
  };
}

export function getLocalizedPackages(locale: string) {
  return packageRows.map((row) => localizePackage(row, locale));
}

export function getLocalizedPackage(id: string, locale: string) {
  const row = getPackageRow(id);
  if (!row) return undefined;
  return localizePackage(row, locale);
}

/** Legacy shape used by existing components */
export type TravelPackage = {
  id: PackageId;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  rating: number;
  reviewCount: number;
  image: string;
  category: PackageRow["category"];
  featured?: boolean;
  highlights: string[];
};

export const packages: TravelPackage[] = packageRows.map((row) => ({
  id: row.id,
  nights: row.nights,
  days: row.days,
  priceFrom: row.priceFrom,
  currency: row.currency,
  rating: row.rating,
  reviewCount: row.reviewCount,
  image: row.image,
  category: row.category,
  featured: row.featured,
  highlights: row.highlights.en,
}));

export const packageCopy: Record<
  PackageId,
  {
    title: LocalizedString;
    blurb: LocalizedString;
    body: LocalizedString;
  }
> = Object.fromEntries(
  packageRows.map((row) => [
    row.id,
    { title: row.title, blurb: row.blurb, body: row.body },
  ]),
) as Record<
  PackageId,
  { title: LocalizedString; blurb: LocalizedString; body: LocalizedString }
>;

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPackage(id: string) {
  return packages.find((p) => p.id === id);
}
