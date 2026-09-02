/**
 * Shared brand palette — import in globals.css or subdomain themes.
 * Primary accent: emerald #10b981 (matches theme-color meta).
 */
export const BRAND_TOKENS = {
  primary: "#10b981",
  primaryDark: "#059669",
  primaryLight: "#34d399",
  primaryBg: "#ecfdf5",
  accentGold: "#c4a574",
  ink: "#0f1117",
  inkSoft: "#374151",
  muted: "#6b7280",
  line: "#e5e7eb",
  paper: "#ffffff",
  surfaceDark: "#070708",
  error: "#ef4444",
  success: "#10b981",
} as const;

/** CSS custom properties string for :root — use in globals or per-surface wrappers */
export const BRAND_CSS_VARS = `
  --eb-brand: ${BRAND_TOKENS.primary};
  --eb-brand-dk: ${BRAND_TOKENS.primaryDark};
  --eb-brand-lt: ${BRAND_TOKENS.primaryLight};
  --eb-brand-bg: ${BRAND_TOKENS.primaryBg};
  --eb-accent-gold: ${BRAND_TOKENS.accentGold};
  --eb-ink: ${BRAND_TOKENS.ink};
  --eb-muted: ${BRAND_TOKENS.muted};
  --eb-line: ${BRAND_TOKENS.line};
`.trim();
