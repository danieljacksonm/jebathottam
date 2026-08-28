"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Globe, Newspaper, Wrench, RefreshCw, BarChart3 } from "lucide-react";

type SiteRow = {
  kind: string;
  label: string;
  url: string;
  online: boolean;
  status: number;
  responseMs: number;
  sitemapUrls: number | null;
  robotsOk: boolean;
  error?: string;
};

type CommandCenterData = {
  checkedAt: string;
  sites: SiteRow[];
  newsSitemap: {
    standardCount: number;
    googleCount: number;
    cap: number;
    atCap: boolean;
    oldest: string | null;
    newest: string | null;
    ok: boolean;
  } | null;
  tools: { total: number; featured: number; live: number };
  analytics: { ga4: string; measurementId: string | null };
  searchConsole: Record<string, boolean>;
  seo: {
    toolsNetwork: { total: number; missingSeo: string[] };
    toolsAffiliate: { total: number; thinMeta: string[] };
    catalogProducts: { total: number; missingCanonical: number };
    guides: number;
    newsSitemapCap: number;
    ga4: boolean;
    gscHostsConfigured: number;
    gscHostsTotal: number;
  };
};

function statusBadge(online: boolean) {
  return online
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : "bg-red-500/10 text-red-400 border-red-500/30";
}

export default function CommandCenterPage() {
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/command-center", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
            Ebenezer Digital
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">Command Center</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ecosystem health, sitemaps, tools, and integration status.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {data ? (
        <>
          <p className="text-xs text-slate-500">
            Last checked: {new Date(data.checkedAt).toLocaleString()}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card icon={Globe} title="Sites online" value={`${data.sites.filter((s) => s.online).length}/${data.sites.length}`} />
            <Card icon={Wrench} title="Live tools" value={String(data.tools.live)} sub={`${data.tools.featured} featured`} />
            <Card
              icon={BarChart3}
              title="GA4"
              value={data.analytics.ga4 === "configured" ? "Configured" : "Unavailable"}
              sub={data.analytics.measurementId || "Set NEXT_PUBLIC_GA_MEASUREMENT_ID"}
            />
            <Card
              icon={Newspaper}
              title="News sitemap"
              value={data.newsSitemap ? String(data.newsSitemap.googleCount) : "—"}
              sub={
                data.newsSitemap
                  ? `Cap ${data.newsSitemap.cap}${data.newsSitemap.atCap ? " · at cap" : ""}`
                  : "Could not fetch"
              }
            />
          </div>

          <section className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
              <Activity className="h-4 w-4 text-brand-400" />
              <h2 className="font-semibold text-white">Site health</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-950/80 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Site</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Response</th>
                    <th className="px-4 py-2 font-medium">Sitemap URLs</th>
                    <th className="px-4 py-2 font-medium">Robots</th>
                    <th className="px-4 py-2 font-medium">GSC token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.sites.map((site) => (
                    <tr key={site.kind} className="text-slate-300">
                      <td className="px-4 py-3">
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">
                          {site.label}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge(site.online)}`}>
                          {site.online ? "ONLINE" : site.error || `HTTP ${site.status}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">{site.responseMs}ms</td>
                      <td className="px-4 py-3">{site.sitemapUrls ?? "—"}</td>
                      <td className="px-4 py-3">{site.robotsOk ? "OK" : "Fail"}</td>
                      <td className="px-4 py-3">{data.searchConsole[site.kind] ? "Set" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {data.newsSitemap ? (
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="font-semibold text-white">News sitemap monitor</h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <Item label="Standard sitemap URLs" value={String(data.newsSitemap.standardCount)} />
                <Item label="Google News XML URLs" value={String(data.newsSitemap.googleCount)} />
                <Item label="Configured cap" value={String(data.newsSitemap.cap)} />
                <Item label="Oldest in Google XML" value={data.newsSitemap.oldest || "—"} />
                <Item label="Newest in Google XML" value={data.newsSitemap.newest || "—"} />
                <Item label="Window" value="7 days (unchanged)" />
              </dl>
            </section>
          ) : null}

          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="font-semibold text-white">SEO static audit</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <Item label="Network tools" value={String(data.seo.toolsNetwork.total)} />
              <Item
                label="Tools missing SEO copy"
                value={String(data.seo.toolsNetwork.missingSeo.length)}
              />
              <Item label="Guides" value={String(data.seo.guides)} />
              <Item label="Affiliate tools" value={String(data.seo.toolsAffiliate.total)} />
              <Item label="Catalog products" value={String(data.seo.catalogProducts.total)} />
              <Item label="News sitemap cap" value={String(data.seo.newsSitemapCap)} />
              <Item
                label="Search Console hosts"
                value={`${data.seo.gscHostsConfigured}/${data.seo.gscHostsTotal}`}
              />
            </dl>
          </section>
        </>
      ) : loading ? (
        <p className="text-slate-400">Loading ecosystem status…</p>
      ) : null}
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{title}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-200">{value}</dd>
    </div>
  );
}
