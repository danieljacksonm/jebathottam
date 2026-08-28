import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  JOURNAL_URL,
  NETWORK_URL,
  NEWS_URL,
  PRODUCTS_URL,
  SAAS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
  type SiteKind,
} from "@/lib/site-url";

export type EcosystemSite = {
  kind: SiteKind;
  label: string;
  url: string;
};

export const ECOSYSTEM_SITES: EcosystemSite[] = [
  { kind: "studio", label: "Studio (.com)", url: SITE_URL },
  { kind: "info", label: "Information (.info)", url: INFO_URL },
  { kind: "news", label: "News", url: NEWS_URL },
  { kind: "journal", label: "Journal", url: JOURNAL_URL },
  { kind: "store", label: "Store", url: STORE_URL },
  { kind: "tools", label: "Tools", url: TOOLS_URL },
  { kind: "products", label: "Products", url: PRODUCTS_URL },
  { kind: "ai", label: "AI", url: AI_URL },
  { kind: "saas", label: "SaaS", url: SAAS_URL },
  { kind: "discover", label: "Discover", url: DISCOVER_URL },
  { kind: "network", label: "Network (.net)", url: NETWORK_URL },
];

export type SiteHealthRow = {
  kind: SiteKind;
  label: string;
  url: string;
  online: boolean;
  status: number;
  responseMs: number;
  sitemapUrls: number | null;
  robotsOk: boolean;
  error?: string;
};

export async function checkSiteHealth(site: EcosystemSite): Promise<SiteHealthRow> {
  const start = Date.now();
  let status = 0;
  let online = false;
  let error: string | undefined;
  let sitemapUrls: number | null = null;
  let robotsOk = false;

  try {
    const res = await fetch(site.url, {
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "EbenezerCommandCenter/1.0" },
      cache: "no-store",
    });
    status = res.status;
    online = res.ok;
  } catch (e) {
    error = e instanceof Error ? e.message : "Unreachable";
  }

  const responseMs = Date.now() - start;

  try {
    const sm = await fetch(`${site.url}/sitemap.xml`, {
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (sm.ok) {
      const xml = await sm.text();
      sitemapUrls = (xml.match(/<loc>/g) || []).length;
    }
  } catch {
    /* sitemap optional */
  }

  try {
    const rb = await fetch(`${site.url}/robots.txt`, {
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    robotsOk = rb.ok;
  } catch {
    robotsOk = false;
  }

  return {
    kind: site.kind,
    label: site.label,
    url: site.url,
    online,
    status,
    responseMs,
    sitemapUrls,
    robotsOk,
    error,
  };
}

export async function checkAllSites(): Promise<SiteHealthRow[]> {
  const rows: SiteHealthRow[] = [];
  for (const site of ECOSYSTEM_SITES) {
    rows.push(await checkSiteHealth(site));
  }
  return rows;
}
