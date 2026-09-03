import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type Entry = MetadataRoute.Sitemap[number];

/** Build GSC-safe urlset. Always sets hreflang en + x-default equal to `<loc>`. */
export function buildUrlsetXml(entries: Entry[]): string {
  const urls = entries.map((entry) => {
    const loc = escapeXml(entry.url);
    const langs = entry.alternates?.languages;
    // Prefer explicit en if present and matching; otherwise always self-reference loc
    const en = langs?.en && langs.en === entry.url ? langs.en : entry.url;
    const xDefault =
      langs?.["x-default"] && langs["x-default"] === en ? langs["x-default"] : en;

    const extraLocales = langs
      ? (Object.entries(langs).filter(
          (pair): pair is [string, string] =>
            pair[0] !== "en" &&
            pair[0] !== "x-default" &&
            typeof pair[1] === "string" &&
            pair[1].length > 0
        ) as [string, string][])
      : [];

    const links = [
      `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
      ...extraLocales.map(
        ([code, href]) =>
          `<xhtml:link rel="alternate" hreflang="${escapeXml(code)}" href="${escapeXml(href)}" />`
      ),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}" />`,
    ];

    const lastmod = entry.lastModified
      ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`
      : "";
    const changefreq = entry.changeFrequency
      ? `<changefreq>${entry.changeFrequency}</changefreq>`
      : "";
    const priority =
      typeof entry.priority === "number" ? `<priority>${entry.priority}</priority>` : "";

    return `<url>
<loc>${loc}</loc>
${links.join("\n")}
${lastmod}
${changefreq}
${priority}
</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export function buildSitemapIndexXml(locs: string[]): string {
  const body = locs
    .map(
      (loc) => `<sitemap>
<loc>${escapeXml(loc)}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

export const SITEMAP_CHUNK_SIZE = 900;
