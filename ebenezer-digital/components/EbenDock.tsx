"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, Sparkles, X } from "lucide-react";
import type { AiMode } from "@/lib/ai";

function modeFromPath(path: string | null): AiMode {
  if (!path) return "general";
  if (path.startsWith("/blog/news")) return "news";
  if (path.startsWith("/blog")) return "blog";
  if (path.startsWith("/products/checkout")) return "billing";
  if (path.startsWith("/products")) return "product";
  if (path.startsWith("/catalog")) return "catalog";
  return "general";
}

async function streamAsk(
  mode: AiMode,
  context: string | undefined,
  question: string,
  onToken: (t: string) => void
) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      context,
      stream: true,
      messages: [{ role: "user", content: question }],
      fast: true,
    }),
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

const STARTERS: Record<AiMode, string[]> = {
  general: ["Explain this simply", "Give me a full plan", "Write a clear example"],
  news: ["Explain today’s top stories", "Why does this matter?", "Simple brief for India readers"],
  blog: ["Explain this lesson more simply", "Give Indian life examples", "What should I learn next?"],
  product: ["Which kit fits my business?", "What files are inside this kit?", "Compare free and paid tools"],
  billing: ["Why can’t I pay yet?", "Explain licenses simply", "What happens after payment?"],
  catalog: [
    "Laptop under ₹60,000 for coding",
    "Compare these two for Photoshop",
    "Which SSD is better for gaming?",
  ],
};

export function EbenDock({
  mode,
  context,
}: {
  mode?: AiMode;
  context?: string;
}) {
  const path = usePathname();
  const resolved = mode || modeFromPath(path);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hints = useMemo(() => STARTERS[resolved] || STARTERS.general, [resolved]);

  const run = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setBusy(true);
    setError("");
    setAnswer("");
    setQ("");
    try {
      const full = await streamAsk(resolved, context, question, setAnswer);
      if (!full.trim()) setError("Eben AI gave an empty reply. Is the model running?");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eben AI failed");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run(q);
  };

  return (
    <div className="eben-dock">
      {open && (
        <div className="eben-dock-panel" role="dialog" aria-label="Eben AI">
          <div className="eben-dock-head">
            <div>
              <p>Eben AI</p>
              <small>Here to explain, clearly</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Eben AI">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="eben-dock-hints">
            {hints.map((h) => (
              <button key={h} type="button" onClick={() => void run(h)}>
                {h}
              </button>
            ))}
          </div>
          <div className="eben-dock-out">
            {error ? `⚠️ ${error}` : answer || (busy ? "Eben AI is thinking…" : "Ask anything about this page.")}
          </div>
          <form onSubmit={onSubmit} className="eben-dock-form">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask Eben AI…"
              disabled={busy}
            />
            <button type="submit" disabled={busy || !q.trim()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </button>
          </form>
          <Link href={`/ai?mode=${resolved}`} className="eben-dock-full">
            Open full chat →
          </Link>
        </div>
      )}
      <button
        type="button"
        className="eben-dock-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Eben AI"
      >
        <Sparkles className="h-4 w-4" />
        <span>Eben AI</span>
      </button>
      <style jsx>{`
        .eben-dock {
          position: fixed;
          right: 16px;
          bottom: 18px;
          z-index: 80;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .eben-dock-fab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          background: #c4a574;
          color: #161513;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
        }
        .eben-dock-panel {
          width: min(380px, calc(100vw - 24px));
          max-height: min(70vh, 520px);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(243, 239, 230, 0.12);
          border-radius: 18px;
          background: rgba(12, 12, 12, 0.94);
          color: #f3efe6;
          padding: 14px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
        }
        .eben-dock-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .eben-dock-head p {
          font-size: 15px;
          letter-spacing: 0.04em;
        }
        .eben-dock-head small {
          color: #8d887e;
        }
        .eben-dock-hints {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .eben-dock-hints button {
          border: 1px solid rgba(243, 239, 230, 0.12);
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          color: #cfc8bb;
        }
        .eben-dock-out {
          flex: 1;
          overflow: auto;
          min-height: 120px;
          max-height: 260px;
          white-space: pre-wrap;
          font-size: 13.5px;
          line-height: 1.55;
          color: #e8e2d6;
          margin-bottom: 10px;
        }
        .eben-dock-form {
          display: flex;
          gap: 6px;
        }
        .eben-dock-form input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: 1px solid rgba(243, 239, 230, 0.14);
          border-radius: 12px;
          padding: 8px 10px;
          color: #f3efe6;
        }
        .eben-dock-form button {
          border-radius: 12px;
          background: #c4a574;
          color: #161513;
          padding: 0 12px;
          font-size: 12px;
        }
        .eben-dock-full {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c4a574;
        }
        @media (max-width: 700px) {
          .eben-dock {
            bottom: 72px;
          }
        }
      `}</style>
    </div>
  );
}
