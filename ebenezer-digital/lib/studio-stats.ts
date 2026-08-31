/** Single source of truth for studio (.com) metrics — keep all surfaces aligned. */
export const STUDIO_STATS = [
  { value: "150+", label: "Projects delivered" },
  { value: "98%", label: "Client satisfaction" },
  { value: "24/7", label: "Support available" },
  { value: "5+", label: "Years experience" },
] as const;

export const STUDIO_STATS_EXTENDED = [
  ...STUDIO_STATS,
  { value: "40+", label: "Countries served" },
] as const;
