"use client";

import { useMemo, useState } from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";
import {
  CopyButton,
  ErrorMsg,
  Field,
  GhostBtn,
  Panel,
  PrimaryBtn,
  Result,
  Toolbar,
  downloadText,
  fmtNum,
} from "./tool-ui";

function toSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parseNum(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ─── SEO ─── */

export function MetaTagGenerator({ slug }: { slug: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const html = useMemo(() => {
    const lines = [
      title ? `<title>${escapeHtml(title)}</title>` : "",
      title ? `<meta name="title" content="${escapeAttr(title)}" />` : "",
      description ? `<meta name="description" content="${escapeAttr(description)}" />` : "",
      keywords ? `<meta name="keywords" content="${escapeAttr(keywords)}" />` : "",
      author ? `<meta name="author" content="${escapeAttr(author)}" />` : "",
      url ? `<link rel="canonical" href="${escapeAttr(url)}" />` : "",
      `<meta name="robots" content="index, follow" />`,
      `<meta charset="utf-8" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [title, description, keywords, author, url]);

  return (
    <Panel>
      <Field label="Title">
        <input className="nx-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className="nx-textarea" style={{ minHeight: 90 }} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Keywords (comma-separated)">
        <input className="nx-input" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
      </Field>
      <Field label="Author">
        <input className="nx-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </Field>
      <Field label="Canonical URL">
        <input className="nx-input" value={url} onChange={(e) => setUrl(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "generate" })}
        >
          Generate
        </PrimaryBtn>
        <CopyButton text={html} slug={slug} />
        <GhostBtn
          disabled={!html}
          onClick={() => {
            downloadText("meta-tags.html", html, "text/html");
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="HTML">
        <textarea className="nx-textarea" value={html} readOnly spellCheck={false} />
      </Field>
    </Panel>
  );
}

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function RobotsTxtGenerator({ slug }: { slug: string }) {
  const [allowAll, setAllowAll] = useState(true);
  const [disallow, setDisallow] = useState("/admin\n/api");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");

  const text = useMemo(() => {
    const lines = ["User-agent: *"];
    if (allowAll && !disallow.trim()) {
      lines.push("Allow: /");
    } else {
      disallow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Disallow: ${p}`));
      if (allowAll) lines.push("Allow: /");
    }
    const delay = parseNum(crawlDelay);
    if (delay != null && delay > 0) lines.push(`Crawl-delay: ${delay}`);
    if (sitemap.trim()) lines.push(`Sitemap: ${sitemap.trim()}`);
    return lines.join("\n");
  }, [allowAll, disallow, sitemap, crawlDelay]);

  return (
    <Panel>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: "0.9rem" }}>
        <input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} />
        Allow all (with optional Disallow paths)
      </label>
      <Field label="Disallow paths (one per line)">
        <textarea className="nx-textarea" style={{ minHeight: 100 }} value={disallow} onChange={(e) => setDisallow(e.target.value)} />
      </Field>
      <Field label="Sitemap URL">
        <input className="nx-input" value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
      </Field>
      <Field label="Crawl-delay (optional)">
        <input className="nx-input" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "generate" })}>
          Generate
        </PrimaryBtn>
        <CopyButton text={text} slug={slug} />
        <GhostBtn
          onClick={() => {
            downloadText("robots.txt", text);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="robots.txt">
        <textarea className="nx-textarea" value={text} readOnly />
      </Field>
    </Panel>
  );
}

