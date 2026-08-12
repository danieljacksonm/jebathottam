export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: "BEST SELLER" | "NEW" | "FREE" | "BUNDLE";
  image: string;
  gallery: string[];
  features: string[];
  includes: string[];
  compatibility: string[];
  license: string[];
  whoItIsFor?: string;
  downloadContentsPlan?: string[];
  /** Cloud software — open external app instead of ZIP download */
  isSoftware?: boolean;
  externalUrl?: string;
  externalCta?: string;
  rating?: number;
  reviews?: number;
  isFree?: boolean;
  isBundle?: boolean;
  bundleItems?: string[];
  publishedAt: string;
  status: "draft" | "published";
  downloadFile?: string;
  fileName?: string;
  fileSize?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const STORE_CATEGORIES = [
  "Software",
  "UI Kits",
  "Business Tools",
  "Templates",
  "Ebooks",
  "Graphics",
  "Bundles",
  "Freebies",
] as const;

/** Homepage / shelf order from Claude strategy */
export const FEATURED_ORDER = [
  "ebenezer-saas",
  "creator-landing-kit",
  "creator-bundle",
  "shop-pos-starter-pack",
  "brand-kit-essentials",
  "digital-business-playbook",
  "travel-enquiry-pack",
  "free-enquiry-form-kit",
] as const;

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "dp-yegova",
    slug: "ebenezer-saas",
    name: "Ebenezer SaaS — Billing Software for Global Shops",
    tagline: "Cloud billing, stock, and reports built for shop owners worldwide.",
    description:
      "Ebenezer SaaS is a cloud billing app for small and medium shops worldwide. Create invoices, quotations, and credit notes, track stock and customers, and print on A4, A5, or thermal printers. No installation needed — works from any browser.",
    story:
      "Built after seeing how many small shop owners still manage billing on paper or spreadsheets. Ebenezer SaaS is being built and tested with real traders, starting free so owners can try it with zero risk while the product grows.",
    category: "Software",
    price: 0,
    badge: "FREE",
    isFree: true,
    isSoftware: true,
    externalUrl: "http://localhost:3000/register",
    externalCta: "Get started free",
    image: "/images/portfolio/krishna-cover.png",
    gallery: ["/images/portfolio/krishna-cover.png", "/images/portfolio/portfolio-screenshot-agency.png"],
    features: [
      "Invoices, quotations, and credit notes",
      "Stock and inventory tracking",
      "Customer database with purchase history",
      "Expense tracking",
      "Print support for A4, A5, and thermal printers",
      "Built on modern tech (Next.js + NestJS) for speed and reliability",
    ],
    includes: [
      "Full access to the current free plan",
      "Invoicing, stock, customers, sales reports",
      "Quotations, credit notes, expenses, printing",
      "Setup guide + feature sheet (PDFs coming)",
    ],
    compatibility: ["Any modern browser", "Desktop", "Laptop", "Tablet", "Next.js", "NestJS"],
    license: ["Free Plan (current)", "Paid Starter Plan (coming later)"],
    whoItIsFor:
      "Retail stores, traders, wholesalers, and shop owners worldwide who currently bill on paper, Excel, or basic apps and want a simple modern billing system.",
    downloadContentsPlan: [
      "Cloud web app (not a ZIP)",
      "Setup / getting-started PDF guide",
      "Direct signup / login link",
      "One-page feature sheet PDF",
      "Sample invoice PDF",
    ],
    publishedAt: "2026-08-12",
    status: "published",
    seoTitle: "Ebenezer SaaS – Free Cloud Billing Software for Shops",
    seoDescription:
      "Ebenezer SaaS is free cloud billing software for shops — invoices, stock, customers, quotations, credit notes, and A4/A5/thermal printing. Start free today.",
  },
  {
    id: "dp-landing",
    slug: "creator-landing-kit",
    name: "Creator Landing Kit",
    tagline: "Ready-made landing page UI kit for creators, coaches, and freelancers.",
    description:
      "A clean, modern landing page kit designed for solo creators, coaches, and freelancers who need a professional online presence fast. Includes hero sections, pricing blocks, testimonial layouts, and call-to-action sections you can adapt to any tool.",
    story:
      "Made because most creators waste days on design decisions instead of launching. This kit gives a solid, good-looking starting point so you can focus on your offer, not pixel-pushing.",
    category: "UI Kits",
    price: 599,
    compareAt: 899,
    badge: "NEW",
    image: "/images/portfolio/portfolio-screenshot-agency.png",
    gallery: [
      "/images/portfolio/portfolio-screenshot-agency.png",
      "/images/portfolio/manavarkal-hero.jpg",
      "/images/journal/hero.jpg",
    ],
    features: [
      "Hero, about, offer, and pricing sections",
      "Testimonial and social proof layouts",
      "Call-to-action and email capture sections",
      "Mobile-responsive layout structure",
      "Simple, editable design (no complex components)",
    ],
    includes: ["Full landing page UI kit files", "Layout guide", "Color/typography reference sheet"],
    compatibility: ["Figma", "HTML/CSS", "Webflow", "Framer"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor:
      "Coaches, consultants, freelancers, and creators who need a landing page but don't want to hire a designer.",
    downloadContentsPlan: [
      "Figma file",
      "Exported section previews (PNG/JPG)",
      "Short PDF layout guide",
      "Colors/fonts reference sheet",
    ],
    publishedAt: "2026-08-11",
    status: "published",
    downloadFile: "/downloads/creator-landing-kit.zip",
    fileName: "creator-landing-kit.zip",
    fileSize: "3 KB",
    seoTitle: "Creator Landing Kit – Landing Page UI Kit for Coaches & Freelancers",
    seoDescription:
      "Ready-made landing page UI kit with hero, pricing, and testimonial sections. Built for creators, coaches, and freelancers who want to launch fast.",
  },
  {
    id: "dp-pos",
    slug: "shop-pos-starter-pack",
    name: "Shop + POS Starter Pack",
    tagline: "A ready-to-use blueprint for setting up a shop billing/POS system.",
    description:
      "A documentation and UI blueprint pack for anyone planning, designing, or building a shop billing/POS setup. Covers screen layouts, invoice formats, stock flow, and staff process. This is a planning/design pack, not working software.",
    story:
      "Made for shop owners and small developers who need a clear structure before building or buying a POS system, instead of guessing what screens and flows they need.",
    category: "Business Tools",
    price: 699,
    compareAt: 999,
    image: "/images/portfolio/krishna-cover.png",
    gallery: ["/images/portfolio/krishna-cover.png", "/images/portfolio/portfolio-screenshot-agency.png"],
    features: [
      "Screen-by-screen UI blueprint (billing, stock, customer, reports)",
      "Sample invoice and receipt formats (A4/thermal)",
      "Suggested stock-in/stock-out process flow",
      "Staff role and permission structure guide",
      "Checklist for choosing or building a POS system",
    ],
    includes: ["UI blueprint document", "Sample invoice/receipt formats", "Process flow PDF"],
    compatibility: ["Any POS/billing project", "No-code tools", "Custom software reference"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Shop owners planning to digitize billing, and developers/students building a POS project.",
    downloadContentsPlan: [
      "UI blueprint PDF",
      "Invoice/receipt format samples",
      "Process flow diagram",
      "POS-selection checklist PDF",
    ],
    publishedAt: "2026-08-10",
    status: "published",
    downloadFile: "/downloads/shop-pos-starter-pack.zip",
    fileName: "shop-pos-starter-pack.zip",
    fileSize: "3 KB",
    seoTitle: "Shop + POS Starter Pack – Billing System Blueprint for Small Shops",
    seoDescription:
      "A ready-made UI and process blueprint for shop billing and POS setup. Screen layouts, invoice formats, and stock flow — perfect for planning your system.",
  },
  {
    id: "dp-travel",
    slug: "travel-enquiry-pack",
    name: "Travel Enquiry Pack",
    tagline: "Ready enquiry forms and follow-up templates for travel agents.",
    description:
      "A set of enquiry forms, WhatsApp follow-up message templates, and quotation formats built for travel agents and tour operators worldwide. Helps you capture leads properly and follow up without losing enquiries.",
    story:
      "Many small travel agents lose customers because enquiries come in through calls or WhatsApp and get forgotten. This pack gives a simple system to capture and follow up on every lead.",
    category: "Templates",
    price: 499,
    compareAt: 699,
    image: "/images/portfolio/canaan-cover.png",
    gallery: ["/images/portfolio/canaan-cover.png", "/images/journal/hero.jpg"],
    features: [
      "Travel enquiry form template (print + digital)",
      "WhatsApp follow-up message templates",
      "Tour quotation format (editable)",
      "Lead tracking sheet template",
      "Customer information checklist",
    ],
    includes: ["Enquiry form templates", "WhatsApp scripts", "Quotation format", "Lead tracker sheet"],
    compatibility: ["Google Forms", "Google Sheets", "Excel", "WhatsApp Business", "PDF"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Travel agents, tour operators, and small travel agencies handling enquiries manually.",
    downloadContentsPlan: [
      "Enquiry form (PDF + editable doc)",
      "WhatsApp message templates",
      "Quotation template",
      "Lead tracker sheet",
    ],
    publishedAt: "2026-08-09",
    status: "published",
    downloadFile: "/downloads/travel-enquiry-pack.zip",
    fileName: "travel-enquiry-pack.zip",
    fileSize: "2 KB",
    seoTitle: "Travel Enquiry Pack – Forms & Follow-Up Templates for Travel Agents",
    seoDescription:
      "Ready-made enquiry forms, WhatsApp follow-up templates, and quotation formats for travel agents. Stop losing leads — start tracking every enquiry.",
  },
  {
    id: "dp-playbook",
    slug: "digital-business-playbook",
    name: "Digital Business Playbook",
    tagline: "A simple guide to taking your small business online.",
    description:
      "A practical ebook for small business owners who want to start selling or promoting online but don't know where to begin. Covers choosing platforms, pricing, WhatsApp Business setup, basic marketing, and common mistakes to avoid.",
    story:
      "Written for shop owners and small business owners who keep hearing 'go digital' but never get simple, honest, step-by-step guidance without jargon or expensive courses.",
    category: "Ebooks",
    price: 299,
    compareAt: 499,
    image: "/images/portfolio/manavarkal-hero.jpg",
    gallery: ["/images/portfolio/manavarkal-hero.jpg"],
    features: [
      "Step-by-step plan to start selling online",
      "WhatsApp Business setup guide",
      "Simple pricing and offer-building tips",
      "Basic social media posting plan",
      "Common mistakes small businesses make online",
    ],
    includes: ["Full ebook (PDF)", "One-page action checklist"],
    compatibility: ["PDF on phone", "Tablet", "Computer", "Print"],
    license: ["Personal License", "Team/Business License"],
    whoItIsFor:
      "Small shop owners, service providers, and first-time entrepreneurs starting their online journey.",
    downloadContentsPlan: ["Ebook PDF", "Printable one-page action checklist PDF"],
    publishedAt: "2026-08-08",
    status: "published",
    downloadFile: "/downloads/digital-business-playbook.zip",
    fileName: "digital-business-playbook.zip",
    fileSize: "2 KB",
    seoTitle: "Digital Business Playbook – Ebook for Small Businesses Going Online",
    seoDescription:
      "A simple, practical ebook for small business owners on going digital — online selling, WhatsApp Business, pricing, and basic marketing.",
  },
  {
    id: "dp-brand",
    slug: "brand-kit-essentials",
    name: "Brand Kit Essentials",
    tagline: "A simple starter brand kit — logo placement, colors, and social templates.",
    description:
      "A starter brand kit for small businesses and creators who need a consistent look without hiring a designer. Includes logo usage guide, color palette suggestions, and ready social media post templates.",
    story:
      "Many small businesses use random fonts and colors on every post, which looks unprofessional. This kit gives a simple, consistent starting point anyone can use.",
    category: "Graphics",
    price: 399,
    compareAt: 599,
    image: "/images/journal/hero.jpg",
    gallery: ["/images/journal/hero.jpg", "/images/portfolio/portfolio-screenshot-agency.png"],
    features: [
      "Color palette guide with suggested combinations",
      "Font pairing suggestions",
      "Logo usage/placement guide",
      "Editable social media post templates",
      "Simple brand consistency checklist",
    ],
    includes: ["Brand guide PDF", "Social post templates", "Color/font reference sheet"],
    compatibility: ["Canva", "Figma", "Basic design tools"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Small business owners, shop owners, and creators without a dedicated designer.",
    downloadContentsPlan: [
      "Brand guide PDF",
      "Editable social post templates",
      "Color/font reference sheet",
    ],
    publishedAt: "2026-08-07",
    status: "published",
    downloadFile: "/downloads/brand-kit-essentials.zip",
    fileName: "brand-kit-essentials.zip",
    fileSize: "3 KB",
    seoTitle: "Brand Kit Essentials – Simple Starter Brand Kit for Small Businesses",
    seoDescription:
      "A starter brand kit with colors, fonts, logo guide, and social templates. Look consistent and professional without hiring a designer.",
  },
  {
    id: "dp-free-form",
    slug: "free-enquiry-form-kit",
    name: "Free Enquiry Form Kit",
    tagline: "A free, ready-to-use enquiry form for any small business.",
    description:
      "A simple, free enquiry form template any small business can use to collect customer details and requirements — on paper, WhatsApp, or Google Forms. A good starting point before buying anything else in the store.",
    story:
      "Made as a genuinely useful free tool, not a watered-down teaser. Every business needs a basic enquiry form; this gives everyone a solid, free starting point.",
    category: "Freebies",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: "/images/portfolio/portfolio-screenshot-agency.png",
    gallery: ["/images/portfolio/portfolio-screenshot-agency.png"],
    features: [
      "Printable enquiry form (PDF)",
      "Editable digital version",
      "Fields for name, contact, requirement, and follow-up date",
      "Works for any business type",
    ],
    includes: ["Printable PDF form", "Editable digital version"],
    compatibility: ["PDF", "Google Forms", "Google Docs", "Excel", "Word"],
    license: ["Personal License (free use)", "Commercial License (optional)"],
    whoItIsFor: "Any small business or freelancer who needs a basic way to capture customer enquiries.",
    downloadContentsPlan: ["Enquiry form PDF (printable)", "Editable version (Word/Docs)"],
    publishedAt: "2026-08-01",
    status: "published",
    downloadFile: "/downloads/free-enquiry-form-kit.zip",
    fileName: "free-enquiry-form-kit.zip",
    fileSize: "2 KB",
    seoTitle: "Free Enquiry Form Kit – Simple Customer Enquiry Template",
    seoDescription:
      "Free, ready-to-use enquiry form template for small businesses. Printable and editable — collect customer details easily, no cost.",
  },
  {
    id: "dp-bundle",
    slug: "creator-bundle",
    name: "Creator Bundle",
    tagline: "Landing page kit + brand kit + business ebook — everything to launch, in one pack.",
    description:
      "A bundle combining the Creator Landing Kit, Brand Kit Essentials, and Digital Business Playbook at a lower combined price. Built for creators and small business owners who want a landing page, a consistent brand look, and a simple digital growth plan — together.",
    story:
      "Created for buyers who want more than one product but don't want to pay full price three times. Bundling rewards people who want to get set up properly in one go.",
    category: "Bundles",
    price: 899,
    compareAt: 1297,
    badge: "BUNDLE",
    isBundle: true,
    bundleItems: ["dp-landing", "dp-brand", "dp-playbook"],
    image: "/images/portfolio/canaan-cover.png",
    gallery: [
      "/images/portfolio/portfolio-screenshot-agency.png",
      "/images/journal/hero.jpg",
      "/images/portfolio/manavarkal-hero.jpg",
    ],
    features: [
      "Full Creator Landing Kit (UI kit)",
      "Full Brand Kit Essentials (colors, fonts, social templates)",
      "Full Digital Business Playbook (ebook)",
      "Saves compared to buying separately",
      "One download, everything needed to launch",
    ],
    includes: [
      "Creator Landing Kit files",
      "Brand Kit Essentials files",
      "Digital Business Playbook files",
    ],
    compatibility: ["Figma", "HTML", "Canva", "PDF"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor:
      "Creators, coaches, and small business owners who want to launch their online presence properly, in one purchase.",
    downloadContentsPlan: [
      "landing-kit/ folder",
      "brand-kit/ folder",
      "business-playbook/ folder",
    ],
    publishedAt: "2026-08-12",
    status: "published",
    downloadFile: "/downloads/creator-bundle.zip",
    fileName: "creator-bundle.zip",
    fileSize: "8 KB",
    seoTitle: "Creator Bundle – Landing Page Kit + Brand Kit + Business Ebook",
    seoDescription:
      "Get the Creator Landing Kit, Brand Kit Essentials, and Digital Business Playbook together at a lower price. Everything you need to launch your brand online.",
  },
];

export function orderedProducts(): StoreProduct[] {
  const map = new Map(STORE_PRODUCTS.map((p) => [p.slug, p]));
  const ordered = FEATURED_ORDER.map((slug) => map.get(slug)).filter(Boolean) as StoreProduct[];
  const rest = STORE_PRODUCTS.filter((p) => !FEATURED_ORDER.includes(p.slug as (typeof FEATURED_ORDER)[number]));
  return [...ordered, ...rest].filter((p) => p.status === "published");
}

export function getProduct(slug: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find((p) => p.slug === slug && p.status === "published");
}

export function getPublishedProducts(): StoreProduct[] {
  return orderedProducts();
}

export function formatINR(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
