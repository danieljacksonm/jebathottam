"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trackNetworkEvent } from "@/lib/network/analytics";
import {
  CopyButton,
  ErrorMsg,
  Field,
  GhostBtn,
  ImagePicker,
  Panel,
  PrimaryBtn,
  Result,
  Toolbar,
  TwoCol,
  downloadDataUrl,
  downloadText,
  fmtNum,
  safeStr,
  useImageFile,
} from "./tool-ui";

/* ─── shared format helpers ─── */

function indentCode(src: string, openers: string, closers: string): string {
  let indent = 0;
  const out: string[] = [];
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      out.push("");
      continue;
    }
    if (Array.from(closers).some((c) => line.startsWith(c))) indent = Math.max(0, indent - 1);
    out.push("  ".repeat(indent) + line);
    const opens = Array.from(line).filter((c) => openers.includes(c)).length;
    const closes = Array.from(line).filter((c) => closers.includes(c)).length;
    indent = Math.max(0, indent + opens - closes);
  }
  return out.join("\n");
}

function formatHtml(html: string): string {
  const spaced = html
    .replace(/>\s*</g, ">\n<")
    .replace(/(<\/?(?:html|head|body|div|section|article|nav|ul|ol|li|table|tr|thead|tbody|form)[^>]*>)/gi, "\n$1\n");
  return indentCode(spaced, "", "").replace(/\n{3,}/g, "\n\n").trim();
}

function formatCss(css: string): string {
  let s = css.replace(/\s*{\s*/g, " {\n").replace(/\s*;\s*/g, ";\n").replace(/\s*}\s*/g, "\n}\n");
  return indentCode(s, "{", "}").replace(/\n{3,}/g, "\n\n").trim();
}

function formatJs(js: string): string {
  let s = js
    .replace(/\s*{\s*/g, " {\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/;\s*(?!\n)/g, ";\n");
  return indentCode(s, "{([", "})]").replace(/\n{3,}/g, "\n\n").trim();
}

function parseNum(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ─── Developer ─── */

export function JsonFormatter({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [minify, setMinify] = useState(false);

  const run = (doMinify: boolean) => {
    setMinify(doMinify);
    try {
      const parsed = JSON.parse(input);
      const out = doMinify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setOutput(out);
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: doMinify ? "minify" : "format" });
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <Panel>
      <TwoCol
        left={
          <Field label="JSON input">
            <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </Field>
        }
        right={
          <Field label="Output">
            <textarea className="nx-textarea" value={output} readOnly spellCheck={false} />
          </Field>
        }
      />
      <Toolbar>
        <PrimaryBtn onClick={() => run(false)}>Format</PrimaryBtn>
        <GhostBtn onClick={() => run(true)}>Minify</GhostBtn>
        <CopyButton text={output} slug={slug} />
        <GhostBtn
          onClick={() => {
            if (!output) return;
            downloadText("formatted.json", output, "application/json");
            trackNetworkEvent("download", { tool: slug });
          }}
          disabled={!output}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {output && minify ? <Result>Minified ({output.length} chars)</Result> : null}
    </Panel>
  );
}

export function JsonValidator({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setOk(null);
      setMsg("Paste JSON to validate.");
      return;
    }
    try {
      JSON.parse(input);
      setOk(true);
      setMsg("Valid JSON.");
      trackNetworkEvent("tool_complete", { tool: slug, action: "validate" });
    } catch (e) {
      setOk(false);
      setMsg(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <Panel>
      <Field label="JSON">
        <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={validate}>Validate</PrimaryBtn>
      </Toolbar>
      {msg ? <div className={ok === false ? "nx-error" : "nx-result"}>{msg}</div> : null}
    </Panel>
  );
}

export function Base64Encoder({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      const bytes = new TextEncoder().encode(input);
      let bin = "";
      bytes.forEach((b) => {
        bin += String.fromCharCode(b);
      });
      setOutput(btoa(bin));
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "encode" });
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Encode failed");
    }
  };

  const decode = () => {
    try {
      const bin = atob(input.replace(/\s/g, ""));
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "decode" });
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Decode failed");
    }
  };

  return (
    <Panel>
      <Field label="Input">
        <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={encode}>Encode</PrimaryBtn>
        <GhostBtn onClick={decode}>Decode</GhostBtn>
        <CopyButton text={output} slug={slug} />
      </Toolbar>
      <Field label="Output">
        <textarea className="nx-textarea" value={output} readOnly />
      </Field>
      <ErrorMsg>{error}</ErrorMsg>
    </Panel>
  );
}

