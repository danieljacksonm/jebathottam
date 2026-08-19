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

export const FEATURED_ORDER = [
  "ebenezer-saas",
  "whatsapp-business-kit",
  "invoice-receipt-templates",
  "creator-landing-kit",
  "social-media-caption-pack",
  "church-admin-kit",
  "creator-bundle",
  "shop-pos-starter-pack",
  "brand-kit-essentials",
  "digital-business-playbook",
  "travel-enquiry-pack",
  "free-enquiry-form-kit",
] as const;

export const STORE_PRODUCTS: StoreProduct[] = [
  /* ── 1. Ebenezer SaaS ────────────────────────────────── */
  {
    id: "dp-yegova",
    slug: "ebenezer-saas",
    name: "Ebenezer SaaS — Billing Software for Global Shops",
    tagline: "Cloud billing, stock, and reports built for shop owners worldwide.",
    description:
      "Ebenezer SaaS is a cloud billing app for small and medium shops worldwide. Create invoices, quotations, and credit notes, track stock and customers, and print on A4, A5, or thermal printers. No installation needed — works from any browser on any device.",
    story:
      "Built after watching hundreds of small shop owners still manage billing on paper or spreadsheets in 2026. Ebenezer SaaS started free so every shop owner, anywhere, can try it with zero risk before the paid plan launches.",
    category: "Software",
    price: 0,
    badge: "FREE",
    isFree: true,
    isSoftware: true,
    externalUrl: "/saas",
    externalCta: "Get started free",
    image: U("photo-1556742049-0cfed4f6a45d"),
    gallery: [
      U("photo-1556742049-0cfed4f6a45d"),
      U("photo-1556740758-90de374c12ad"),
      U("photo-1460925895917-afdab827c52f"),
      U("photo-1554224155-6726b3ff858f"),
    ],
    features: [
      "Invoices, quotations, and credit notes — create in seconds",
      "Stock and inventory tracking with low-stock alerts",
      "Customer database with full purchase history",
      "Expense tracking with category summaries",
      "Print support for A4, A5, and 80mm thermal printers",
      "Team logins with role-based permissions",
      "Daily, weekly, and monthly sales reports",
      "Works offline — data syncs when connection returns",
    ],
    includes: [
      "Full access to the current free plan — no credit card",
      "Invoicing, quotations, credit notes, and billing",
      "Stock management and customer database",
      "Expense tracking and sales reports",
      "Print to A4, A5, and thermal printers",
      "Getting started guide PDF (step-by-step setup)",
      "Feature sheet PDF (complete feature overview)",
      "Sample invoice PDF (see the exact invoice format)",
    ],
    compatibility: ["Any modern browser", "Desktop", "Laptop", "Tablet", "Android", "iPhone", "Next.js", "NestJS"],
    license: ["Free Plan (current)", "Paid Starter Plan (coming soon)"],
    whoItIsFor:
      "Retail stores, traders, and shop owners worldwide who still bill on paper, Excel, or basic apps and want a fast, simple modern billing system.",
    downloadContentsPlan: [
      "Cloud web app — no download needed",
      "getting-started.pdf — step-by-step setup guide",
      "feature-sheet.pdf — all features explained",
      "sample-invoice.pdf — example invoice output",
    ],
    pdfs: [
      { label: "Getting started guide", file: "/downloads/pdfs/ebenezer-saas/getting-started.pdf" },
      { label: "Feature sheet", file: "/downloads/pdfs/ebenezer-saas/feature-sheet.pdf" },
      { label: "Sample invoice", file: "/downloads/pdfs/ebenezer-saas/sample-invoice.pdf" },
    ],
    publishedAt: "2026-08-12",
    status: "published",
    rating: 5,
    reviews: 14,
    seoTitle: "Ebenezer SaaS – Free Cloud Billing Software for Shops",
    seoDescription:
      "Ebenezer SaaS is free cloud billing software for shops — invoices, stock, customers, quotations, credit notes, and A4/A5/thermal printing. Start free today.",
  },

  /* ── 2. WhatsApp Business Kit (NEW — high earner) ───── */
  {
    id: "dp-wa-kit",
    slug: "whatsapp-business-kit",
    name: "WhatsApp Business Setup Kit",
    tagline: "Set up a professional WhatsApp Business presence in one afternoon.",
    description:
      "A complete, step-by-step kit to help any small business look professional on WhatsApp Business — from profile setup to automated replies, catalogue setup, product descriptions, broadcast message templates, and closing scripts. Used by shops, clinics, salons, travel agents, freelancers, and home businesses worldwide.",
    story:
      "Over 200 million small businesses use WhatsApp worldwide, but most look unprofessional: no profile photo, no bio, no catalogue, no auto-reply. This kit fixes all of that in one afternoon without any tech skill.",
    category: "Business Tools",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1611162617213-7d7a39e9b1d7"),
    gallery: [
      U("photo-1611162617213-7d7a39e9b1d7"),
      U("photo-1556742502-ec7c0e9f34b6"),
      U("photo-1512941937669-90a1b58e7e9c"),
      U("photo-1522202176988-66273c2fd55f"),
    ],
    features: [
      "Step-by-step WhatsApp Business profile setup guide",
      "40+ message templates (greetings, replies, follow-ups, closing)",
      "Catalogue setup guide with product description formula",
      "Broadcast message templates for offers and announcements",
      "Auto-reply setup — away message, greeting message, quick replies",
      "Customer label and chat organisation system",
      "WhatsApp Status post ideas (30-day plan)",
      "Do's and don'ts to avoid being blocked",
    ],
    includes: [
      "Setup guide PDF — profile, catalogue, auto-replies, labels (22 pages)",
      "40+ message templates PDF — greeting, follow-up, closing, offer (18 pages)",
      "Broadcast message pack PDF — 12 ready announcements",
      "WhatsApp Status ideas PDF — 30-day content plan",
      "Quick-reply shortcut list PDF — copy-paste inside the app",
      "Catalogue product description formula PDF",
      "Do's and don'ts PDF — how to avoid spam blocks",
      "Printable quick-reference card PDF",
    ],
    compatibility: ["WhatsApp Business (Android)", "WhatsApp Business (iPhone)", "WhatsApp Web", "Any device"],
    license: ["Personal License", "Commercial License — use for your clients"],
    whoItIsFor:
      "Shop owners, salons, clinics, freelancers, home businesses, travel agents, and any small business using WhatsApp to talk to customers worldwide.",
    downloadContentsPlan: [
      "01-setup-guide.pdf — complete profile + automation setup",
      "02-message-templates.pdf — 40+ ready-to-send messages",
      "03-broadcast-pack.pdf — 12 offer/announcement templates",
      "04-status-ideas.pdf — 30-day WhatsApp Status plan",
      "05-quick-replies.pdf — shortcut list for the app",
      "06-catalogue-guide.pdf — product description formula",
      "07-dos-and-donts.pdf — avoid spam blocks",
      "08-quick-reference-card.pdf — print and keep at desk",
    ],
    pdfs: [
      { label: "Setup guide (22 pages)", file: "/downloads/pdfs/whatsapp-business-kit/setup-guide.pdf" },
      { label: "40+ message templates", file: "/downloads/pdfs/whatsapp-business-kit/message-templates.pdf" },
      { label: "Broadcast message pack", file: "/downloads/pdfs/whatsapp-business-kit/broadcast-pack.pdf" },
      { label: "30-day Status ideas", file: "/downloads/pdfs/whatsapp-business-kit/status-ideas.pdf" },
      { label: "Do's and don'ts guide", file: "/downloads/pdfs/whatsapp-business-kit/dos-and-donts.pdf" },
    ],
    publishedAt: "2026-08-19",
    status: "published",
    rating: 5,
    reviews: 0,
    downloadFile: "/downloads/whatsapp-business-kit.zip",
    fileName: "whatsapp-business-kit.zip",
    fileSize: "8 PDFs in ZIP",
    seoTitle: "WhatsApp Business Setup Kit – Templates, Auto-Replies & Catalogue Guide",
    seoDescription:
      "Complete WhatsApp Business setup kit — profile guide, 40+ message templates, broadcast pack, catalogue setup, and auto-reply scripts. Free download.",
  },

  /* ── 3. Invoice & Receipt Templates (NEW — top seller) ─ */
  {
    id: "dp-invoice",
    slug: "invoice-receipt-templates",
    name: "Invoice & Receipt Template Pack",
    tagline: "Professional invoice and receipt templates for any small business — print or PDF.",
    description:
      "A complete collection of invoice, receipt, and quotation templates in clean, professional formats. Covers A4 and thermal printer sizes, service businesses and product businesses, single-item and multi-item layouts. Every template is Word/Google Docs editable and also available as a ready-to-print PDF.",
    story:
      "Thousands of small businesses still write receipts by hand or use badly formatted spreadsheets. A professionally designed invoice builds trust and gets paid faster. This pack gives every business type a template that looks like it was designed by a professional.",
    category: "Templates",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1554224155-6726b3ff858f"),
    gallery: [
      U("photo-1554224155-6726b3ff858f"),
      U("photo-1460925895917-afdab827c52f"),
      U("photo-1611532736597-de2d4265fba3"),
      U("photo-1450101499163-c8848c66ca85"),
    ],
    features: [
      "6 invoice layouts — service, product, hourly, project, medical, and event",
      "A4 and 80mm thermal printer versions of every template",
      "Receipt, quotation, and delivery note formats",
      "GST/VAT-ready and non-tax versions",
      "Editable in Word, Google Docs, or any PDF editor",
      "Company logo placeholder — drop in your own",
      "Automatic total calculation formula (in editable versions)",
      "Printable and digital (email/WhatsApp) versions",
    ],
    includes: [
      "6 invoice templates PDF — service, product, hourly, project, medical, event (A4)",
      "3 thermal invoice templates PDF — 80mm POS receipt size",
      "Quotation template PDF — with validity date and terms",
      "Delivery note / challan template PDF",
      "Payment receipt template PDF (for cash/UPI/card)",
      "GST invoice template PDF — with tax breakdown",
      "How to fill guide PDF — field-by-field explanation",
      "Quick branding guide PDF — add your logo and colors",
    ],
    compatibility: ["PDF", "Microsoft Word", "Google Docs", "Any printer", "A4", "80mm thermal", "Email", "WhatsApp"],
    license: ["Personal License", "Commercial License — use for your clients"],
    whoItIsFor:
      "Shops, freelancers, service providers, consultants, restaurants, clinics, event organizers, and any business that needs professional billing documents.",
    downloadContentsPlan: [
      "01-service-invoice.pdf — for consultants, freelancers, agencies",
      "02-product-invoice.pdf — for shops, retailers, wholesalers",
      "03-thermal-receipts.pdf — A4 + 80mm thermal versions",
      "04-quotation-template.pdf — with terms and validity",
      "05-delivery-note.pdf — challan / delivery receipt",
      "06-payment-receipt.pdf — for cash, UPI, card payments",
      "07-gst-invoice.pdf — GST breakdown version",
      "08-how-to-fill.pdf — step-by-step instructions",
    ],
    pdfs: [
      { label: "Service invoice templates (A4)", file: "/downloads/pdfs/invoice-receipt-templates/service-invoice.pdf" },
      { label: "Product invoice templates (A4)", file: "/downloads/pdfs/invoice-receipt-templates/product-invoice.pdf" },
      { label: "Thermal receipt templates (80mm)", file: "/downloads/pdfs/invoice-receipt-templates/thermal-receipts.pdf" },
      { label: "Quotation template", file: "/downloads/pdfs/invoice-receipt-templates/quotation-template.pdf" },
      { label: "Payment receipt template", file: "/downloads/pdfs/invoice-receipt-templates/payment-receipt.pdf" },
      { label: "GST invoice template", file: "/downloads/pdfs/invoice-receipt-templates/gst-invoice.pdf" },
    ],
    publishedAt: "2026-08-19",
    status: "published",
    rating: 5,
    reviews: 0,
    downloadFile: "/downloads/invoice-receipt-templates.zip",
    fileName: "invoice-receipt-templates.zip",
    fileSize: "8 PDFs in ZIP",
    seoTitle: "Invoice & Receipt Templates – Professional Billing Templates for Small Business",
    seoDescription:
      "Professional invoice, receipt, quotation, and delivery note templates. A4 and thermal versions. Word + PDF. Free download for any small business.",
  },

  /* ── 4. Creator Landing Kit ──────────────────────────── */
  {
    id: "dp-landing",
    slug: "creator-landing-kit",
    name: "Creator Landing Page Kit",
    tagline: "Build a professional landing page for your offer without a designer.",
    description:
      "A complete, detailed kit to help creators, coaches, and freelancers plan and build a landing page that converts — without guessing at layout, copy, or structure. Contains a section-by-section layout guide, fill-in-the-blank copy templates, a mobile UX checklist, and a complete launch checklist to make sure nothing is missing before you go live.",
    story:
      "Most creators spend weeks 'designing' a landing page and never launch it. This kit removes every design decision and guessing moment. You fill in the blanks, place the sections in order, and publish — not design.",
    category: "UI Kits",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1507238691740-187a5b1d37b8"),
    gallery: [
      U("photo-1507238691740-187a5b1d37b8"),
      U("photo-1467232004584-a241de8bcf5d"),
      U("photo-1498050108023-c5249f4df085"),
      U("photo-1547658719-da2b51169166"),
      U("photo-1522542550221-31fd19575a2d"),
    ],
    features: [
      "Section-by-section layout guide (hero, offer, proof, pricing, FAQ, CTA)",
      "Fill-in-the-blank headline and tagline formulas",
      "Full copy template: hero, what you get, who it's for, pricing, FAQ, footer",
      "Mobile UX checklist — 22 items to check before publishing",
      "Conversion checklist — 18 things that make visitors buy",
      "Trust signal placement guide — where to put reviews, guarantees, logos",
      "Above-the-fold formula — what must appear in the first screen",
      "Launch checklist — everything to verify on go-live day",
    ],
    includes: [
      "Layout guide PDF — 7 sections explained with diagram and purpose (24 pages)",
      "Copy templates PDF — fill-in-the-blank for every section (28 pages)",
      "Mobile UX checklist PDF — 22-item check before publishing",
      "Conversion checklist PDF — 18 trust and conversion factors",
      "Above-the-fold formula PDF — first screen structure guide",
      "Launch day checklist PDF — 15-step go-live verification",
      "Headline formula sheet PDF — 12 proven headline structures with examples",
    ],
    compatibility: ["Framer", "Webflow", "WordPress", "Squarespace", "Wix", "Carrd", "HTML/CSS", "Figma", "Canva"],
    license: ["Personal License", "Commercial License — use for client projects"],
    whoItIsFor:
      "Coaches, consultants, course creators, freelancers, and service providers who need a landing page but do not want to hire a designer or spend weeks on it.",
    downloadContentsPlan: [
      "01-layout-guide.pdf — 7-section landing page structure (24 pages)",
      "02-copy-templates.pdf — fill-in-the-blank copy for every section (28 pages)",
      "03-mobile-ux-checklist.pdf — 22 items before publishing",
      "04-conversion-checklist.pdf — 18 trust and conversion factors",
      "05-above-the-fold-formula.pdf — first screen structure",
      "06-launch-checklist.pdf — go-live verification (15 steps)",
      "07-headline-formulas.pdf — 12 proven structures with examples",
    ],
    pdfs: [
      { label: "Layout guide (24 pages)", file: "/downloads/pdfs/creator-landing-kit/layout-guide.pdf" },
      { label: "Copy templates (28 pages)", file: "/downloads/pdfs/creator-landing-kit/copy-templates.pdf" },
      { label: "Mobile UX checklist", file: "/downloads/pdfs/creator-landing-kit/mobile-checklist.pdf" },
      { label: "Conversion checklist", file: "/downloads/pdfs/creator-landing-kit/conversion-checklist.pdf" },
      { label: "Headline formula sheet", file: "/downloads/pdfs/creator-landing-kit/headline-formulas.pdf" },
    ],
    publishedAt: "2026-08-11",
    status: "published",
    rating: 5,
    reviews: 7,
    downloadFile: "/downloads/creator-landing-kit.zip",
    fileName: "creator-landing-kit.zip",
    fileSize: "7 PDFs in ZIP",
    seoTitle: "Creator Landing Page Kit – Layout, Copy & Conversion Templates",
    seoDescription:
      "Free landing page kit for coaches, creators, and freelancers. Section layout guide, fill-in-the-blank copy, mobile checklist, and launch day checklist.",
  },

  /* ── 5. Social Media Caption Pack (NEW) ─────────────── */
  {
    id: "dp-social-captions",
    slug: "social-media-caption-pack",
    name: "Social Media Caption Pack",
    tagline: "365 ready-to-post captions for small businesses — sorted by industry and post type.",
    description:
      "A complete caption pack with 365 ready-to-use social media captions organised by industry, post type, and day of the week. Covers product shops, service businesses, restaurants, travel agents, salons, clinics, and general small businesses. Includes hashtag sets, bio formulas, and a 30-day posting plan you can repeat.",
    story:
      "Most small businesses skip social media because they do not know what to write. This pack removes the blank-page problem — open the sheet, pick a caption for today, paste and post. Built from studying what actually works for small business accounts worldwide.",
    category: "Templates",
    price: 0,
    badge: "NEW",
    isFree: true,
    image: U("photo-1611162616305-c69b3fa7fbe0"),
    gallery: [
      U("photo-1611162616305-c69b3fa7fbe0"),
      U("photo-1562577309-4932fdd64cd1"),
      U("photo-1432888498266-38ffec3eaf0a"),
      U("photo-1504270997636-07ddfbd48945"),
    ],
    features: [
      "365 captions — one for every day of the year",
      "Sorted by 7 business types: shop, service, restaurant, travel, salon, clinic, general",
      "Post-type sorting: product, offer, tip, story, review request, festive",
      "Hashtag sets for each industry — researched and categorised by size",
      "Instagram and Facebook bio formula sheet",
      "30-day posting plan calendar — print or use in Google Calendar",
      "Emojis and tone guide — formal, friendly, and energetic versions",
      "How-to guide — personalising captions for your brand voice",
    ],
    includes: [
      "365 captions PDF — indexed by business type and post type (64 pages)",
      "Hashtag master list PDF — 200+ hashtags sorted by industry and size",
      "Instagram bio formula PDF — 6 proven formats with examples",
      "30-day posting plan PDF — printable calendar with content suggestions",
      "Caption personalisation guide PDF — making any caption fit your brand",
      "Festive caption pack PDF — 40+ captions for major holidays worldwide",
      "Quick-post idea list PDF — when you have nothing to post",
    ],
    compatibility: ["Instagram", "Facebook", "WhatsApp Status", "LinkedIn", "Threads", "Any social platform"],
    license: ["Personal License", "Commercial License — use for client accounts"],
    whoItIsFor:
      "Small shop owners, service providers, restaurants, salons, clinics, and any business that wants to stay active on social media without spending hours writing captions.",
    downloadContentsPlan: [
      "01-365-captions.pdf — full caption library by industry (64 pages)",
      "02-hashtag-master-list.pdf — 200+ hashtags by industry and size",
      "03-instagram-bio-formulas.pdf — 6 formats with examples",
      "04-30-day-posting-plan.pdf — printable content calendar",
      "05-personalisation-guide.pdf — make captions fit your brand",
      "06-festive-caption-pack.pdf — 40+ holiday captions worldwide",
      "07-quick-post-ideas.pdf — emergency post ideas when you're stuck",
    ],
    pdfs: [
      { label: "365 captions — full library (64 pages)", file: "/downloads/pdfs/social-media-caption-pack/365-captions.pdf" },
      { label: "Hashtag master list (200+)", file: "/downloads/pdfs/social-media-caption-pack/hashtag-master-list.pdf" },
      { label: "Instagram bio formulas", file: "/downloads/pdfs/social-media-caption-pack/instagram-bio-formulas.pdf" },
      { label: "30-day posting plan", file: "/downloads/pdfs/social-media-caption-pack/30-day-posting-plan.pdf" },
      { label: "Festive caption pack", file: "/downloads/pdfs/social-media-caption-pack/festive-caption-pack.pdf" },
    ],
    publishedAt: "2026-08-19",
    status: "published",
    rating: 5,
    reviews: 0,
    downloadFile: "/downloads/social-media-caption-pack.zip",
    fileName: "social-media-caption-pack.zip",
    fileSize: "7 PDFs in ZIP",
    seoTitle: "Social Media Caption Pack – 365 Captions for Small Businesses",
    seoDescription:
      "365 ready-to-post social media captions for shops, restaurants, salons, clinics, and service businesses. Hashtag sets, posting plan, and bio formulas included.",
  },

  /* ── 6. Church Admin Kit (NEW — great niche) ─────────── */
  {
    id: "dp-church-admin",
    slug: "church-admin-kit",
    name: "Church Admin & Communication Kit",
    tagline: "Notice sheets, letters, attendance forms, and announcement templates for churches.",
    description:
      "A complete admin and communication kit made specifically for churches, prayer groups, and faith communities. Contains weekly announcement sheet templates, letter formats (welcome, membership, condolence, congratulations), attendance and tithe forms, Sunday bulletin layouts, WhatsApp broadcast templates, and a church event planning checklist.",
    story:
      "Church administrators spend hours every week re-creating announcement sheets and letters from scratch. This kit provides a complete, dignified template set that any church of any size can use immediately, professionally, and for free.",
    category: "Templates",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1438032005730-c779502df39b"),
    gallery: [
      U("photo-1438032005730-c779502df39b"),
      U("photo-1523803326055-9729b9e02e5a"),
      U("photo-1505664194779-8beaceb5bf9b"),
      U("photo-1450101499163-c8848c66ca85"),
    ],
    features: [
      "Weekly announcement sheet / Sunday bulletin template",
      "10 letter templates — welcome, membership, condolence, birthday, and more",
      "Attendance register and tithe record form templates",
      "WhatsApp broadcast templates for service reminders and events",
      "Event planning checklist for services, conferences, and outreach",
      "Church newsletter one-page layout template",
      "Prayer request form template",
      "Volunteer and team roster form template",
    ],
    includes: [
      "Weekly announcement sheet PDF — A4 bulletin template (front + back, 2 layouts)",
      "10 letter templates PDF — full-text, formal church letters (32 pages)",
      "Attendance and tithe forms PDF — weekly + monthly register layouts",
      "WhatsApp broadcast scripts PDF — 20+ ready announcements",
      "Event planning checklist PDF — 40-item church event coordinator guide",
      "Church newsletter template PDF — 1-page and 2-page layouts",
      "Prayer request form PDF — printable and digital versions",
      "Volunteer roster template PDF — weekly and monthly formats",
    ],
    compatibility: ["PDF", "Microsoft Word", "Google Docs", "Any printer", "WhatsApp", "Email"],
    license: ["Free for any church or ministry — no commercial restrictions"],
    whoItIsFor:
      "Church administrators, pastors, deacons, and volunteers in any denomination who handle weekly admin, communication, and event coordination.",
    downloadContentsPlan: [
      "01-announcement-sheet.pdf — A4 Sunday bulletin (2 layouts)",
      "02-church-letters.pdf — 10 complete letter templates (32 pages)",
      "03-attendance-tithe-forms.pdf — register layouts weekly + monthly",
      "04-whatsapp-broadcasts.pdf — 20+ service and event announcements",
      "05-event-checklist.pdf — 40-item church event planning guide",
      "06-newsletter-template.pdf — 1-page and 2-page layouts",
      "07-prayer-request-form.pdf — printable + digital version",
      "08-volunteer-roster.pdf — weekly and monthly formats",
    ],
    pdfs: [
      { label: "Sunday announcement sheet (2 layouts)", file: "/downloads/pdfs/church-admin-kit/announcement-sheet.pdf" },
      { label: "10 church letter templates (32 pages)", file: "/downloads/pdfs/church-admin-kit/church-letters.pdf" },
      { label: "Attendance and tithe forms", file: "/downloads/pdfs/church-admin-kit/attendance-tithe-forms.pdf" },
      { label: "WhatsApp broadcast scripts (20+)", file: "/downloads/pdfs/church-admin-kit/whatsapp-broadcasts.pdf" },
      { label: "Event planning checklist (40 items)", file: "/downloads/pdfs/church-admin-kit/event-checklist.pdf" },
    ],
    publishedAt: "2026-08-19",
    status: "published",
    rating: 5,
    reviews: 0,
    downloadFile: "/downloads/church-admin-kit.zip",
    fileName: "church-admin-kit.zip",
    fileSize: "8 PDFs in ZIP",
    seoTitle: "Church Admin Kit – Announcement Sheets, Letters & Forms for Churches",
    seoDescription:
      "Complete church administration kit — Sunday bulletin templates, 10 letter formats, attendance forms, WhatsApp scripts, and event planning checklist. Free.",
  },

  /* ── 7. Shop + POS Starter Pack ─────────────────────── */
  {
    id: "dp-pos",
    slug: "shop-pos-starter-pack",
    name: "Shop + POS Starter Pack",
    tagline: "A complete blueprint for planning or building a shop billing and POS system.",
    description:
      "A professional documentation and UI blueprint kit for anyone planning, designing, or building a shop billing or POS system. Covers screen-by-screen UI layouts, invoice and receipt formats for all printer sizes, stock flow diagrams, staff process guides, and a detailed checklist for choosing between buying or building your own system.",
    story:
      "Made for shop owners and developers who need a clear, complete structure before committing to a POS system — so they know exactly what screens, flows, and formats they need before spending money or time.",
    category: "Business Tools",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1556740738-b6a63e62c1d5"),
    gallery: [
      U("photo-1556740738-b6a63e62c1d5"),
      U("photo-1441986300917-64674bd600d8"),
      U("photo-1556742111-a301076d9d18"),
      U("photo-1556741533-6e6a62bd8b49"),
    ],
    features: [
      "Screen-by-screen UI blueprint — billing, stock, customers, reports",
      "Sample invoice, quotation, and receipt formats (A4 and thermal)",
      "Stock-in / stock-out process flow diagram",
      "Staff roles and permission structure guide",
      "Customer data fields and history flow",
      "End-of-day closing process checklist",
      "Buy vs build decision framework",
      "Top 10 POS software comparison guide",
    ],
    includes: [
      "UI blueprint PDF — 12 annotated screen diagrams with field labels (28 pages)",
      "Invoice and receipt samples PDF — A4 service, A4 product, 80mm thermal",
      "Stock flow diagram PDF — receiving, tracking, and alerting",
      "Staff roles guide PDF — owner, manager, cashier, stock clerk permissions",
      "Customer flow PDF — capture, history, credit, and loyalty tracking",
      "End-of-day process checklist PDF — 18-step daily closing guide",
      "Buy vs build checklist PDF — 24-question decision framework",
      "POS software guide PDF — 10 options compared (features and price)",
    ],
    compatibility: ["Any POS or billing platform", "No-code tools", "Custom software reference", "Figma", "PDF"],
    license: ["Personal License", "Commercial License — use for client projects"],
    whoItIsFor: "Shop owners planning to digitize billing, developers and students building a POS project, and consultants advising small retailers.",
    downloadContentsPlan: [
      "01-ui-blueprint.pdf — 12 screen diagrams annotated (28 pages)",
      "02-invoice-samples.pdf — A4 service, A4 product, 80mm thermal",
      "03-stock-flow.pdf — receive, track, alert process diagram",
      "04-staff-roles.pdf — permissions by role (owner to cashier)",
      "05-customer-flow.pdf — capture, history, credit tracking",
      "06-end-of-day-checklist.pdf — 18-step daily closing",
      "07-buy-vs-build.pdf — 24-question decision framework",
      "08-pos-comparison.pdf — 10 POS options compared",
    ],
    pdfs: [
      { label: "UI blueprint (28 pages, 12 screens)", file: "/downloads/pdfs/shop-pos-starter-pack/ui-blueprint.pdf" },
      { label: "Invoice + receipt samples (all sizes)", file: "/downloads/pdfs/shop-pos-starter-pack/invoice-samples.pdf" },
      { label: "Stock flow diagram", file: "/downloads/pdfs/shop-pos-starter-pack/stock-flow.pdf" },
      { label: "Buy vs build checklist (24 questions)", file: "/downloads/pdfs/shop-pos-starter-pack/pos-selection-checklist.pdf" },
      { label: "POS software comparison (10 options)", file: "/downloads/pdfs/shop-pos-starter-pack/pos-comparison.pdf" },
    ],
    publishedAt: "2026-08-10",
    status: "published",
    rating: 5,
    reviews: 3,
    downloadFile: "/downloads/shop-pos-starter-pack.zip",
    fileName: "shop-pos-starter-pack.zip",
    fileSize: "8 PDFs in ZIP",
    seoTitle: "Shop + POS Starter Pack – Billing System Blueprint for Small Shops",
    seoDescription:
      "Complete POS planning kit — UI blueprints, invoice formats, stock flow, staff roles, and buy-vs-build checklist. Free for shops, developers, and consultants.",
  },

  /* ── 8. Travel Enquiry Pack ──────────────────────────── */
  {
    id: "dp-travel",
    slug: "travel-enquiry-pack",
    name: "Travel Agent Enquiry & Lead Kit",
    tagline: "Stop losing travel enquiries — a complete lead capture and follow-up system.",
    description:
      "A complete lead management kit for travel agents and tour operators worldwide. Contains detailed enquiry forms, WhatsApp follow-up message sequences, quotation formats, a lead tracker sheet, a customer information checklist, and a guide to closing tour bookings over WhatsApp and phone without pressure tactics.",
    story:
      "Most small travel agents lose 60–70% of their enquiries because there is no system to capture and follow up. Enquiries come in on WhatsApp, calls go unanswered, and leads get forgotten. This kit builds a simple system that any solo or small travel agent can run without software.",
    category: "Templates",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1488646953014-85cb44e25828"),
    gallery: [
      U("photo-1488646953014-85cb44e25828"),
      U("photo-1436491865332-7a61a109cc05"),
      U("photo-1503220317375-aaad61436b1b"),
      U("photo-1526772662000-3f88f10405ff"),
    ],
    features: [
      "Detailed travel enquiry form — 24 fields capturing trip requirements properly",
      "WhatsApp follow-up sequence — Day 1, Day 3, Day 7 messages",
      "Tour quotation format with terms, inclusions, and exclusions",
      "Lead tracker sheet — Google Sheets template with status tracking",
      "Customer information checklist — passport, ID, dietary, special needs",
      "Closing scripts — how to confirm a booking without pressure",
      "Deposit and payment confirmation message templates",
      "Post-trip review request scripts",
    ],
    includes: [
      "Travel enquiry form PDF — printable + Google Form field list (24 fields)",
      "WhatsApp follow-up sequence PDF — 9 messages across 3 follow-up stages",
      "Tour quotation template PDF — inclusions, exclusions, terms, payment",
      "Lead tracker sheet PDF — with CSV/Google Sheets import instructions",
      "Customer info checklist PDF — documents, dietary, special requirements",
      "Closing scripts PDF — 6 proven booking confirmation approaches",
      "Deposit confirmation message pack PDF — 5 payment confirmation templates",
      "Review request script PDF — post-trip feedback collection",
    ],
    compatibility: ["Google Forms", "Google Sheets", "Excel", "WhatsApp Business", "PDF", "Any phone"],
    license: ["Personal License", "Commercial License — use for your agency clients"],
    whoItIsFor: "Solo travel agents, small tour operators, and travel agency staff worldwide who take enquiries over WhatsApp, phone, or walk-in.",
    downloadContentsPlan: [
      "01-enquiry-form.pdf — 24-field travel enquiry form (printable + Google Form list)",
      "02-whatsapp-sequence.pdf — 9-message follow-up across 3 stages",
      "03-quotation-template.pdf — with inclusions, exclusions, terms",
      "04-lead-tracker.pdf — sheet with CSV import instructions",
      "05-customer-checklist.pdf — documents + dietary + special needs",
      "06-closing-scripts.pdf — 6 booking confirmation approaches",
      "07-deposit-confirmations.pdf — 5 payment message templates",
      "08-review-requests.pdf — post-trip feedback scripts",
    ],
    pdfs: [
      { label: "Travel enquiry form (24 fields)", file: "/downloads/pdfs/travel-enquiry-pack/enquiry-form.pdf" },
      { label: "WhatsApp follow-up sequence (9 messages)", file: "/downloads/pdfs/travel-enquiry-pack/whatsapp-scripts.pdf" },
      { label: "Tour quotation template", file: "/downloads/pdfs/travel-enquiry-pack/quotation-template.pdf" },
      { label: "Closing scripts (6 approaches)", file: "/downloads/pdfs/travel-enquiry-pack/closing-scripts.pdf" },
      { label: "Review request scripts", file: "/downloads/pdfs/travel-enquiry-pack/review-requests.pdf" },
    ],
    publishedAt: "2026-08-09",
    status: "published",
    rating: 5,
    reviews: 2,
    downloadFile: "/downloads/travel-enquiry-pack.zip",
    fileName: "travel-enquiry-pack.zip",
    fileSize: "8 PDFs in ZIP",
    seoTitle: "Travel Agent Enquiry Kit – Lead Forms, Follow-Up Scripts & Closing Templates",
    seoDescription:
      "Complete travel agent lead kit — 24-field enquiry form, WhatsApp follow-up sequences, tour quotation template, and closing scripts. Free download.",
  },

  /* ── 9. Digital Business Playbook ───────────────────── */
  {
    id: "dp-playbook",
    slug: "digital-business-playbook",
    name: "Digital Business Playbook",
    tagline: "The honest, practical guide to taking your small business online — no jargon.",
    description:
      "A comprehensive ebook for small business owners who want to start selling and promoting online but do not know where to start. Covers platform selection, pricing your offer for online, setting up WhatsApp Business, creating a basic social media plan, building trust online, handling online payments, and the most common costly mistakes to avoid. Written in plain language with real examples from small businesses in India, Africa, and Southeast Asia.",
    story:
      "Written because most 'go digital' advice online is either too advanced, too expensive, or written for Western businesses. This playbook is for the shop owner in Coimbatore, the tailor in Nairobi, the travel agent in Manila — people building real businesses in real markets.",
    category: "Ebooks",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1454165804606-c3d57bc86b40"),
    gallery: [
      U("photo-1454165804606-c3d57bc86b40"),
      U("photo-1434030216411-0b793f4b4173"),
      U("photo-1516321318423-f06f85e504b3"),
    ],
    features: [
      "Chapter 1 — Understanding the real opportunity (what digital means for your business)",
      "Chapter 2 — Choosing the right platform (WhatsApp, Instagram, website, or all three?)",
      "Chapter 3 — Pricing your product or service for online customers",
      "Chapter 4 — WhatsApp Business: the complete setup guide",
      "Chapter 5 — Your first 30 days on social media",
      "Chapter 6 — Building trust online (reviews, photos, communication)",
      "Chapter 7 — Online payments — which options to use and how to explain them",
      "Chapter 8 — 12 mistakes small businesses make and how to avoid them",
    ],
    includes: [
      "Full ebook PDF — 8 chapters, 56 pages, printable and phone-friendly",
      "7-day action checklist PDF — first week task list with daily priorities",
      "30-day social media plan PDF — content ideas for first month",
      "Platform comparison guide PDF — WhatsApp, Instagram, Facebook, website vs shop app",
      "Pricing for online guide PDF — how to adjust your prices for digital sales",
      "WhatsApp Business quick-setup card PDF — one-page step guide",
    ],
    compatibility: ["PDF on phone", "Tablet", "Computer", "Kindle", "Print"],
    license: ["Personal License", "Team/Business License — share with your staff"],
    whoItIsFor:
      "Small shop owners, service providers, home businesses, and first-time founders in any country who are ready to go online but do not know where to start.",
    downloadContentsPlan: [
      "01-digital-business-playbook.pdf — full 8-chapter ebook (56 pages)",
      "02-7-day-checklist.pdf — first week task list",
      "03-30-day-social-plan.pdf — content ideas for first month",
      "04-platform-comparison.pdf — WhatsApp vs Instagram vs website",
      "05-pricing-for-online.pdf — adjusting prices for digital",
      "06-whatsapp-quickstart.pdf — one-page setup card",
    ],
    pdfs: [
      { label: "Full ebook — 8 chapters (56 pages)", file: "/downloads/pdfs/digital-business-playbook/digital-business-playbook.pdf" },
      { label: "7-day action checklist", file: "/downloads/pdfs/digital-business-playbook/7-day-checklist.pdf" },
      { label: "30-day social media plan", file: "/downloads/pdfs/digital-business-playbook/30-day-social-plan.pdf" },
      { label: "Platform comparison guide", file: "/downloads/pdfs/digital-business-playbook/platform-comparison.pdf" },
    ],
    publishedAt: "2026-08-08",
    status: "published",
    rating: 5,
    reviews: 5,
    downloadFile: "/downloads/digital-business-playbook.zip",
    fileName: "digital-business-playbook.zip",
    fileSize: "6 PDFs in ZIP",
    seoTitle: "Digital Business Playbook – Guide for Small Businesses Going Online",
    seoDescription:
      "Honest, practical ebook for small business owners going digital. 8 chapters covering platforms, WhatsApp Business, pricing, social media, and common mistakes.",
  },

  /* ── 10. Brand Kit Essentials ────────────────────────── */
  {
    id: "dp-brand",
    slug: "brand-kit-essentials",
    name: "Brand Kit Essentials",
    tagline: "A professional starter brand system for small businesses — colors, fonts, logo guide, and social templates.",
    description:
      "A complete starter brand kit that gives any small business a consistent, professional visual identity without hiring a designer. Covers everything from color palette selection to font pairing, logo placement rules, social media post templates, business card layout guide, and a brand consistency checklist you can hand to anyone who creates materials for your business.",
    story:
      "Most small businesses post with random fonts and mismatched colors on every platform, which makes them look unprofessional — even when their product is excellent. This kit gives any owner a simple, fixed system that makes everything look intentional and consistent.",
    category: "Graphics",
    price: 0,
    badge: "FREE",
    isFree: true,
    image: U("photo-1561070791-2526d30994b5"),
    gallery: [
      U("photo-1561070791-2526d30994b5"),
      U("photo-1558655146-d09347e92766"),
      U("photo-1618005182384-a83a8bd57fbe"),
      U("photo-1542744173-8eaa3c4c0bb1"),
    ],
    features: [
      "Color palette selection guide — primary, secondary, and neutral combinations",
      "Font pairing guide — 8 pairs that work for small businesses",
      "Logo placement and sizing rules — what to do and not do",
      "Social media post structure — 4 templates for Instagram and Facebook",
      "Business card layout guide — what to include and how to format",
      "Brand voice guide — how to write consistently for your business",
      "Brand consistency checklist — 20 things to check on any material",
      "Quick-reference brand card — one-page summary to share with anyone",
    ],
    includes: [
      "Brand guide PDF — colors, fonts, logo rules, voice, and examples (36 pages)",
      "Color palette selection guide PDF — step-by-step color choice for any business",
      "Font pairing guide PDF — 8 combinations with where to use each",
      "Social post templates PDF — 4 layouts for Instagram and Facebook",
      "Business card layout guide PDF — 3 formats for different business types",
      "Brand consistency checklist PDF — 20-item quality check",
      "Quick-reference brand card PDF — one-page summary to share with staff or designers",
    ],
    compatibility: ["Canva", "Figma", "Adobe Express", "Microsoft Word", "Google Slides", "Any print shop"],
    license: ["Personal License", "Commercial License — use for client brand projects"],
    whoItIsFor: "Small business owners, shop owners, service providers, freelancers, and creators who want a consistent brand without the cost of a designer.",
    downloadContentsPlan: [
      "01-brand-guide.pdf — colors, fonts, logo, voice (36 pages)",
      "02-color-palette-guide.pdf — color selection step-by-step",
      "03-font-pairing-guide.pdf — 8 combinations with usage guide",
      "04-social-templates.pdf — 4 Instagram and Facebook layouts",
      "05-business-card-guide.pdf — 3 formats for different businesses",
      "06-consistency-checklist.pdf — 20-item quality check",
      "07-brand-card.pdf — one-page summary for staff or designers",
    ],
    pdfs: [
      { label: "Brand guide (36 pages)", file: "/downloads/pdfs/brand-kit-essentials/brand-guide.pdf" },
      { label: "Color palette selection guide", file: "/downloads/pdfs/brand-kit-essentials/color-palette-guide.pdf" },
      { label: "Font pairing guide (8 combinations)", file: "/downloads/pdfs/brand-kit-essentials/font-pairing-guide.pdf" },
      { label: "Social post templates (4 layouts)", file: "/downloads/pdfs/brand-kit-essentials/social-templates.pdf" },
      { label: "Brand consistency checklist", file: "/downloads/pdfs/brand-kit-essentials/consistency-checklist.pdf" },
    ],
    publishedAt: "2026-08-07",
    status: "published",
    rating: 5,
    reviews: 4,
    downloadFile: "/downloads/brand-kit-essentials.zip",
    fileName: "brand-kit-essentials.zip",
    fileSize: "7 PDFs in ZIP",
    seoTitle: "Brand Kit Essentials – Starter Brand System for Small Businesses",
    seoDescription:
      "Free brand kit with color guide, font pairings, logo rules, social templates, and consistency checklist. Professional look without hiring a designer.",
  },

  /* ── 11. Free Enquiry Form Kit ───────────────────────── */
  {
    id: "dp-free-form",
    slug: "free-enquiry-form-kit",
    name: "Free Business Enquiry Form Kit",
    tagline: "A professional enquiry form any business can use — printable and digital versions included.",
    description:
      "A genuinely useful, free enquiry form kit for any small business. Contains a detailed printable form, a digital Google Form field list, a WhatsApp enquiry script, and a simple follow-up process guide. Works for any business type — shop, service, clinic, event, or freelance.",
    story:
      "Every business needs a way to properly capture what a customer wants. Most use a scrap of paper or a scattered WhatsApp chat. This form gives any business a professional, complete capture method — free, with no strings attached.",
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
      "Detailed printable enquiry form — 18 fields covering any business type",
      "Google Form field list — paste directly into Google Forms",
      "WhatsApp enquiry script — how to ask the right questions on chat",
      "Follow-up process guide — what to do after you receive an enquiry",
      "Industry-specific field suggestions — shop, service, clinic, event, freelance",
    ],
    includes: [
      "Printable enquiry form PDF — 18-field universal form (A4)",
      "Google Forms field list PDF — copy-paste field labels and types",
      "WhatsApp enquiry script PDF — structured question sequence for chat",
      "Follow-up process guide PDF — simple 4-step enquiry response system",
      "Industry field suggestions PDF — extra fields for 5 business types",
    ],
    compatibility: ["PDF", "Google Forms", "Google Docs", "Microsoft Word", "Any printer", "WhatsApp"],
    license: ["Free — personal and commercial use, no restrictions"],
    whoItIsFor: "Any small business, freelancer, or service provider who needs a proper way to capture and understand customer enquiries.",
    downloadContentsPlan: [
      "01-enquiry-form.pdf — 18-field universal form",
      "02-google-form-fields.pdf — copy-paste into Google Forms",
      "03-whatsapp-script.pdf — structured chat question sequence",
      "04-follow-up-guide.pdf — 4-step response system",
      "05-industry-fields.pdf — extra fields for 5 business types",
    ],
    pdfs: [
      { label: "Printable enquiry form (18 fields)", file: "/downloads/pdfs/free-enquiry-form-kit/enquiry-form.pdf" },
      { label: "Google Forms field list", file: "/downloads/pdfs/free-enquiry-form-kit/digital-fields.pdf" },
      { label: "WhatsApp enquiry script", file: "/downloads/pdfs/free-enquiry-form-kit/whatsapp-script.pdf" },
      { label: "Follow-up process guide", file: "/downloads/pdfs/free-enquiry-form-kit/follow-up-guide.pdf" },
    ],
    publishedAt: "2026-08-01",
    status: "published",
    rating: 5,
    reviews: 6,
    downloadFile: "/downloads/free-enquiry-form-kit.zip",
    fileName: "free-enquiry-form-kit.zip",
    fileSize: "5 PDFs in ZIP",
    seoTitle: "Free Business Enquiry Form Kit – Printable + Google Form + WhatsApp Script",
    seoDescription:
      "Free enquiry form kit for any small business. Printable A4 form, Google Forms field list, WhatsApp script, and follow-up guide. No cost, no signup.",
  },

  /* ── 12. Creator Bundle ──────────────────────────────── */
  {
    id: "dp-bundle",
    slug: "creator-bundle",
    name: "Creator Starter Bundle",
    tagline: "Landing page kit + brand kit + business playbook — everything to launch properly.",
    description:
      "A free bundle combining the three most essential kits for anyone starting or growing a business online — the Creator Landing Page Kit, Brand Kit Essentials, and Digital Business Playbook. Together these three kits cover your online presence (landing page), your visual identity (brand), and your strategy (playbook). Everything you need before spending money on ads or tools.",
    story:
      "Most people buy courses and tools before they have a basic, consistent online presence. This bundle gives you the three fundamentals first — free — so your next steps actually work.",
    category: "Bundles",
    price: 0,
    badge: "FREE",
    isFree: true,
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
      "Creator Landing Page Kit — 7 PDFs covering layout, copy, and launch checklist",
      "Brand Kit Essentials — 7 PDFs covering colors, fonts, logo, and social templates",
      "Digital Business Playbook — 6 PDFs including full 8-chapter ebook",
      "20 total PDFs across all three kits",
      "Structured to be used in order: brand first, then landing page, then playbook",
      "All files open in your browser before download",
    ],
    includes: [
      "Everything in Creator Landing Page Kit (7 PDFs)",
      "Everything in Brand Kit Essentials (7 PDFs)",
      "Everything in Digital Business Playbook (6 PDFs)",
      "Bundle contents index PDF — what's inside and what order to read",
      "ZIP with all 20+ PDFs organised in folders",
    ],
    compatibility: ["Figma", "Canva", "HTML", "Webflow", "PDF", "Printable"],
    license: ["Personal License", "Commercial License — use for client projects"],
    whoItIsFor:
      "Creators, coaches, freelancers, and small business owners launching or growing their online presence who want a solid foundation before investing in tools.",
    downloadContentsPlan: [
      "00-bundle-index.pdf — contents and reading order",
      "creator-landing-kit/ — 7 PDFs (layout, copy, checklists)",
      "brand-kit-essentials/ — 7 PDFs (colors, fonts, templates)",
      "digital-business-playbook/ — 6 PDFs (ebook + guides)",
    ],
    pdfs: [
      { label: "Bundle contents index", file: "/downloads/pdfs/creator-bundle/bundle-contents.pdf" },
      { label: "Landing page layout guide (24 pages)", file: "/downloads/pdfs/creator-landing-kit/layout-guide.pdf" },
      { label: "Brand guide (36 pages)", file: "/downloads/pdfs/brand-kit-essentials/brand-guide.pdf" },
      { label: "Business playbook ebook (56 pages)", file: "/downloads/pdfs/digital-business-playbook/digital-business-playbook.pdf" },
    ],
    publishedAt: "2026-08-12",
    status: "published",
    rating: 5,
    reviews: 8,
    downloadFile: "/downloads/creator-bundle.zip",
    fileName: "creator-bundle.zip",
    fileSize: "20+ PDFs in ZIP",
    seoTitle: "Creator Starter Bundle – Landing Page Kit + Brand Kit + Business Playbook",
    seoDescription:
      "Free bundle: landing page kit, brand kit, and digital business playbook — 20 PDFs covering your online presence, visual identity, and strategy.",
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

export function formatMoney(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const formatINR = formatMoney;
