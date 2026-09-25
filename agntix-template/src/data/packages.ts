import packagesTable from "../../content/db/packages.json";
import {
  pickLocalized,
  type ContentTable,
  type LocalizedString,
  type LocalizedStringList,
} from "@/lib/content/types";
import {
  packageDetails as staticPackageDetails,
  type PackageDetails,
} from "@/data/package-details";
import { prisma } from "@/lib/prisma";

export type PackageId = string;

/** Old marketing package IDs — redirect to the verified Kodai package. */
export const LEGACY_PACKAGE_REDIRECTS: Record<string, PackageId> = {
  "kodai-escape": "kodai-1n2d",
  "kodai-family": "kodai-1n2d",
  "kodai-honeymoon": "kodai-1n2d",
  "kodai-luxury": "kodai-1n2d",
  "kodai-adventure": "kodai-1n2d",
  "kodai-complete": "kodai-1n2d",
};

export type PackageTierRow = {
  id: string;
  pax: number;
  bestValue?: boolean;
  pricePerPerson: number;
  currency: "INR";
  roomType: LocalizedString;
  label: LocalizedString;
};

export type PackagePricingMode = "confirmed" | "enquiry";

export type PackageRow = {
  id: PackageId;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  image: string;
  category:
    | "escape"
    | "family"
    | "honeymoon"
    | "luxury"
    | "adventure"
    | "complete";
  featured?: boolean;
  published?: boolean;
  pricingMode?: PackagePricingMode;
  tagline?: LocalizedString;
  highlights: LocalizedStringList;
  title: LocalizedString;
  blurb: LocalizedString;
  body: LocalizedString;
  sharedInclusions?: LocalizedStringList;
  tiers?: PackageTierRow[];
  groupNote?: LocalizedString;
  /** When present (from Prisma), used instead of static packageDetails. */
  details?: PackageDetails;
};

export type LocalizedTier = {
  id: string;
  pax: number;
  bestValue?: boolean;
  pricePerPerson: number;
  currency: "INR";
  roomType: string;
  label: string;
};

export type LocalizedPackageDetails = {
  suitableFor: string;
  startingLocation: string;
  destination: string;
  hotelCategory: string;
  transportSummary: string;
  mealPlan: string;
  pricingAssumptions: string[];
  inclusions: string[];
  exclusions: string[];
  accommodationNote: string;
  transportDetails: string[];
  cancellationPolicy: string;
  paymentTerms: string;
  itinerary: {
    day: number;
    title: string;
    parts: { label: string; detail: string }[];
    overnight?: string;
  }[];
  faqs: { question: string; answer: string }[];
};

export type LocalizedPackage = {
  id: PackageId;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  image: string;
  category: PackageRow["category"];
  featured?: boolean;
  pricingMode: PackagePricingMode;
  tagline?: string;
  highlights: string[];
  title: string;
  blurb: string;
  body: string;
  sharedInclusions: string[];
  tiers: LocalizedTier[];
  groupNote?: string;
  details: LocalizedPackageDetails;
};

export function isEnquiryPriced(pkg: {
  pricingMode?: PackagePricingMode;
  priceFrom: number;
}) {
  return pkg.pricingMode === "enquiry" || pkg.priceFrom <= 0;
}

const jsonTable = packagesTable as ContentTable<PackageRow>;

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function dbToRow(row: {
  slug: string;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  currency: string;
  image: string;
  category: string;
  featured: boolean;
  published: boolean;
  pricingMode: string;
  titleJson: string;
  blurbJson: string;
  bodyJson: string;
  taglineJson: string;
  highlightsJson: string;
  sharedInclusionsJson: string;
  tiersJson: string;
  groupNoteJson: string;
  detailsJson: string;
}): PackageRow {
  const emptyLoc = { en: "", ta: "", hi: "" };
  const emptyList = { en: [] as string[], ta: [] as string[], hi: [] as string[] };
  return {
    id: row.slug,
    destinationSlug: row.destinationSlug,
    nights: row.nights,
    days: row.days,
    priceFrom: row.priceFrom,
    currency: (row.currency as "INR") || "INR",
    image: row.image,
    category: row.category as PackageRow["category"],
    featured: row.featured,
    published: row.published,
    pricingMode: row.pricingMode as PackagePricingMode,
    title: parseJson(row.titleJson, emptyLoc),
    blurb: parseJson(row.blurbJson, emptyLoc),
    body: parseJson(row.bodyJson, emptyLoc),
    tagline: parseJson(row.taglineJson, emptyLoc),
    highlights: parseJson(row.highlightsJson, emptyList),
    sharedInclusions: parseJson(row.sharedInclusionsJson, emptyList),
    tiers: parseJson(row.tiersJson, []),
    groupNote: parseJson(row.groupNoteJson, emptyLoc),
    details: parseJson(row.detailsJson, staticPackageDetails[row.slug]),
  };
}

/** JSON fallback (used when DB has no packages yet, and for sync client helpers). */
export const packageRows: PackageRow[] = jsonTable.rows.filter(
  (row) => row.published !== false,
);

export async function getPackageRows(): Promise<PackageRow[]> {
  try {
    const rows = await prisma.travelPackage.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    });
    if (rows.length > 0) return rows.map(dbToRow);
  } catch {
    // Prisma model missing / DB unavailable during early boot
  }
  return packageRows;
}

export async function getPackageRow(id: string) {
  const rows = await getPackageRows();
  return rows.find((p) => p.id === id);
}

