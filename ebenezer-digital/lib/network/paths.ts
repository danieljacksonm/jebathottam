/** Pretty public paths for Network (on .net these are rewritten without /network). */

import type { NetworkToolCategory } from "./types";

export function nxHome() {
  return "/network";
}

export function nxTools(query?: { q?: string; category?: string }) {
  const params = new URLSearchParams();
  if (query?.q) params.set("q", query.q);
  if (query?.category) params.set("category", query.category);
  const qs = params.toString();
  return qs ? `/network/tools?${qs}` : "/network/tools";
}

export function nxTool(slug: string) {
  return `/network/tools/${slug}`;
}

export function nxCategory(category: NetworkToolCategory | string) {
  return `/network/tools/c/${category}`;
}

export function nxGuides() {
  return "/network/guides";
}

export function nxGuide(slug: string) {
  return `/network/guides/${slug}`;
}

export function nxFinder() {
  return "/network/finder";
}

export function nxDevelopers() {
  return "/network/developers";
}

export function nxResources() {
  return "/network/resources";
}

export function nxAbout() {
  return "/network/about";
}

export function nxContact() {
  return "/network/contact";
}

export function nxPrivacy() {
  return "/network/privacy";
}

export function nxTerms() {
  return "/network/terms";
}

export function nxDisclosure() {
  return "/network/affiliate-disclosure";
}

/** Categories that have at least one live tool */
export const PUBLIC_CATEGORIES: NetworkToolCategory[] = [
  "developer",
  "seo",
  "image",
  "text",
  "calculators",
  "business",
  "ai",
];

export const CATEGORY_PATH_ALIASES: Record<string, NetworkToolCategory> = {
  developer: "developer",
  seo: "seo",
  image: "image",
  images: "image",
  pdf: "pdf",
  text: "text",
  calculator: "calculators",
  calculators: "calculators",
  business: "business",
  ai: "ai",
  converter: "calculators",
};
