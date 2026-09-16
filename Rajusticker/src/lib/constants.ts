export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Raju Stickers";
export const SITE_TAGLINE = "Drive Different";
export const SITE_DESCRIPTION =
  "Premium car wraps and vinyl stickers from Raju Stickers. Chrome, metallic, matte, and carbon fiber finishes built for bold vehicles.";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@rajustrickers.com";
export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91-9876543210";

export const CURRENCY = "INR" as const;
export const CURRENCY_SYMBOL = "₹";

export const FREE_SHIPPING_THRESHOLD = 15000;
export const STANDARD_SHIPPING = 299;
export const EXPRESS_SHIPPING = 599;

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Categories", hasMega: true },
  { href: "/custom-stickers", label: "Custom" },
  { href: "/ai-finder", label: "AI Finder" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER_SHOP = [
  { href: "/shop", label: "All Products" },
  { href: "/shop/chrome-wraps", label: "Chrome Wraps" },
  { href: "/shop/metallic-wraps", label: "Metallic Wraps" },
  { href: "/shop/matte-wraps", label: "Matte Wraps" },
  { href: "/shop/carbon-fiber", label: "Carbon Fiber" },
  { href: "/custom-stickers", label: "Custom Stickers" },
] as const;

export const FOOTER_HELP = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
] as const;

export const TRUST_POINTS = [
  {
    title: "Premium PVC Film",
    description: "High-grade ~150 micron vinyl with air-release adhesive.",
  },
  {
    title: "Easy Application",
    description: "Flexible, stretchable film designed for bubble-free installs.",
  },
  {
    title: "Weather Ready",
    description: "UV, scratch, and water resistant for Indian road conditions.",
  },
  {
    title: "Secure Checkout",
    description: "Protected order flow with modular payment gateway support.",
  },
] as const;
