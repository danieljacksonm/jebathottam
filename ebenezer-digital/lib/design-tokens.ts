/**
 * Ebenezer Digital — shared design tokens by host family.
 * Each surface imports its CSS namespace; these values document the contract.
 */
export const STUDIO = {
  bg: "#070708",
  fg: "#f4f1ea",
  muted: "#8d887e",
  line: "rgba(244, 241, 234, 0.1)",
  accent: "#10b981",
  maxWidth: "1120px",
} as const;

export const EDITORIAL = {
  journalInk: "#0a0a0b",
  newsInk: "#111113",
  accent: "#10b981",
  maxWidth: "720px",
} as const;

export const COMMERCE = {
  brand: "#0d9488",
  ink: "#0f172a",
  muted: "#64748b",
  line: "#e2e8f0",
  maxWidth: "1200px",
} as const;

export const NETWORK = {
  brand: "#10b981",
  bg: "#fafafa",
  ink: "#18181b",
  maxWidth: "1100px",
} as const;
