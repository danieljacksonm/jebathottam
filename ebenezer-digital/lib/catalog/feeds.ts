/**
 * Affiliate / merchant feed refresh architecture.
 * Wire approved APIs here — do not scrape.
 */

export type FeedSourceType = "affiliate_api" | "affiliate_network" | "merchant_feed" | "manual";

export type FeedJob = {
  id: string;
  name: string;
  sourceType: FeedSourceType;
  scheduleCron: string; // e.g. "0 */6 * * *" = every 6 hours
  lastRunAt?: string;
  lastSuccessAt?: string;
  status: "idle" | "running" | "error";
  notes?: string;
};

/** Declared jobs — implement runners when affiliate credentials are available. */
export const FEED_JOBS: FeedJob[] = [
  {
    id: "amazon-paapi-in",
    name: "Amazon Product Advertising API (IN)",
    sourceType: "affiliate_api",
    scheduleCron: "0 */6 * * *",
    status: "idle",
    notes: "Requires approved Associates + PA-API credentials. Prefer feed images and offers.",
  },
  {
    id: "flipkart-affiliate",
    name: "Flipkart Affiliate feed",
    sourceType: "affiliate_network",
    scheduleCron: "30 */6 * * *",
    status: "idle",
    notes: "Use official affiliate feed/API only after approval.",
  },
  {
    id: "manual-price-check",
    name: "Manual offer freshness pass",
    sourceType: "manual",
    scheduleCron: "0 9 * * *",
    status: "idle",
    notes: "Admin marks lastCheckedAt when verifying sample offers.",
  },
];

export function feedFreshnessPolicy(): string {
  return "Display 'Updated X hours ago' from offer.lastCheckedAt. If confidence is low or check is older than 48h, show 'Check latest price' instead of presenting the figure as live.";
}