function localizeDetails(
  details: PackageDetails,
  locale: string,
): LocalizedPackageDetails {
  return {
    suitableFor: pickLocalized(details.suitableFor, locale),
    startingLocation: pickLocalized(details.startingLocation, locale),
    destination: pickLocalized(details.destination, locale),
    hotelCategory: pickLocalized(details.hotelCategory, locale),
    transportSummary: pickLocalized(details.transportSummary, locale),
    mealPlan: pickLocalized(details.mealPlan, locale),
    pricingAssumptions: pickLocalized(details.pricingAssumptions, locale),
    inclusions: pickLocalized(details.inclusions, locale),
    exclusions: pickLocalized(details.exclusions, locale),
    accommodationNote: pickLocalized(details.accommodationNote, locale),
    transportDetails: pickLocalized(details.transportDetails, locale),
    cancellationPolicy: pickLocalized(details.cancellationPolicy, locale),
    paymentTerms: pickLocalized(details.paymentTerms, locale),
    itinerary: details.itinerary.map((d) => ({
      day: d.day,
      title: pickLocalized(d.title, locale),
      parts: d.parts.map((p) => ({
        label: pickLocalized(p.label, locale),
        detail: pickLocalized(p.detail, locale),
      })),
      overnight: d.overnight
        ? pickLocalized(d.overnight, locale)
        : undefined,
    })),
    faqs: details.faqs.map((f) => ({
      question: pickLocalized(f.question, locale),
      answer: pickLocalized(f.answer, locale),
    })),
  };
}

export function localizePackage(
  row: PackageRow,
  locale: string,
): LocalizedPackage {
  const details =
    row.details ??
    staticPackageDetails[row.id] ??
    null;
  if (!details) {
    throw new Error(`Missing package details for ${row.id}`);
  }
  return {
    id: row.id,
    destinationSlug: row.destinationSlug,
    nights: row.nights,
    days: row.days,
    priceFrom: row.priceFrom,
    currency: row.currency,
    image: row.image,
    category: row.category,
    featured: row.featured,
    pricingMode:
      row.pricingMode ?? (row.priceFrom > 0 ? "confirmed" : "enquiry"),
    tagline: row.tagline ? pickLocalized(row.tagline, locale) : undefined,
    highlights: pickLocalized(row.highlights, locale),
    title: pickLocalized(row.title, locale),
    blurb: pickLocalized(row.blurb, locale),
    body: pickLocalized(row.body, locale),
    sharedInclusions: row.sharedInclusions
      ? pickLocalized(row.sharedInclusions, locale)
      : [],
    tiers: (row.tiers ?? []).map((tier) => ({
      id: tier.id,
      pax: tier.pax,
      bestValue: tier.bestValue,
      pricePerPerson: tier.pricePerPerson,
      currency: tier.currency,
      roomType: pickLocalized(tier.roomType, locale),
      label: pickLocalized(tier.label, locale),
    })),
    groupNote: row.groupNote
      ? pickLocalized(row.groupNote, locale)
      : undefined,
    details: localizeDetails(details, locale),
  };
}

/** Sync helper for client components — prefers JSON snapshot. */
export function getLocalizedPackages(locale: string) {
  return packageRows.map((row) => localizePackage(row, locale));
}

export function getLocalizedPackage(id: string, locale: string) {
  const row = packageRows.find((p) => p.id === id);
  if (!row) return undefined;
  return localizePackage(row, locale);
}

export async function getLocalizedPackagesAsync(locale: string) {
  const rows = await getPackageRows();
  return rows.map((row) => localizePackage(row, locale));
}

export async function getLocalizedPackageAsync(id: string, locale: string) {
  const row = await getPackageRow(id);
  if (!row) return undefined;
  return localizePackage(row, locale);
}

export type TravelPackage = {
  id: PackageId;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  image: string;
  category: PackageRow["category"];
  featured?: boolean;
  highlights: string[];
};

export const packages: TravelPackage[] = packageRows.map((row) => ({
  id: row.id,
  destinationSlug: row.destinationSlug,
  nights: row.nights,
  days: row.days,
  priceFrom: row.priceFrom,
  currency: row.currency,
  image: row.image,
  category: row.category,
  featured: row.featured,
  highlights: row.highlights.en,
}));

export function getPackagesForDestination(
  destinationSlug: string,
  locale: string,
) {
  return getLocalizedPackages(locale).filter(
    (pkg) => pkg.destinationSlug === destinationSlug,
  );
}

export async function getPackagesForDestinationAsync(
  destinationSlug: string,
  locale: string,
) {
  const list = await getLocalizedPackagesAsync(locale);
  return list.filter((pkg) => pkg.destinationSlug === destinationSlug);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPackagePrice(
  pkg: { priceFrom: number; pricingMode?: PackagePricingMode },
  enquireLabel = "Request a quote",
) {
  if (isEnquiryPriced(pkg)) return enquireLabel;
  return formatInr(pkg.priceFrom);
}

export function getPackage(id: string) {
  return packages.find((p) => p.id === id);
}

/** Persist admin edits back to packages.json so client sync helpers stay aligned. */
export function packageRowToJson(row: PackageRow) {
  return {
    id: row.id,
    destinationSlug: row.destinationSlug,
    nights: row.nights,
    days: row.days,
    priceFrom: row.priceFrom,
    currency: row.currency,
    category: row.category,
    featured: row.featured,
    published: row.published !== false,
    pricingMode: row.pricingMode,
    image: row.image,
    tagline: row.tagline,
    highlights: row.highlights,
    title: row.title,
    blurb: row.blurb,
    body: row.body,
    sharedInclusions: row.sharedInclusions,
    tiers: row.tiers,
    groupNote: row.groupNote,
  };
}
