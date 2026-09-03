/**
 * Studio (.com) highlights — qualitative only.
 * Do not invent project counts, satisfaction %, or “countries served” without verification.
 */
export const STUDIO_STATS = [
  { value: "Build", label: "Software & web products" },
  { value: "Ship", label: "Store, Tools, SaaS & AI" },
  { value: "Publish", label: "News & Journal" },
  { value: "Support", label: "Clear project communication" },
] as const;

export const STUDIO_STATS_EXTENDED = [
  ...STUDIO_STATS,
  { value: "Focus", label: "India-first, global-ready delivery" },
] as const;
