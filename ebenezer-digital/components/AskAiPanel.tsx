"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, X } from "lucide-react";
import type { AiMode } from "@/lib/ai";

type Props = {
  mode: AiMode;
  context?: string;
  title?: string;
  placeholder?: string;
  starters?: string[];
  tone?: "news" | "store" | "studio";
  className?: string;
  fullPageHref?: string;
};

async function streamAsk(
  mode: AiMode,
  context: string | undefined,
  question: string,
  onToken: (t: string) => void,
  signal?: AbortSignal
) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      context,
      stream: true,
      messages: [{ role: "user", content: question }],
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.hint || `AI error (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      const line = part
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as { token?: string; error?: string };
        if (json.error) throw new Error(json.error);
        if (json.token) {
          full += json.token;
          onToken(full);
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
  return full;
}

export function AskAiPanel({
  mode,
  context,
  title = "Ask Eben AI",
  placeholder = "Ask anything…",
  starters = [],
  tone = "studio",
  className = "",
  fullPageHref,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const href =
    fullPageHref ||
    `/ai?mode=${mode}${context ? `&prefill=${encodeURIComponent("Help me with this")}` : ""}`;

  const run = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setBusy(true);
    setError("");
    setAnswer("");
    setQ("");
    try {
      const full = await streamAsk(mode, context, question, setAnswer);
      if (!full.trim()) {
        setError("Empty reply. Is Ollama running on the VPS?");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run(q);
  };

  const shell =
    tone === "news"
      ? "border border-[var(--n-line)] bg-[var(--n-paper)] text-[var(--n-ink)]"
      : tone === "store"
        ? "border border-[var(--s-line)] bg-[var(--s-ink)] text-[var(--s-paper)]"
        : "border border-slate-700 bg-slate-950 text-slate-100";

  const accent =
    tone === "news"
      ? "text-[var(--n-live)]"
      : tone === "store"
        ? "text-[var(--s-brand)]"
        : "text-brand-400";

  const btn =
    tone === "news"
      ? "border border-[var(--n-ink)] bg-[var(--n-ink)] text-[var(--n-paper)]"
      : tone === "store"
        ? "bg-[var(--s-brand)] text-[#04110c]"
        : "bg-brand-500 text-slate-950";

  return (
    <div className={`ask-ai ${className}`}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${btn}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </button>
      ) : (
        <div className={`rounded-xl p-4 sm:p-5 ${shell}`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className={`text-[10px] uppercase tracking-[0.2em] ${accent}`}>
                Eben AI · {mode}
              </p>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl">{title}</h3>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-5 w-5 opacity-70" />
            </button>
          </div>

          {starters.length > 0 && !answer && !busy && (
            <div className="mb-3 flex flex-wrap gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void run(s)}
                  className="border border-current/20 px-2.5 py-1.5 text-left text-xs opacity-80 hover:opacity-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {(answer || busy || error) && (
            <div className="mb-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm leading-relaxed opacity-90">
              {error ? `⚠️ ${error}` : answer || "Thinking…"}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              disabled={busy}
              className="min-w-0 flex-1 border border-current/20 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={busy || !q.trim()}
              className={`shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] disabled:opacity-40 ${btn}`}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </button>
          </form>

          <p className="mt-3 text-[10px] uppercase tracking-[0.16em] opacity-50">
            <Link href={href} className="underline">
              Open full chat
            </Link>
            {" · "}CPU model on our server
          </p>
        </div>
      )}
    </div>
  );
}

/** One-click world brief button for news home */
export function NewsBriefButton({
  region,
  className = "",
}: {
  region?: string;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const load = async () => {
    setOpen(true);
    setBusy(true);
    setError("");
    setText("");
    try {
      const qs = region ? `?region=${encodeURIComponent(region)}` : "";
      const res = await fetch(`/api/ai/news-brief${qs}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.hint || "Brief failed");
      setText(data.brief || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Brief failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void load()}
        disabled={busy}
        className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:border-[var(--n-live)] hover:text-[var(--n-live)] disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {busy ? "Writing brief…" : "AI world brief"}
      </button>

      {open && (
        <div className="mt-4 border border-white/15 bg-black/40 p-4 text-sm leading-relaxed text-white/85 whitespace-pre-wrap">
          {error ? `⚠️ ${error}` : text || "…"}
          <div className="mt-3">
            <Link
              href={`/ai?mode=news${region ? `&prefill=${encodeURIComponent(`Brief me on ${region} news`)}` : ""}`}
              className="text-[10px] uppercase tracking-[0.18em] text-[var(--n-live)]"
            >
              Continue in full chat →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
