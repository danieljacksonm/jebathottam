/** Ebenezer Digital Network — tool registry types */

export type NetworkToolCategory =
  | "developer"
  | "seo"
  | "image"
  | "pdf"
  | "text"
  | "calculators"
  | "business"
  | "ai";

export type NetworkToolStatus = "live" | "draft";

export type NetworkToolMeta = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: NetworkToolCategory;
  icon: string; // lucide icon name key
  keywords: string[];
  synonyms?: string[];
  seoTitle: string;
  seoDescription: string;
  featured?: boolean;
  status: NetworkToolStatus;
  related?: string[]; // slugs
  createdAt: string;
  updatedAt: string;
  howItWorks: string[];
  features: string[];
  faqs: { q: string; a: string }[];
  example?: string;
};

export const CATEGORY_LABELS: Record<NetworkToolCategory, string> = {
  developer: "Developer",
  seo: "SEO",
  image: "Image",
  pdf: "PDF",
  text: "Text",
  calculators: "Calculators",
  business: "Business",
  ai: "AI",
};
