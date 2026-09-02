#!/usr/bin/env node
/**
 * Expand data/content/topics.json with scaffold topics for the content pipeline.
 * Usage: node scripts/seed-content-topics.mjs
 */
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "data/content/topics.json");

const SURFACES = [
  {
    id: "studio-insights",
    prefix: "ins",
    category: "Digital Business",
    titles: [
      "How to choose a web development partner",
      "E-commerce checkout optimization basics",
      "Business automation without breaking workflows",
      "When to hire a virtual assistant",
      "Travel website features that convert enquiries",
      "Small business website cost in India",
      "How to brief a web designer",
      "GST billing software for shops",
      "WhatsApp automation for customer support",
      "Local SEO checklist for service businesses",
    ],
  },
  {
    id: "tools-guides",
    prefix: "tg",
    category: "Software",
    titles: [
      "Best CRM for small businesses",
      "Notion vs Trello for teams",
      "Free invoicing tools compared",
      "AI writing tools for marketing",
      "Project management for freelancers",
      "Email marketing for startups",
      "Accounting software for traders",
      "Help desk tools under $20",
      "Video editing tools for creators",
      "Password managers for teams",
    ],
  },
  {
    id: "network-guides",
    prefix: "ng",
    category: "SEO",
    titles: [
      "Free SEO tools for keyword research",
      "How to check page speed",
      "Meta title length best practices",
      "Schema markup for local business",
      "Internal linking for blogs",
      "Robots.txt basics",
      "Canonical URL mistakes",
      "Image alt text for SEO",
      "Core Web Vitals explained",
      "Sitemap submission checklist",
    ],
  },
  {
    id: "info-guides",
    prefix: "ig",
    category: "Guides",
    titles: [
      "What is the Ebenezer Digital ecosystem",
      "How Ebenezer Store works",
      "Using Ebenezer Tools for software research",
      "Ebenezer Journal vs Ebenezer News",
      "Getting started with Yegova Billing",
      "Ebenezer AI assistant overview",
      "Discover intent router explained",
      "Ebenezer Network free tools",
      "Hardware catalog on products site",
      "Contact and support options",
    ],
  },
  {
    id: "store-guides",
    prefix: "sg",
    category: "Store",
    titles: [
      "How to use Canva website templates",
      "Invoice generator kit walkthrough",
      "Social media pack setup guide",
      "Business card template tips",
      "Restaurant menu template guide",
      "Freelancer contract template usage",
      "SaaS starter kit overview",
      "Brand identity kit checklist",
      "Email signature template setup",
      "Store download and licensing FAQ",
    ],
  },
  {
    id: "catalog-guides",
    prefix: "cg",
    category: "Hardware",
    titles: [
      "How to choose a business laptop",
      "SSD vs HDD for office PCs",
      "Monitor size for developers",
      "Budget laptop buying guide India",
      "Thermal printer for billing counters",
      "Barcode scanner setup for shops",
      "UPS for small office networks",
      "Webcam quality for remote work",
      "Keyboard ergonomics guide",
      "Router specs for home office",
    ],
  },
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

const topics = [];
for (const surface of SURFACES) {
  for (let i = 0; i < 50; i++) {
    const base = surface.titles[i % surface.titles.length];
    const title = i < surface.titles.length ? base : `${base} (${2024 + (i % 3)})`;
    const slug = i < surface.titles.length ? slugify(base) : `${slugify(base)}-${i + 1}`;
    topics.push({
      id: `${surface.prefix}-${String(i + 1).padStart(3, "0")}`,
      surface: surface.id,
      title,
      slug,
      category: surface.category,
      tier: i % 5 === 0 ? "pillar" : "standard",
      keywords: slug.split("-").slice(0, 3),
      wordTarget: i % 5 === 0 ? 2200 : 1100,
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(topics, null, 2) + "\n");
console.log(`Wrote ${topics.length} topics to ${OUT}`);