export function UrlEncoder({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  return (
    <Panel>
      <Field label="Input">
        <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            try {
              setOutput(encodeURIComponent(input));
              setError("");
              trackNetworkEvent("tool_complete", { tool: slug, action: "encode" });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            }
          }}
        >
          Encode
        </PrimaryBtn>
        <GhostBtn
          onClick={() => {
            try {
              setOutput(decodeURIComponent(input.replace(/\+/g, " ")));
              setError("");
              trackNetworkEvent("tool_complete", { tool: slug, action: "decode" });
            } catch (e) {
              setOutput("");
              setError(e instanceof Error ? e.message : "Invalid URI component");
            }
          }}
        >
          Decode
        </GhostBtn>
        <CopyButton text={output} slug={slug} />
      </Toolbar>
      <Field label="Output">
        <textarea className="nx-textarea" value={output} readOnly />
      </Field>
      <ErrorMsg>{error}</ErrorMsg>
    </Panel>
  );
}

export function UuidGenerator({ slug }: { slug: string }) {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const generate = () => {
    const n = Math.min(100, Math.max(1, count || 1));
    const next: string[] = [];
    for (let i = 0; i < n; i++) {
      next.push(
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            })
      );
    }
    setList(next);
    trackNetworkEvent("tool_complete", { tool: slug, action: "generate", count: n });
  };

  const text = list.join("\n");

  return (
    <Panel>
      <Field label="How many (1–100)">
        <input
          className="nx-input"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 1)}
        />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={generate}>Generate</PrimaryBtn>
        <CopyButton text={text} slug={slug} label="Copy all" />
      </Toolbar>
      {list.length ? (
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem", fontFamily: "var(--nx-mono)", fontSize: "0.85rem" }}>
          {list.map((u) => (
            <li key={u} style={{ marginBottom: 4 }}>
              {u}
            </li>
          ))}
        </ul>
      ) : (
        <Result>Click Generate for UUID v4 values.</Result>
      )}
    </Panel>
  );
}

