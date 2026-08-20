import type { ToolCategory } from "./taxonomy";

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  logo: string;
  logoImg?: string;
  domain?: string;
  url: string;
  affiliateNote?: string;
  pricing: {
    free: boolean;
    freeLabel?: string;
    paid?: string;
    paidLabel?: string;
  };
  /** Editorial signal only — never fabricate review counts */
  rating: number;
  bestFor: string;
  whoShouldAvoid?: string;
  pros: string[];
  cons: string[];
  features?: string[];
  platforms?: string[];
  integrations?: string[];
  lastUpdated?: string;
  badge?: "Best Value" | "Most Popular" | "Editor's Pick" | "Free Forever" | "Best for India";
  highlighted?: boolean;
};
