import packagesTable from "../../content/db/packages.json";
import {
  pickLocalized,
  type ContentTable,
  type LocalizedString,
  type LocalizedStringList,
} from "@/lib/content/types";
import {
  packageDetails,
  type PackageDetails,
} from "@/data/package-details";

export type PackageId =
  | "kodai-1n2d"
  | "darjeeling-3n4d-mimbusty"
  | "darjeeling-3n4d-tabakoshi";

/** Old marketing package IDs — redirect to the verified flyer package. */
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

export type PackageRow = {
  id: PackageId;
  destinationSlug: string;
  nights: number;
  days: number;
  priceFrom: number;
  currency: "INR";
  image: string;
  category: "escape" | "family" | "honeymoon" | "luxury" | "adventure" | "complete";
  featured?: boolean;
  published?: boolean;
  tagline?: LocalizedString;
  highlights: LocalizedStringList;
  title: LocalizedString;
  blurb: LocalizedString;
  body: LocalizedString;
  sharedInclusions?: LocalizedStringList;
  tiers?: PackageTierRow[];
  groupNote?: LocalizedString;
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

const table = packagesTable as ContentTable<PackageRow>;
export const packageRows = table.rows.filter((row) => row.published !== false);

export function getPackageRow(id: string) {
  return packageRows.find((p) => p.id === id);
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
  const details = packageDetails[row.id];
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

export function getPackagesForDestination(destinationSlug: string, locale: string) {
  return getLocalizedPackages(locale).filter(
    (pkg) => pkg.destinationSlug === destinationSlug,
  );
}

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
