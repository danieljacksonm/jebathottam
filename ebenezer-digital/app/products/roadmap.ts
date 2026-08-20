/**
 * Product roadmap for Ebenezer Digital Store.
 * These are planning records — NOT sellable products.
 * Only publish a STORE_PRODUCTS entry when real assets exist.
 */

export type RoadmapPriority = "A" | "B" | "C" | "D";

export type RoadmapItem = {
  id: string;
  title: string;
  bucket: string;
  priority: RoadmapPriority;
  reason: string;
  status: "planned" | "building" | "shipped" | "blocked";
  blockedBy?: string;
  relatedSlugs?: string[];
};

export const ROADMAP_PRIORITY_LABEL: Record<RoadmapPriority, string> = {
  A: "Build now",
  B: "Build next",
  C: "Future",
  D: "Do not build",
};

/** Gap snapshot vs the 30 ecosystem buckets (updated with expansion waves). */
export const CATALOG_GAP_NOTES: { bucket: string; coverage: "strong" | "light" | "gap"; note: string }[] = [
  { bucket: "Website Templates", coverage: "strong", note: "HTML packs shipping; framework variants later" },
  { bucket: "Code / Developer / SaaS starters", coverage: "gap", note: "Blocked until real Next/React source ZIPs" },
  { bucket: "Software & Business tools", coverage: "strong", note: "Invoice family + SaaS + trackers" },
  { bucket: "UI Kits / Figma / Canva / Graphics", coverage: "gap", note: "Draft only until editable files exist" },
  { bucket: "AI products", coverage: "gap", note: "Need real apps, not prompt PDFs" },
  { bucket: "Church / Travel / Restaurant / Freelancer / Creator", coverage: "strong", note: "Sites + tools + bundles" },
  { bucket: "Real estate / Healthcare / Education / Ecommerce", coverage: "light", note: "HTML templates added in this wave" },
  { bucket: "Presentations / Design systems / Automation / Analytics", coverage: "gap", note: "Future after core demand" },
  { bucket: "Bundles", coverage: "strong", note: "Only bundle real shipped products" },
];

