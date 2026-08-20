export type StoreProductType =
  | "software"
  | "code_template"
  | "website_template"
  | "wordpress_theme"
  | "figma_kit"
  | "canva_template"
  | "ui_kit"
  | "graphics"
  | "digital_tool"
  | "ai_tool"
  | "bundle"
  | "ebook"
  | "documentation"
  | "free_resource";

export const PRODUCT_TYPE_OPTIONS: { value: StoreProductType; label: string; short: string }[] = [
  { value: "software", label: "Software", short: "Web App" },
  { value: "digital_tool", label: "Digital tool", short: "Tool" },
  { value: "ai_tool", label: "AI tool", short: "AI Tool" },
  { value: "website_template", label: "Website template", short: "HTML" },
  { value: "code_template", label: "Code template", short: "Code" },
  { value: "wordpress_theme", label: "WordPress theme", short: "WordPress" },
  { value: "figma_kit", label: "Figma kit", short: "Figma" },
  { value: "canva_template", label: "Canva template", short: "Canva" },
  { value: "ui_kit", label: "UI kit", short: "UI Kit" },
  { value: "graphics", label: "Graphics", short: "Graphics" },
  { value: "bundle", label: "Bundle", short: "Bundle" },
  { value: "ebook", label: "Ebook", short: "Ebook" },
  { value: "documentation", label: "Documentation", short: "Docs" },
  { value: "free_resource", label: "Free resource", short: "Free" },
];

export function productTypeLabel(type?: StoreProductType | string): string {
  return PRODUCT_TYPE_OPTIONS.find((o) => o.value === type)?.label || "Digital product";
}

export function productTypeShort(type?: StoreProductType | string): string {
  return PRODUCT_TYPE_OPTIONS.find((o) => o.value === type)?.short || "Product";
}

export type StoreCategoryPage = {
  slug: string;
  name: string;
  category: string;
  description: string;
  seoTitle: string;
  types?: StoreProductType[];
};

export const STORE_CATEGORY_PAGES: StoreCategoryPage[] = [
  {
    slug: "software",
    name: "Software & Tools",
    category: "Software & Tools",
    description: "Ready-to-use billing software, invoice tools, and business apps you can open and use today.",
    seoTitle: "Software & Tools | Ebenezer Store",
    types: ["software", "digital_tool", "ai_tool"],
  },
  {
    slug: "website-templates",
    name: "Website Templates",
    category: "Website Templates",
    description: "Downloadable HTML website templates with real source files — restaurant, travel, church, and more.",
    seoTitle: "Website Templates | Ebenezer Store",
    types: ["website_template"],
  },
  {
    slug: "nextjs-templates",
    name: "Code Templates",
    category: "Website Templates",
    description: "HTML, CSS, and JavaScript website templates you can edit and host anywhere.",
    seoTitle: "HTML & Code Templates | Ebenezer Store",
    types: ["code_template", "website_template"],
  },
  {
    slug: "canva-templates",
    name: "Canva Templates",
    category: "Creator",
    description: "Editable Canva design packs. Listed only when a real Canva file or share link exists.",
    seoTitle: "Canva Templates | Ebenezer Store",
    types: ["canva_template"],
  },
  {
    slug: "figma-ui-kits",
    name: "Figma UI Kits",
    category: "Creator",
    description: "Figma UI kits and design systems. Listed only when a real Figma file exists.",
    seoTitle: "Figma UI Kits | Ebenezer Store",
    types: ["figma_kit", "ui_kit"],
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    category: "Software & Tools",
    description: "AI generators and workflow tools — usable apps, not prompt PDFs.",
    seoTitle: "AI Tools | Ebenezer Store",
    types: ["ai_tool"],
  },
  {
    slug: "business-tools",
    name: "Business",
    category: "Business",
    description: "Business systems, WhatsApp kits, invoice tools, and shop resources.",
    seoTitle: "Business Tools | Ebenezer Store",
    types: ["digital_tool", "free_resource", "documentation"],
  },
  {
    slug: "church-templates",
    name: "Church & Ministry",
    category: "Church & Ministry",
    description: "Church website templates and ministry admin resources.",
    seoTitle: "Church Templates & Kits | Ebenezer Store",
  },
  {
    slug: "travel-templates",
    name: "Travel",
    category: "Travel",
    description: "Travel agency website templates and enquiry systems.",
    seoTitle: "Travel Templates & Kits | Ebenezer Store",
  },
  {
    slug: "restaurant",
    name: "Restaurant & Cafe",
    category: "Restaurant",
    description: "Restaurant and cafe websites, QR menus, and food business tools.",
    seoTitle: "Restaurant & Cafe Products | Ebenezer Store",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    category: "Real Estate",
    description: "Property and agent website templates you can edit and host.",
    seoTitle: "Real Estate Templates | Ebenezer Store",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    category: "Healthcare",
    description: "Clinic and healthcare website templates with booking CTAs.",
    seoTitle: "Healthcare Templates | Ebenezer Store",
  },
  {
    slug: "education",
    name: "Education",
    category: "Education",
    description: "Course and institute landing templates for coaches and schools.",
    seoTitle: "Education Templates | Ebenezer Store",
  },
  {
    slug: "ecommerce",
    name: "Ecommerce",
    category: "Ecommerce",
    description: "Shop landing pages and ecommerce starters. Real files only when ready.",
    seoTitle: "Ecommerce Products | Ebenezer Store",
  },
  {
    slug: "productivity",
    name: "Productivity",
    category: "Productivity",
    description: "Task trackers, expense tools, and productivity apps you can use in the browser.",
    seoTitle: "Productivity Tools | Ebenezer Store",
    types: ["digital_tool", "software"],
  },
  {
    slug: "creator",
    name: "Creator",
    category: "Creator",
    description: "Landing, brand, and creator resources for coaches and freelancers.",
    seoTitle: "Creator Products | Ebenezer Store",
  },
  {
    slug: "bundles",
    name: "Bundles",
    category: "Bundles",
    description: "Bundles of real products — templates, tools, and supporting docs together.",
    seoTitle: "Product Bundles | Ebenezer Store",
    types: ["bundle"],
  },
  {
    slug: "free-resources",
    name: "Free Resources",
    category: "Free Resources",
    description: "Free starter files, docs, and lead magnets. PDFs here are supporting resources, not core paid products.",
    seoTitle: "Free Resources | Ebenezer Store",
    types: ["free_resource", "ebook", "documentation"],
  },
];