function b64urlDecode(str: string): string {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function JwtDecoder({ slug }: { slug: string }) {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    setHeader("");
    setPayload("");
    const parts = token.trim().split(".");
    if (parts.length < 2) {
      setError("JWT must have at least header.payload segments.");
      return;
    }
    try {
      const h = JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2);
      const p = JSON.stringify(JSON.parse(b64urlDecode(parts[1])), null, 2);
      setHeader(h);
      setPayload(p);
      trackNetworkEvent("tool_complete", { tool: slug, action: "decode" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not decode JWT");
    }
  };

  return (
    <Panel>
      <Field label="JWT">
        <textarea className="nx-textarea" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={decode}>Decode</PrimaryBtn>
        <CopyButton text={payload || header} slug={slug} />
      </Toolbar>
      <p style={{ fontSize: "0.85rem", color: "var(--nx-muted)", margin: "0 0 0.75rem" }}>
        Decode only — signature is not verified. Do not trust tokens without server-side verification.
      </p>
      <ErrorMsg>{error}</ErrorMsg>
      {header ? (
        <Field label="Header">
          <textarea className="nx-textarea" value={header} readOnly />
        </Field>
      ) : null}
      {payload ? (
        <Field label="Payload">
          <textarea className="nx-textarea" value={payload} readOnly />
        </Field>
      ) : null}
    </Panel>
  );
}

export function RegexTester({ slug }: { slug: string }) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[], error: "" };
    try {
      const all: RegExpMatchArray[] = [];
      if (!flags.includes("g")) {
        const m = text.match(new RegExp(pattern, flags));
        if (m) all.push(m);
        return { matches: all, error: "" };
      }
      const clone = new RegExp(pattern, flags);
      let m: RegExpExecArray | null;
      while ((m = clone.exec(text)) !== null) {
        all.push(m);
        if (m[0] === "") clone.lastIndex++;
        if (all.length > 500) break;
      }
      return { matches: all, error: "" };
    } catch (e) {
      return { matches: [] as RegExpMatchArray[], error: e instanceof Error ? e.message : "Invalid regex" };
    }
  }, [pattern, flags, text]);

  useEffect(() => {
    if (pattern && text && !error) {
      trackNetworkEvent("tool_use", { tool: slug, matches: matches.length });
    }
  }, [matches.length, pattern, text, error, slug]);

  return (
    <Panel>
      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 120px" }}>
        <Field label="Pattern">
          <input className="nx-input" value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} />
        </Field>
        <Field label="Flags">
          <input className="nx-input" value={flags} onChange={(e) => setFlags(e.target.value)} />
        </Field>
      </div>
      <Field label="Test text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <ErrorMsg>{error}</ErrorMsg>
      <Result>{error ? "—" : `${matches.length} match${matches.length === 1 ? "" : "es"}`}</Result>
      {matches.length > 0 ? (
        <ul style={{ fontFamily: "var(--nx-mono)", fontSize: "0.82rem", paddingLeft: "1.1rem" }}>
          {matches.slice(0, 50).map((m, i) => (
            <li key={i}>
              [{m.index ?? 0}] {JSON.stringify(m[0])}
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

export function HashGenerator({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<"SHA-256" | "SHA-384" | "SHA-512" | "SHA-1">("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const run = async () => {
    try {
      const data = new TextEncoder().encode(input);
      const buf = await crypto.subtle.digest(algo, data);
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setOutput(hex);
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "hash", algo });
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Hash failed");
    }
  };

  return (
    <Panel>
      <Field label="Input">
        <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Field label="Algorithm">
        <select className="nx-select" value={algo} onChange={(e) => setAlgo(e.target.value as typeof algo)}>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run}>Generate</PrimaryBtn>
        <CopyButton text={output} slug={slug} />
      </Toolbar>
      <Field label="Hash (hex)">
        <textarea className="nx-textarea" value={output} readOnly />
      </Field>
      <ErrorMsg>{error}</ErrorMsg>
    </Panel>
  );
}

export function TimestampConverter({ slug }: { slug: string }) {
  const [ts, setTs] = useState("");
  const [iso, setIso] = useState("");
  const [error, setError] = useState("");

  const fromTs = () => {
    const raw = ts.trim();
    let n = Number(raw);
    if (!Number.isFinite(n)) {
      setError("Enter a numeric timestamp.");
      return;
    }
    if (Math.abs(n) < 1e12) n *= 1000;
    const d = new Date(n);
    if (Number.isNaN(d.getTime())) {
      setError("Invalid timestamp.");
      return;
    }
    setIso(d.toISOString());
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "from_ts" });
  };

  const fromIso = () => {
    const d = new Date(iso.trim());
    if (Number.isNaN(d.getTime())) {
      setError("Invalid date/ISO string.");
      return;
    }
    setTs(String(d.getTime()));
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "from_iso" });
  };

  const now = () => {
    const d = new Date();
    setTs(String(d.getTime()));
    setIso(d.toISOString());
    setError("");
    trackNetworkEvent("tool_use", { tool: slug, action: "now" });
  };

  return (
    <Panel>
      <Field label="Unix timestamp (seconds or ms)">
        <input className="nx-input" value={ts} onChange={(e) => setTs(e.target.value)} />
      </Field>
      <Field label="ISO / date string">
        <input className="nx-input" value={iso} onChange={(e) => setIso(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={fromTs}>Timestamp → Date</PrimaryBtn>
        <GhostBtn onClick={fromIso}>Date → Timestamp</GhostBtn>
        <GhostBtn onClick={now}>Now</GhostBtn>
        <CopyButton text={iso || ts} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {iso ? <Result>{iso}</Result> : null}
    </Panel>
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(h)) return null;
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverter({ slug }: { slug: string }) {
  const [hex, setHex] = useState("#0f766e");
  const [r, setR] = useState("15");
  const [g, setG] = useState("118");
  const [b, setB] = useState("110");
  const [error, setError] = useState("");

  const syncFromHex = () => {
    const rgb = hexToRgb(hex);
    if (!rgb) {
      setError("Invalid hex color.");
      return;
    }
    setR(String(rgb.r));
    setG(String(rgb.g));
    setB(String(rgb.b));
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "hex" });
  };

  const syncFromRgb = () => {
    const rr = parseNum(r);
    const gg = parseNum(g);
    const bb = parseNum(b);
    if (rr == null || gg == null || bb == null || [rr, gg, bb].some((v) => v < 0 || v > 255)) {
      setError("RGB values must be 0–255.");
      return;
    }
    const to = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    setHex(`#${to(rr)}${to(gg)}${to(bb)}`);
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "rgb" });
  };

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <Panel>
      <Field label="HEX">
        <input className="nx-input" value={hex} onChange={(e) => setHex(e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
        <Field label="R">
          <input className="nx-input" value={r} onChange={(e) => setR(e.target.value)} />
        </Field>
        <Field label="G">
          <input className="nx-input" value={g} onChange={(e) => setG(e.target.value)} />
        </Field>
        <Field label="B">
          <input className="nx-input" value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
      </div>
      <Toolbar>
        <PrimaryBtn onClick={syncFromHex}>From HEX</PrimaryBtn>
        <GhostBtn onClick={syncFromRgb}>From RGB</GhostBtn>
        <CopyButton text={hex} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {rgb && hsl ? (
        <Result>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
                border: "1px solid var(--nx-line)",
              }}
            />
            <span>
              rgb({rgb.r}, {rgb.g}, {rgb.b}) · hsl({hsl.h}, {hsl.s}%, {hsl.l}%) · {hex.toLowerCase()}
            </span>
          </div>
        </Result>
      ) : null}
    </Panel>
  );
}

