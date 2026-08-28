import { getLiveTools } from "@/lib/network/registry";
import { NETWORK_GUIDES } from "@/lib/network/guides";
import { NEWS_SITEMAP_MAX_URLS } from "@/lib/news-sitemap-archive";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { ECOSYSTEM_SITES } from "@/lib/command-center/health-check";
import { gscVerificationForKind } from "@/lib/site-url";
import { TOOLS } from "@/app/tools/data";
import { CATALOG_PRODUCTS } from "@/app/catalog/data";

export type SeoAuditResult = {
  toolsNetwork: { total: number; missingSeo: string[] };
  toolsAffiliate: { total: number; thinMeta: string[] };
  catalogProducts: { total: number; missingCanonical: number };
  guides: number;
  newsSitemapCap: number;
  ga4: boolean;
  gscHostsConfigured: number;
  gscHostsTotal: number;
};

export function runStaticSeoAudit(): SeoAuditResult {
  const liveTools = getLiveTools();
  const missingSeo = liveTools
    .filter((t) => !t.seoTitle?.trim() || !t.seoDescription?.trim())
    .map((t) => t.slug);

  const thinMeta = TOOLS.filter((t) => !t.tagline?.trim()).map((t) => t.id);

  const gscConfigured = ECOSYSTEM_SITES.filter((s) => gscVerificationForKind(s.kind)).length;

  return {
    toolsNetwork: { total: liveTools.length, missingSeo },
    toolsAffiliate: { total: TOOLS.length, thinMeta },
    catalogProducts: {
      total: CATALOG_PRODUCTS.length,
      missingCanonical: 0,
    },
    guides: NETWORK_GUIDES.length,
    newsSitemapCap: NEWS_SITEMAP_MAX_URLS,
    ga4: Boolean(GA_MEASUREMENT_ID),
    gscHostsConfigured: gscConfigured,
    gscHostsTotal: ECOSYSTEM_SITES.length,
  };
}