export const PRODUCT_ROADMAP: RoadmapItem[] = [
  /* A — immediate / in this wave */
  {
    id: "a-re-html",
    title: "Real estate website template (HTML)",
    bucket: "Website Templates",
    priority: "A",
    reason: "High local demand + clones existing HTML pattern",
    status: "shipped",
  },
  {
    id: "a-clinic-html",
    title: "Clinic / healthcare website template (HTML)",
    bucket: "Healthcare",
    priority: "A",
    reason: "Clear niche; booking CTA pattern ready",
    status: "shipped",
  },
  {
    id: "a-edu-html",
    title: "Education / course landing template (HTML)",
    bucket: "Education",
    priority: "A",
    reason: "Coaches and institutes need landing pages fast",
    status: "shipped",
  },
  {
    id: "a-photo-html",
    title: "Photography website template (HTML)",
    bucket: "Creator",
    priority: "A",
    reason: "Extends portfolio pattern with gallery pages",
    status: "shipped",
  },
  {
    id: "a-cafe-html",
    title: "Cafe website template (HTML)",
    bucket: "Restaurant",
    priority: "A",
    reason: "Pairs with QR menu tool",
    status: "shipped",
  },
  {
    id: "a-po-tool",
    title: "Purchase order generator",
    bucket: "Business Software",
    priority: "A",
    reason: "Clone DocumentGenerator; shops need POs",
    status: "shipped",
  },
  {
    id: "a-task-tool",
    title: "Simple task tracker",
    bucket: "Productivity",
    priority: "A",
    reason: "localStorage app pattern like expense tracker",
    status: "shipped",
  },

  /* B — next */
  {
    id: "b-law-html",
    title: "Law firm website template",
    bucket: "Website Templates",
    priority: "B",
    reason: "Strong B2B demand after consulting pack",
    status: "planned",
  },
  {
    id: "b-gym-html",
    title: "Gym / fitness website template",
    bucket: "Website Templates",
    priority: "B",
    reason: "Local business niche",
    status: "planned",
  },
  {
    id: "b-hotel-html",
    title: "Hotel website template",
    bucket: "Travel",
    priority: "B",
    reason: "Complements travel agency pack",
    status: "planned",
  },
  {
    id: "b-crm-lite",
    title: "Lead / CRM starter (browser)",
    bucket: "Business Software",
    priority: "B",
    reason: "High time-saving; build after PO + task tools",
    status: "planned",
  },
  {
    id: "b-itinerary",
    title: "Travel itinerary generator",
    bucket: "Travel",
    priority: "B",
    reason: "Pairs with travel bundle",
    status: "planned",
  },
  {
    id: "b-church-sermon",
    title: "Sermon archive starter (HTML + JSON)",
    bucket: "Church & Ministry",
    priority: "B",
    reason: "Niche strength for Ebenezer",
    status: "planned",
  },
  {
    id: "b-dev-bundle",
    title: "Developer Pro Bundle",
    bucket: "Bundles",
    priority: "B",
    reason: "Only after real Next/UI assets ship",
    status: "blocked",
    blockedBy: "Real Next.js starter + UI kit files",
  },

  /* C — future */
  {
    id: "c-next-saas",
    title: "Next.js SaaS starter (source ZIP)",
    bucket: "SaaS Starters",
    priority: "C",
    reason: "High value but high build cost",
    status: "blocked",
    blockedBy: "Real repository / ZIP",
    relatedSlugs: ["nextjs-saas-starter"],
  },
  {
    id: "c-react-dash",
    title: "React admin dashboard",
    bucket: "Developer Tools",
    priority: "C",
    reason: "Needs maintained component code",
    status: "planned",
  },
  {
    id: "c-figma-saas",
    title: "Figma SaaS UI kit",
    bucket: "Figma",
    priority: "C",
    reason: "Needs real Figma file",
    status: "blocked",
    blockedBy: "Editable Figma file",
  },
  {
    id: "c-canva-church",
    title: "Church social Canva pack",
    bucket: "Canva",
    priority: "C",
    reason: "Draft listing exists; wait for Canva links",
    status: "blocked",
    blockedBy: "Editable Canva templates",
    relatedSlugs: ["church-social-canva-pack"],
  },
  {
    id: "c-ai-proposal",
    title: "AI proposal assistant (app)",
    bucket: "AI Products",
    priority: "C",
    reason: "Usable UI + API; not prompt PDFs",
    status: "planned",
  },
  {
    id: "c-lms",
    title: "LMS / course dashboard starter",
    bucket: "Education",
    priority: "C",
    reason: "Complex; after education landing traction",
    status: "planned",
  },
  {
    id: "c-analytics",
    title: "Sales / KPI dashboard (static HTML)",
    bucket: "Data / Analytics",
    priority: "C",
    reason: "Demo charts with sample data",
    status: "planned",
  },

  /* D — do not build */
  {
    id: "d-prompt-pdf",
    title: "Generic AI prompt PDF packs",
    bucket: "AI Products",
    priority: "D",
    reason: "Low value; easy to generate with ChatGPT",
    status: "planned",
  },
  {
    id: "d-tips-ebook",
    title: "Generic business tips ebooks as paid core",
    bucket: "Marketing",
    priority: "D",
    reason: "Violates implementation-first rule",
    status: "planned",
  },
  {
    id: "d-fake-figma",
    title: "Screenshot-only UI kits sold as Figma",
    bucket: "Figma",
    priority: "D",
    reason: "Honesty / trust rule",
    status: "planned",
  },
];

export function roadmapByPriority(priority: RoadmapPriority): RoadmapItem[] {
  return PRODUCT_ROADMAP.filter((i) => i.priority === priority);
}