export function MarkdownPreview({ slug }: { slug: string }) {
  const [md, setMd] = useState("# Hello\n\nWrite **markdown** with [GFM](https://github.github.com/gfm/).\n\n- Item one\n- Item two\n");

  useEffect(() => {
    trackNetworkEvent("tool_use", { tool: slug, action: "preview" });
  }, [slug]);

  return (
    <Panel>
      <TwoCol
        left={
          <Field label="Markdown">
            <textarea className="nx-textarea" style={{ minHeight: 280 }} value={md} onChange={(e) => setMd(e.target.value)} />
          </Field>
        }
        right={
          <Field label="Preview">
            <div
              className="nx-result"
              style={{ minHeight: 280, overflow: "auto", background: "var(--nx-bg)", lineHeight: 1.55 }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{md || "_Empty_"}</ReactMarkdown>
            </div>
          </Field>
        }
      />
      <Toolbar>
        <CopyButton text={md} slug={slug} label="Copy markdown" />
      </Toolbar>
    </Panel>
  );
}

function CodeFormatter({
  slug,
  label,
  format,
  ext,
}: {
  slug: string;
  label: string;
  format: (s: string) => string;
  ext: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <Panel>
      <Field label={label}>
        <textarea className="nx-textarea" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            setOutput(format(input));
            trackNetworkEvent("tool_complete", { tool: slug, action: "format" });
          }}
        >
          Format
        </PrimaryBtn>
        <CopyButton text={output} slug={slug} />
        <GhostBtn
          disabled={!output}
          onClick={() => {
            downloadText(`formatted.${ext}`, output);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="Output">
        <textarea className="nx-textarea" value={output} readOnly spellCheck={false} />
      </Field>
    </Panel>
  );
}

export function HtmlFormatter({ slug }: { slug: string }) {
  return <CodeFormatter slug={slug} label="HTML" format={formatHtml} ext="html" />;
}
export function CssFormatter({ slug }: { slug: string }) {
  return <CodeFormatter slug={slug} label="CSS" format={formatCss} ext="css" />;
}
export function JavascriptFormatter({ slug }: { slug: string }) {
  return <CodeFormatter slug={slug} label="JavaScript" format={formatJs} ext="js" />;
}
