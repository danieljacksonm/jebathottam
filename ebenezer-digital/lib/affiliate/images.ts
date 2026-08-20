/**
 * Affiliate image resolution hierarchy.
 * Never invent product photos. Prefer authorized feed/CDN assets.
 */

export type ImageSourceType =
  | "affiliate_feed"
  | "affiliate_api"
  | "merchant_feed"
  | "official"
  | "authorized_asset"
  | "brand_logo"
  | "branded_placeholder";

export type ResolvedImage = {
  url: string;
  sourceType: ImageSourceType;
  sourceLabel: string;
  alt: string;
};

/** Official / widely used brand logo CDNs (Clearbit) — fallback to placeholder. */
export function brandLogoUrl(domain: string): string {
  const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^www\./, "");
  return `https://logo.clearbit.com/${host}?size=128`;
}

export function brandedPlaceholder(label: string, kind: "tool" | "product" = "product"): string {
  const safe = encodeURIComponent(label.slice(0, 28));
  const bg = kind === "tool" ? "0f172a" : "f8fafc";
  const fg = kind === "tool" ? "34d399" : "0f766e";
  // SVG data URI — no third-party stock photo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#${bg}"/>
    <rect x="40" y="40" width="720" height="520" rx="24" fill="none" stroke="#${fg}" stroke-opacity="0.25" stroke-width="2"/>
    <text x="400" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="#${fg}">${safe}</text>
    <text x="400" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="#94a3b8">Ebenezer · image pending authorized feed</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function resolveProductImage(input: {
  name: string;
  brand?: string;
  image?: string;
  imageSourceType?: ImageSourceType;
  brandDomain?: string;
}): ResolvedImage {
  if (input.image && !/unsplash\.com/i.test(input.image)) {
    return {
      url: input.image,
      sourceType: input.imageSourceType || "authorized_asset",
      sourceLabel: input.imageSourceType || "Authorized asset",
      alt: input.name,
    };
  }
  if (input.brandDomain) {
    return {
      url: brandLogoUrl(input.brandDomain),
      sourceType: "brand_logo",
      sourceLabel: "Brand logo (Clearbit)",
      alt: `${input.brand || input.name} logo`,
    };
  }
  return {
    url: brandedPlaceholder(input.brand ? `${input.brand} · ${input.name}` : input.name, "product"),
    sourceType: "branded_placeholder",
    sourceLabel: "Branded placeholder — awaiting affiliate/merchant image",
    alt: input.name,
  };
}

export function resolveToolImage(input: {
  name: string;
  logoImg?: string;
  logo?: string;
  domain?: string;
}): ResolvedImage {
  if (input.logoImg && !/unsplash\.com/i.test(input.logoImg)) {
    return {
      url: input.logoImg,
      sourceType: "official",
      sourceLabel: "Official / CDN logo",
      alt: `${input.name} logo`,
    };
  }
  if (input.domain) {
    return {
      url: brandLogoUrl(input.domain),
      sourceType: "brand_logo",
      sourceLabel: "Brand logo (Clearbit)",
      alt: `${input.name} logo`,
    };
  }
  return {
    url: brandedPlaceholder(input.name, "tool"),
    sourceType: "branded_placeholder",
    sourceLabel: "Branded placeholder",
    alt: input.name,
  };
}

export function freshnessLabel(iso?: string): string {
  if (!iso) return "Last checked: Information unavailable";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "Last checked: Information unavailable";
  const hours = Math.max(0, Math.round((Date.now() - t) / 3600000));
  if (hours < 1) return "Updated less than 1 hour ago";
  if (hours < 48) return `Updated ${hours} hours ago`;
  const days = Math.round(hours / 24);
  return `Last checked: ${days} day${days === 1 ? "" : "s"} ago`;
}
