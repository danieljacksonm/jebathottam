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
  /** Real PDF files the buyer can open on the product page */
  pdfs?: { label: string; file: string }[];
  seoTitle?: string;
  seoDescription?: string;
};

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=88`;

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
    externalUrl: "/ai?mode=product&prefill=I%20want%20to%20start%20Ebenezer%20SaaS",
    externalCta: "Get started free",
    image: U("photo-1556742049-0cfed4f6a45d"),
    gallery: [
      U("photo-1556742049-0cfed4f6a45d"),
      U("photo-1556740758-90de374c12ad"),
      U("photo-1460925895917-afdab827c52f"),
      U("photo-1554224155-6726b3ff858f"),
    ],
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
      "Setup guide PDF + feature sheet PDF + sample invoice PDF",
    ],
    compatibility: ["Any modern browser", "Desktop", "Laptop", "Tablet", "Next.js", "NestJS"],
    license: ["Free Plan (current)", "Paid Starter Plan (coming later)"],
    whoItIsFor:
      "Retail stores, traders, and shop owners worldwide who still bill on paper, Excel, or basic apps and want a simple modern billing system.",
    downloadContentsPlan: [
      "Cloud web app (not a ZIP)",
      "getting-started.pdf",
      "feature-sheet.pdf",
      "sample-invoice.pdf",
    ],
    pdfs: [
      { label: "Getting started guide", file: "/downloads/pdfs/ebenezer-saas/getting-started.pdf" },
      { label: "Feature sheet", file: "/downloads/pdfs/ebenezer-saas/feature-sheet.pdf" },
      { label: "Sample invoice", file: "/downloads/pdfs/ebenezer-saas/sample-invoice.pdf" },
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
    price: 19,
    compareAt: 29,
    badge: "NEW",
    image: U("photo-1507238691740-187a5b1d37b8"),
    gallery: [
      U("photo-1507238691740-187a5b1d37b8"),
      U("photo-1467232004584-a241de8bcf5d"),
      U("photo-1498050108023-c5249f4df085"),
      U("photo-1547658719-da2b51169166"),
      U("photo-1522542550221-31fd19575a2d"),
    ],
    features: [
      "Hero, about, offer, and pricing sections",
      "Testimonial and social proof layouts",
      "Call-to-action and email capture sections",
      "Mobile-responsive layout structure",
      "Simple, editable design (no complex components)",
    ],
    includes: [
      "Figma file — 24 ready landing sections",
      "Hero, pricing, testimonials, FAQ, CTA blocks",
      "Mobile + desktop frames",
      "PDF layout guide (how to assemble a page)",
      "Color and type reference sheet",
      "PNG section previews for clients",
    ],
    compatibility: ["Figma", "HTML/CSS", "Webflow", "Framer"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor:
      "Coaches, consultants, freelancers, and creators who need a landing page but don't want to hire a designer.",
    downloadContentsPlan: [
      "layout-guide.pdf",
      "copy-templates.pdf",
      "mobile-checklist.pdf",
      "Section structure + license notes",
    ],
    pdfs: [
      { label: "Layout guide", file: "/downloads/pdfs/creator-landing-kit/layout-guide.pdf" },
      { label: "Copy templates", file: "/downloads/pdfs/creator-landing-kit/copy-templates.pdf" },
      { label: "Mobile checklist", file: "/downloads/pdfs/creator-landing-kit/mobile-checklist.pdf" },
    ],
    publishedAt: "2026-08-11",
    status: "published",
    downloadFile: "/downloads/creator-landing-kit.zip",
    fileName: "creator-landing-kit.zip",
    fileSize: "3 PDFs in ZIP",
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
    price: 24,
    compareAt: 39,
    image: U("photo-1556740738-b6a63e62c1d5"),
    gallery: [
      U("photo-1556740738-b6a63e62c1d5"),
      U("photo-1441986300917-64674bd600d8"),
      U("photo-1556742111-a301076d9d18"),
      U("photo-1556741533-6e6a62bd8b49"),
    ],
    features: [
      "Screen-by-screen UI blueprint (billing, stock, customer, reports)",
      "Sample invoice and receipt formats (A4/thermal)",
      "Suggested stock-in/stock-out process flow",
      "Staff role and permission structure guide",
      "Checklist for choosing or building a POS system",
    ],
    includes: [
      "UI blueprint PDF — billing, stock, customers, reports",
      "A4 and thermal invoice/receipt samples",
      "Stock-in / stock-out process diagram",
      "Staff roles checklist",
      "POS selection checklist (buy vs build)",
    ],
    compatibility: ["Any POS/billing project", "No-code tools", "Custom software reference"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Shop owners planning to digitize billing, and developers/students building a POS project.",
    downloadContentsPlan: [
      "ui-blueprint.pdf",
      "invoice-samples.pdf",
      "pos-selection-checklist.pdf",
      "Stock flow + staff roles notes",
    ],
    pdfs: [
      { label: "UI blueprint", file: "/downloads/pdfs/shop-pos-starter-pack/ui-blueprint.pdf" },
      { label: "Invoice samples", file: "/downloads/pdfs/shop-pos-starter-pack/invoice-samples.pdf" },
      { label: "Buy vs build checklist", file: "/downloads/pdfs/shop-pos-starter-pack/pos-selection-checklist.pdf" },
    ],
    publishedAt: "2026-08-10",
    status: "published",
    downloadFile: "/downloads/shop-pos-starter-pack.zip",
    fileName: "shop-pos-starter-pack.zip",
    fileSize: "3 PDFs in ZIP",
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
    price: 17,
    compareAt: 27,
    image: U("photo-1488646953014-85cb44e25828"),
    gallery: [
      U("photo-1488646953014-85cb44e25828"),
      U("photo-1436491865332-7a61a109cc05"),
      U("photo-1503220317375-aaad61436b1b"),
      U("photo-1526772662000-3f88f10405ff"),
    ],
    features: [
      "Travel enquiry form template (print + digital)",
      "WhatsApp follow-up message templates",
      "Tour quotation format (editable)",
      "Lead tracking sheet template",
      "Customer information checklist",
    ],
    includes: [
      "Printable enquiry form (PDF)",
      "Editable enquiry form (Word / Google Docs)",
      "WhatsApp follow-up scripts (EN)",
      "Tour quotation template",
      "Lead tracker sheet (Excel / Google Sheets)",
    ],
    compatibility: ["Google Forms", "Google Sheets", "Excel", "WhatsApp Business", "PDF"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Travel agents and tour operators worldwide who still take enquiries by call or chat.",
    downloadContentsPlan: [
      "enquiry-form.pdf",
      "whatsapp-scripts.pdf",
      "quotation-template.pdf",
      "lead-tracker.csv",
    ],
    pdfs: [
      { label: "Printable enquiry form", file: "/downloads/pdfs/travel-enquiry-pack/enquiry-form.pdf" },
      { label: "WhatsApp scripts", file: "/downloads/pdfs/travel-enquiry-pack/whatsapp-scripts.pdf" },
      { label: "Quotation template", file: "/downloads/pdfs/travel-enquiry-pack/quotation-template.pdf" },
    ],
    publishedAt: "2026-08-09",
    status: "published",
    downloadFile: "/downloads/travel-enquiry-pack.zip",
    fileName: "travel-enquiry-pack.zip",
    fileSize: "3 PDFs + CSV in ZIP",
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
    price: 12,
    compareAt: 19,
    image: U("photo-1454165804606-c3d57bc86b40"),
    gallery: [
      U("photo-1454165804606-c3d57bc86b40"),
      U("photo-1434030216411-0b793f4b4173"),
      U("photo-1516321318423-f06f85e504b3"),
    ],
    features: [
      "Step-by-step plan to start selling online",
      "WhatsApp Business setup guide",
      "Simple pricing and offer-building tips",
      "Basic social media posting plan",
      "Common mistakes small businesses make online",
    ],
    includes: [
      "Full ebook PDF (printable + phone-friendly)",
      "One-page action checklist PDF",
      "Simple 30-day posting plan",
    ],
    compatibility: ["PDF on phone", "Tablet", "Computer", "Print"],
    license: ["Personal License", "Team/Business License"],
    whoItIsFor:
      "Small shop owners, service providers, and first-time founders anywhere in the world.",
    downloadContentsPlan: ["digital-business-playbook.pdf", "7-day-checklist.pdf"],
    pdfs: [
      { label: "Ebook (8 chapters)", file: "/downloads/pdfs/digital-business-playbook/digital-business-playbook.pdf" },
      { label: "7-day action checklist", file: "/downloads/pdfs/digital-business-playbook/7-day-checklist.pdf" },
    ],
    publishedAt: "2026-08-08",
    status: "published",
    downloadFile: "/downloads/digital-business-playbook.zip",
    fileName: "digital-business-playbook.zip",
    fileSize: "2 PDFs in ZIP",
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
    price: 15,
    compareAt: 25,
    image: U("photo-1561070791-2526d30994b5"),
    gallery: [
      U("photo-1561070791-2526d30994b5"),
      U("photo-1558655146-d09347e92766"),
      U("photo-1618005182384-a83a8bd57fbe"),
      U("photo-1542744173-8eaa3c4c0bb1"),
    ],
    features: [
      "Color palette guide with suggested combinations",
      "Font pairing suggestions",
      "Logo usage/placement guide",
      "Editable social media post templates",
      "Simple brand consistency checklist",
    ],
    includes: [
      "Brand guide PDF (logo, color, type)",
      "8 social post templates (Canva + Figma)",
      "Color/font reference sheet",
      "Brand consistency checklist",
    ],
    compatibility: ["Canva", "Figma", "Basic design tools"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor: "Small business owners, shop owners, and creators without a dedicated designer.",
    downloadContentsPlan: ["brand-guide.pdf", "social-templates.pdf"],
    pdfs: [
      { label: "Brand guide", file: "/downloads/pdfs/brand-kit-essentials/brand-guide.pdf" },
      { label: "Social post templates", file: "/downloads/pdfs/brand-kit-essentials/social-templates.pdf" },
    ],
    publishedAt: "2026-08-07",
    status: "published",
    downloadFile: "/downloads/brand-kit-essentials.zip",
    fileName: "brand-kit-essentials.zip",
    fileSize: "2 PDFs in ZIP",
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
    image: U("photo-1586281380349-632531db7ed4"),
    gallery: [
      U("photo-1586281380349-632531db7ed4"),
      U("photo-1450101499163-c8848c66ca85"),
      U("photo-1454165804606-c3d57bc86b40"),
    ],
    features: [
      "Printable enquiry form (PDF)",
      "Editable digital version",
      "Fields for name, contact, requirement, and follow-up date",
      "Works for any business type",
    ],
    includes: [
      "Printable enquiry form PDF",
      "Editable Word / Google Docs version",
      "Suggested Google Form field list",
    ],
    compatibility: ["PDF", "Google Forms", "Google Docs", "Excel", "Word"],
    license: ["Personal License (free use)", "Commercial License (optional)"],
    whoItIsFor: "Any small business or freelancer who needs a basic way to capture customer enquiries.",
    downloadContentsPlan: ["enquiry-form.pdf", "digital-fields.pdf"],
    pdfs: [
      { label: "Printable enquiry form", file: "/downloads/pdfs/free-enquiry-form-kit/enquiry-form.pdf" },
      { label: "Google Forms field list", file: "/downloads/pdfs/free-enquiry-form-kit/digital-fields.pdf" },
    ],
    publishedAt: "2026-08-01",
    status: "published",
    downloadFile: "/downloads/free-enquiry-form-kit.zip",
    fileName: "free-enquiry-form-kit.zip",
    fileSize: "2 PDFs in ZIP",
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
    price: 39,
    compareAt: 46,
    badge: "BUNDLE",
    isBundle: true,
    bundleItems: ["dp-landing", "dp-brand", "dp-playbook"],
    image: U("photo-1522202176988-66273c2fd55f"),
    gallery: [
      U("photo-1522202176988-66273c2fd55f"),
      U("photo-1507238691740-187a5b1d37b8"),
      U("photo-1561070791-2526d30994b5"),
      U("photo-1454165804606-c3d57bc86b40"),
    ],
    features: [
      "Full Creator Landing Kit (UI kit)",
      "Full Brand Kit Essentials (colors, fonts, social templates)",
      "Full Digital Business Playbook (ebook)",
      "Saves compared to buying separately",
      "One download, everything needed to launch",
    ],
    includes: [
      "Creator Landing Kit — full Figma + guides",
      "Brand Kit Essentials — guide + 8 social templates",
      "Digital Business Playbook — ebook + checklist",
      "One ZIP, three product folders",
    ],
    compatibility: ["Figma", "HTML", "Canva", "PDF"],
    license: ["Personal License", "Commercial License"],
    whoItIsFor:
      "Creators, coaches, and small business owners who want to launch their online presence properly, in one purchase.",
    downloadContentsPlan: [
      "bundle-contents.pdf",
      "landing-kit/*.pdf",
      "brand-kit/*.pdf",
      "business-playbook/*.pdf",
    ],
    pdfs: [
      { label: "Bundle contents", file: "/downloads/pdfs/creator-bundle/bundle-contents.pdf" },
      { label: "Landing layout guide", file: "/downloads/pdfs/creator-landing-kit/layout-guide.pdf" },
      { label: "Brand guide", file: "/downloads/pdfs/brand-kit-essentials/brand-guide.pdf" },
      { label: "Business playbook ebook", file: "/downloads/pdfs/digital-business-playbook/digital-business-playbook.pdf" },
    ],
    publishedAt: "2026-08-12",
    status: "published",
    downloadFile: "/downloads/creator-bundle.zip",
    fileName: "creator-bundle.zip",
    fileSize: "8 PDFs in ZIP",
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

/** Worldwide store prices are USD. */
export function formatMoney(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const formatINR = formatMoney;