export const STORE_CATEGORIES = STORE_CATEGORY_PAGES
  .filter((c, i, arr) => arr.findIndex((x) => x.category === c.category) === i)
  .map((c) => c.category);

export const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  Software: "Software & Tools",
  "UI Kits": "Creator",
  "Business Tools": "Business",
  Templates: "Business",
  Ebooks: "Free Resources",
  Graphics: "Creator",
  Bundles: "Bundles",
  Freebies: "Free Resources",
  "Software & Tools": "Software & Tools",
  "Website Templates": "Website Templates",
  Business: "Business",
  Creator: "Creator",
  "Church & Ministry": "Church & Ministry",
  Travel: "Travel",
  Restaurant: "Restaurant",
  "Real Estate": "Real Estate",
  Healthcare: "Healthcare",
  Education: "Education",
  Ecommerce: "Ecommerce",
  Productivity: "Productivity",
  "Free Resources": "Free Resources",
};

export function normalizeCategory(value?: string): string {
  if (!value) return "Free Resources";
  return LEGACY_CATEGORY_ALIASES[value] || value;
}

export function getCategoryPage(slug: string): StoreCategoryPage | undefined {
  return STORE_CATEGORY_PAGES.find((c) => c.slug === slug);
}

export function productMatchesCategoryPage(
  product: {
    category: string;
    productType?: string;
    isBundle?: boolean;
    isFree?: boolean;
    isSoftware?: boolean;
    tags?: string[];
    slug?: string;
  },
  page: StoreCategoryPage
): boolean {
  const cat = normalizeCategory(product.category);
  const type = product.productType as StoreProductType | undefined;
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const hasTag = (...keys: string[]) => keys.some((k) => tags.some((t) => t.includes(k)));

  if (page.slug === "bundles") {
    return Boolean(product.isBundle) || type === "bundle" || cat === "Bundles";
  }
  if (page.slug === "free-resources") {
    return (
      cat === "Free Resources" ||
      type === "free_resource" ||
      type === "ebook" ||
      type === "documentation"
    );
  }
  if (page.slug === "ai-tools") return type === "ai_tool";
  if (page.slug === "software") {
    return type === "software" || type === "digital_tool" || type === "ai_tool" || cat === "Software & Tools";
  }
  if (page.slug === "website-templates" || page.slug === "nextjs-templates") {
    return type === "website_template" || type === "code_template";
  }
  if (page.slug === "canva-templates") return type === "canva_template";
  if (page.slug === "figma-ui-kits") return type === "figma_kit" || type === "ui_kit";
  if (page.slug === "business-tools") return cat === "Business";
  if (page.slug === "church-templates") return cat === "Church & Ministry" || hasTag("church", "ministry");
  if (page.slug === "travel-templates") return cat === "Travel" || hasTag("travel");
  if (page.slug === "restaurant") {
    return cat === "Restaurant" || hasTag("restaurant", "cafe", "menu") || product.slug === "qr-menu-generator";
  }
  if (page.slug === "real-estate") return cat === "Real Estate" || hasTag("real-estate", "property");
  if (page.slug === "healthcare") return cat === "Healthcare" || hasTag("clinic", "healthcare", "dental");
  if (page.slug === "education") return cat === "Education" || hasTag("education", "course", "school");
  if (page.slug === "ecommerce") return cat === "Ecommerce" || hasTag("ecommerce", "shop");
  if (page.slug === "productivity") {
    return cat === "Productivity" || hasTag("productivity", "task", "expense");
  }
  if (page.slug === "creator") return cat === "Creator" || hasTag("creator", "portfolio", "youtube");
  if (page.slug === "roadmap") return false;
  return cat === page.category;
}

export function productMatchesFilter(product: { category: string }, filter: string): boolean {
  if (filter === "ALL") return true;
  return normalizeCategory(product.category) === normalizeCategory(filter);
}
