import { SITE_EMAIL } from "@/lib/site-contact";
import type { SiteKind } from "@/lib/site-url";

export type LegalPage = "privacy" | "terms" | "affiliate-disclosure";

export function legalTitle(kind: SiteKind, page: LegalPage): string {
  const names: Record<SiteKind, string> = {
    studio: "Ebenezer Digital Services",
    info: "Ebenezer Digital Information",
    journal: "Ebenezer Journal",
    news: "Ebenezer News",
    store: "Ebenezer Store",
    products: "Ebenezer Products",
    tools: "Ebenezer Tools",
    ai: "Ebenezer AI",
    saas: "Yegova",
    discover: "Ebenezer Discover",
    network: "Ebenezer Digital Network",
  };
  const site = names[kind];
  if (page === "privacy") return `Privacy Policy | ${site}`;
  if (page === "terms") return `Terms of Use | ${site}`;
  return `Affiliate Disclosure | ${site}`;
}

export function legalBody(kind: SiteKind, page: LegalPage): string[] {
  const site =
    kind === "saas"
      ? "Yegova Billing"
      : kind === "network"
        ? "Ebenezer Digital Network"
        : "Ebenezer Digital";

  if (page === "privacy") {
    return [
      `This privacy policy explains how ${site} collects and uses information when you visit our site or contact us.`,
      "We collect information you submit through forms (name, email, message) and standard analytics data (pages visited, device type). We use this to respond to inquiries, improve our services, and understand site usage.",
      "We do not sell your personal data to third parties. We may share data with service providers who help us operate the site (hosting, email delivery) under confidentiality agreements.",
      `You may request access, correction, or deletion of your data by emailing ${SITE_EMAIL}.`,
      "We use cookies for session management and analytics. You can disable cookies in your browser settings.",
      "Last updated: August 2026.",
    ];
  }

  if (page === "terms") {
    return [
      `By using ${site}, you agree to these terms.`,
      "Content on this site is provided for general information. We strive for accuracy but do not guarantee completeness or fitness for a particular purpose.",
      "Digital products and tools are provided as-is. Refund policies for paid products are stated on individual product pages.",
      "You may not scrape, spam, or attempt to disrupt our services. We reserve the right to block abusive traffic.",
      "These terms are governed by applicable law in India. Contact us with questions before relying on any information for legal, medical, or financial decisions.",
      "Last updated: August 2026.",
    ];
  }

  return [
    `${site} may include affiliate links to third-party products and services.`,
    "When you click an affiliate link and make a purchase, we may earn a commission at no extra cost to you.",
    "We only recommend tools and products we believe are useful. Affiliate relationships do not influence our editorial standards on journal and news content.",
    "Prices and availability on merchant sites may change. Always verify on the seller's website before purchasing.",
    "Last updated: August 2026.",
  ];
}