export function SitemapGenerator({ slug }: { slug: string }) {
  const [base, setBase] = useState("https://example.com");
  const [paths, setPaths] = useState("/\n/about\n/blog\n/contact");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");

  const xml = useMemo(() => {
    const root = base.replace(/\/$/, "");
    const urls = paths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => (p.startsWith("http") ? p : `${root}${p.startsWith("/") ? p : `/${p}`}`));
    const today = new Date().toISOString().slice(0, 10);
    const body = urls
      .map(
        (loc) => `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${escapeHtml(changefreq)}</changefreq>
    <priority>${escapeHtml(priority)}</priority>
  </url>`
      )
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
  }, [base, paths, changefreq, priority]);

  return (
    <Panel>
      <Field label="Base URL">
        <input className="nx-input" value={base} onChange={(e) => setBase(e.target.value)} />
      </Field>
      <Field label="Paths (one per line)">
        <textarea className="nx-textarea" value={paths} onChange={(e) => setPaths(e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <Field label="changefreq">
          <select className="nx-select" value={changefreq} onChange={(e) => setChangefreq(e.target.value)}>
            {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="priority">
          <input className="nx-input" value={priority} onChange={(e) => setPriority(e.target.value)} />
        </Field>
      </div>
      <Toolbar>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "generate" })}>
          Generate
        </PrimaryBtn>
        <CopyButton text={xml} slug={slug} />
        <GhostBtn
          onClick={() => {
            downloadText("sitemap.xml", xml, "application/xml");
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="XML">
        <textarea className="nx-textarea" value={xml} readOnly spellCheck={false} />
      </Field>
    </Panel>
  );
}

export function SlugGenerator({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const out = toSlug(input);

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" style={{ minHeight: 100 }} value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "generate" })}>
          Generate
        </PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Result>{out || "Enter text to create a URL slug."}</Result>
    </Panel>
  );
}

export function OpenGraphGenerator({ slug }: { slug: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("website");
  const [siteName, setSiteName] = useState("");

  const html = useMemo(() => {
    return [
      title ? `<meta property="og:title" content="${escapeAttr(title)}" />` : "",
      description ? `<meta property="og:description" content="${escapeAttr(description)}" />` : "",
      url ? `<meta property="og:url" content="${escapeAttr(url)}" />` : "",
      image ? `<meta property="og:image" content="${escapeAttr(image)}" />` : "",
      `<meta property="og:type" content="${escapeAttr(type)}" />`,
      siteName ? `<meta property="og:site_name" content="${escapeAttr(siteName)}" />` : "",
      title ? `<meta name="twitter:card" content="summary_large_image" />` : "",
      title ? `<meta name="twitter:title" content="${escapeAttr(title)}" />` : "",
      description ? `<meta name="twitter:description" content="${escapeAttr(description)}" />` : "",
      image ? `<meta name="twitter:image" content="${escapeAttr(image)}" />` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [title, description, url, image, type, siteName]);

  return (
    <Panel>
      <Field label="Title">
        <input className="nx-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className="nx-textarea" style={{ minHeight: 80 }} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="URL">
        <input className="nx-input" value={url} onChange={(e) => setUrl(e.target.value)} />
      </Field>
      <Field label="Image URL">
        <input className="nx-input" value={image} onChange={(e) => setImage(e.target.value)} />
      </Field>
      <Field label="Site name">
        <input className="nx-input" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
      </Field>
      <Field label="og:type">
        <select className="nx-select" value={type} onChange={(e) => setType(e.target.value)}>
          {["website", "article", "product", "profile"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "generate" })}>
          Generate
        </PrimaryBtn>
        <CopyButton text={html} slug={slug} />
      </Toolbar>
      <Field label="Tags">
        <textarea className="nx-textarea" value={html} readOnly spellCheck={false} />
      </Field>
    </Panel>
  );
}

export function CanonicalUrlGenerator({ slug }: { slug: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [out, setOut] = useState("");

  const run = () => {
    try {
      const u = new URL(url.trim());
      u.hash = "";
      const clean = u.toString().replace(/\/$/, u.pathname === "/" ? "/" : "") || u.origin;
      const tag = `<link rel="canonical" href="${escapeAttr(clean)}" />`;
      setOut(tag);
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "generate" });
    } catch {
      setOut("");
      setError("Enter a valid absolute URL (https://…).");
    }
  };

  return (
    <Panel>
      <Field label="Page URL">
        <input className="nx-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run}>Generate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {out ? <Result>{out}</Result> : null}
    </Panel>
  );
}

export function KeywordDensity({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");

  const stats = useMemo(() => {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]+/gi, " ")
      .split(/\s+/)
      .filter(Boolean);
    const total = words.length;
    const kw = keyword.trim().toLowerCase();
    if (!kw || total === 0) return { total, count: 0, density: 0, top: [] as { w: string; c: number; d: number }[] };
    const phrase = kw.split(/\s+/).filter(Boolean);
    let count = 0;
    if (phrase.length === 1) {
      count = words.filter((w) => w === phrase[0]).length;
    } else {
      for (let i = 0; i <= words.length - phrase.length; i++) {
        if (phrase.every((p, j) => words[i + j] === p)) count++;
      }
    }
    const freq = new Map<string, number>();
    words.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
    const top = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w, c]) => ({ w, c, d: (c / total) * 100 }));
    return { total, count, density: (count / total) * 100, top };
  }, [text, keyword]);

  return (
    <Panel>
      <Field label="Content">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Field label="Keyword / phrase">
        <input className="nx-input" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "analyze" })}>
          Analyze
        </PrimaryBtn>
      </Toolbar>
      <Result>
        Words: {stats.total} · Keyword hits: {stats.count} · Density: {fmtNum(stats.density, 2)}%
      </Result>
      {stats.top.length ? (
        <ul style={{ fontSize: "0.88rem", paddingLeft: "1.1rem" }}>
          {stats.top.map((t) => (
            <li key={t.w}>
              {t.w}: {t.c} ({fmtNum(t.d, 2)}%)
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

/* ─── Text ─── */

export function WordCounter({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).length : 0;
  const lines = text ? text.split(/\n/).length : 0;
  const reading = Math.max(1, Math.ceil(words / 200));

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} onBlur={() => trackNetworkEvent("tool_use", { tool: slug })} />
      </Field>
      <Result>
        Words: {words} · Characters: {chars} ({charsNoSpace} without spaces) · Sentences: {sentences} · Lines:{" "}
        {lines} · ~{reading} min read
      </Result>
    </Panel>
  );
}

export function CaseConverter({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");

  const apply = (mode: string, fn: (s: string) => string) => {
    const next = fn(text);
    setOut(next);
    trackNetworkEvent("tool_complete", { tool: slug, action: mode });
  };

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={() => apply("upper", (s) => s.toUpperCase())}>UPPER</PrimaryBtn>
        <GhostBtn onClick={() => apply("lower", (s) => s.toLowerCase())}>lower</GhostBtn>
        <GhostBtn
          onClick={() =>
            apply("title", (s) =>
              s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            )
          }
        >
          Title Case
        </GhostBtn>
        <GhostBtn
          onClick={() =>
            apply("sentence", (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()))
          }
        >
          Sentence
        </GhostBtn>
        <GhostBtn
          onClick={() =>
            apply("camel", (s) => {
              const p = s.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
              return p
                .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
                .join("");
            })
          }
        >
          camelCase
        </GhostBtn>
        <GhostBtn onClick={() => apply("snake", (s) => toSlug(s).replace(/-/g, "_"))}>snake_case</GhostBtn>
        <CopyButton text={out || text} slug={slug} />
      </Toolbar>
      <Field label="Output">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function TextCleaner({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");

  const clean = () => {
    let s = text.replace(/\u00a0/g, " ");
    s = s.replace(/[ \t]+\n/g, "\n");
    s = s.replace(/\n{3,}/g, "\n\n");
    s = s.replace(/[ \t]{2,}/g, " ");
    s = s
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .trim();
    setOut(s);
    trackNetworkEvent("tool_complete", { tool: slug, action: "clean" });
  };

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={clean}>Clean</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Field label="Cleaned">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function LoremIpsum({ slug }: { slug: string }) {
  const [paras, setParas] = useState(3);
  const [out, setOut] = useState("");

  const generate = () => {
    const n = Math.min(20, Math.max(1, paras || 1));
    const text = Array.from({ length: n }, () => LOREM).join("\n\n");
    setOut(text);
    trackNetworkEvent("tool_complete", { tool: slug, action: "generate", count: n });
  };

  return (
    <Panel>
      <Field label="Paragraphs (1–20)">
        <input
          className="nx-input"
          type="number"
          min={1}
          max={20}
          value={paras}
          onChange={(e) => setParas(Number(e.target.value) || 1)}
        />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={generate}>Generate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Field label="Output">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function DuplicateLineRemover({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [removed, setRemoved] = useState(0);

  const run = () => {
    const lines = text.split(/\r?\n/);
    const seen = new Set<string>();
    const kept: string[] = [];
    let dup = 0;
    for (const line of lines) {
      if (seen.has(line)) {
        dup++;
        continue;
      }
      seen.add(line);
      kept.push(line);
    }
    setOut(kept.join("\n"));
    setRemoved(dup);
    trackNetworkEvent("tool_complete", { tool: slug, action: "dedupe", removed: dup });
  };

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run}>Remove duplicates</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      {out !== "" || removed > 0 ? <Result>Removed {removed} duplicate line(s).</Result> : null}
      <Field label="Output">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}
