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
  /** Editorial assessment 1–5 — not a user-review aggregate */
  rating: number;
  ratingKind?: "editorial" | "verified" | "tested";
  bestFor: string;
  whoShouldAvoid?: string;
  pros: string[];
  cons: string[];
  features?: string[];
  platforms?: string[];
  integrations?: string[];
  lastUpdated?: string;
  /** ISO date when pricing notes were last checked against official docs */
  pricingVerifiedAt?: string;
  /** Short note on how this page was researched */
  methodologyNote?: string;
  badge?: "Best Value" | "Most Popular" | "Editor's Pick" | "Free Forever" | "Best for India";
  highlighted?: boolean;
};
