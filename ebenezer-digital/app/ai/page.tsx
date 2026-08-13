"use client";

import {
  FormEvent,
  KeyboardEvent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Loader2,
  MessageSquarePlus,
  PanelLeft,
  Sparkles,
  StopCircle,
  Trash2,
} from "lucide-react";
import type { AiMode } from "@/lib/ai";

type Role = "user" | "assistant";

type Msg = {
  id: string;
  role: Role;
  content: string;
};

type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Msg[];
};

const STORAGE_KEY = "ebenezer-ai-threads-v1";

const STARTERS_BY_MODE: Record<AiMode, string[]> = {
  general: [
    "Write a short website hero for a travel agency",
    "Explain what Ebenezer Digital can do for a small business",
    "Draft a polite WhatsApp reply to a new client",
    "Give me 5 blog title ideas about local SEO in India",
  ],
  news: [
    "Give me a short world news brief",
    "What should I know about India today?",
    "Summarize tech and climate headlines simply",
    "Explain today’s top story in simple English",
  ],
  product: [
    "Help me choose a digital product for my small business",
    "What free tools do you have?",
    "Compare UI kits vs software products",
    "What do I get after I buy?",
  ],
  billing: [
    "Why can’t I complete payment yet?",
    "Explain Personal vs other licenses",
    "How will downloads work after payment?",
    "What email should I use at checkout?",
  ],
};

function resolveMode(raw: string | null): AiMode {
  if (raw === "news" || raw === "product" || raw === "billing" || raw === "general") {
    return raw;
  }
  return "general";
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveThreads(threads: Thread[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads.slice(0, 40)));
}

function AiChatInner() {
  const searchParams = useSearchParams();
  const mode = resolveMode(searchParams.get("mode"));
  const prefill = searchParams.get("prefill") || "";
  const starters = STARTERS_BY_MODE[mode];

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState<"checking" | "ready" | "down">("checking");
  const [statusText, setStatusText] = useState("Checking model…");
  const [extraContext, setExtraContext] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const prefillUsed = useRef(false);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );
  const messages = active?.messages || [];

  useEffect(() => {
    const saved = loadThreads();
    setThreads(saved);
    if (saved[0]) setActiveId(saved[0].id);
  }, []);

  useEffect(() => {
    if (prefill && !prefillUsed.current) {
      setInput(prefill);
      prefillUsed.current = true;
    }
  }, [prefill]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode !== "news") {
        setExtraContext("");
        return;
      }
      try {
        const res = await fetch("/api/news?limit=14", { cache: "no-store" });
        const data = await res.json();
        if (cancelled || !res.ok) return;
        const items = (data.items || []) as {
          title?: string;
          dek?: string;
          region?: string;
        }[];
        setExtraContext(
          items
            .slice(0, 12)
            .map(
              (s, i) =>
                `${i + 1}. [${s.region || "World"}] ${s.title || ""} — ${s.dek || ""}`
            )
            .join("\n")
        );
      } catch {
        // optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/health", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.status === "ready") {
          setStatus("ready");
          setStatusText(`Online · ${data.model} · ${mode}`);
        } else {
          setStatus("down");
          setStatusText(data.error || "Model offline — install Ollama on VPS");
        }
      } catch {
        if (!cancelled) {
          setStatus("down");
          setStatusText("Cannot reach AI API");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function persist(next: Thread[]) {
    setThreads(next);
    saveThreads(next);
  }

  function newChat() {
    const thread: Thread = {
      id: uid(),
      title: "New chat",
      updatedAt: Date.now(),
      messages: [],
    };
    persist([thread, ...threads]);
    setActiveId(thread.id);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }

  function deleteThread(id: string) {
    const next = threads.filter((t) => t.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    let thread = active;
    let list = threads;

    if (!thread) {
      thread = {
        id: uid(),
        title: content.slice(0, 48),
        updatedAt: Date.now(),
        messages: [],
      };
      list = [thread, ...threads];
      setActiveId(thread.id);
    }

    const userMsg: Msg = { id: uid(), role: "user", content };
    const assistantId = uid();
    const assistantMsg: Msg = { id: assistantId, role: "assistant", content: "" };

    const updatedThread: Thread = {
      ...thread,
      title:
        thread.messages.length === 0 ? content.slice(0, 48) : thread.title,
      updatedAt: Date.now(),
      messages: [...thread.messages, userMsg, assistantMsg],
    };

    const nextThreads = [
      updatedThread,
      ...list.filter((t) => t.id !== updatedThread.id),
    ];
    persist(nextThreads);
    setInput("");
    setBusy(true);
    setSidebarOpen(false);

    const history = updatedThread.messages
      .filter((m) => m.id !== assistantId)
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          stream: true,
          mode,
          context: extraContext || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.hint || `Request failed (${res.status})`);
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
            const json = JSON.parse(payload) as {
              token?: string;
              error?: string;
            };
            if (json.error) throw new Error(json.error);
            if (json.token) {
              full += json.token;
              persist(
                nextThreads.map((t) =>
                  t.id === updatedThread.id
                    ? {
                        ...t,
                        messages: t.messages.map((m) =>
                          m.id === assistantId ? { ...m, content: full } : m
                        ),
                      }
                    : t
                )
              );
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      if (!full.trim()) {
        throw new Error(
          status === "down"
            ? "Model is offline. Install Ollama on the VPS first."
            : "Empty reply from model."
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // user stopped
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        persist(
          nextThreads.map((t) =>
            t.id === updatedThread.id
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: m.content || `⚠️ ${message}`,
                        }
                      : m
                  ),
                }
              : t
          )
        );
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const modeLabel =
    mode === "news"
      ? "News"
      : mode === "product"
        ? "Store"
        : mode === "billing"
          ? "Billing"
          : "Studio";

  return (
    <div className="ai-root">
      <div className="ai-glow" aria-hidden />
      <div className="ai-grid" aria-hidden />

      <aside className={`ai-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ai-sidebar-top">
          <Link href="/" className="ai-brand">
            Ebenezer<span>AI</span>
          </Link>
          <button type="button" className="ai-icon-btn" onClick={newChat} title="New chat">
            <MessageSquarePlus className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5 px-2">
          {(
            [
              ["general", "Studio"],
              ["news", "News"],
              ["product", "Store"],
              ["billing", "Billing"],
            ] as const
          ).map(([id, label]) => (
            <Link
              key={id}
              href={`/ai?mode=${id}`}
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${
                mode === id
                  ? "border-brand-400/50 bg-brand-500/15 text-brand-300"
                  : "border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="ai-thread-list">
          {threads.length === 0 && (
            <p className="ai-muted px-3 py-2 text-sm">No chats yet</p>
          )}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`ai-thread ${t.id === activeId ? "active" : ""}`}
            >
              <button
                type="button"
                className="ai-thread-main"
                onClick={() => {
                  setActiveId(t.id);
                  setSidebarOpen(false);
                }}
              >
                {t.title || "Untitled"}
              </button>
              <button
                type="button"
                className="ai-thread-del"
                onClick={() => deleteThread(t.id)}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="ai-sidebar-foot">
          <span className={`ai-dot ${status}`} />
          <span className="ai-muted text-xs leading-snug">{statusText}</span>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="ai-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="ai-main">
        <header className="ai-topbar">
          <button
            type="button"
            className="ai-icon-btn lg-hide"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chats"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <div className="ai-topbar-title">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span>{active?.title || `Ebenezer AI · ${modeLabel}`}</span>
          </div>
          <Link href="/" className="ai-home-link">
            Home
          </Link>
        </header>

        <div className="ai-messages">
          {messages.length === 0 ? (
            <motion.div
              className="ai-empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="ai-kicker">Ebenezer Digital · {modeLabel}</p>
              <h1>
                Ebenezer<span className="text-brand-400">AI</span>
              </h1>
              <p className="ai-empty-sub">
                {mode === "news"
                  ? "Ask about world news from our desks — India, Asia, Europe, Americas, and more."
                  : mode === "product"
                    ? "Get help choosing Ebenezer Store digital products."
                    : mode === "billing"
                      ? "Help with checkout, licenses, and downloads."
                      : "Your open-source assistant — chat like GPT, hosted on our server, ready across products."}
              </p>
              <div className="ai-starters">
                {starters.map((s, i) => (
                  <motion.button
                    key={s}
                    type="button"
                    className="ai-starter"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06 }}
                    onClick={() => void sendMessage(s)}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="ai-msg-list">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    className={`ai-msg ${m.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="ai-msg-role">
                      {m.role === "user" ? "You" : "Ebenezer AI"}
                    </div>
                    <div className="ai-msg-body">
                      {m.content || (busy ? "…" : "")}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form className="ai-composer" onSubmit={onSubmit}>
          <div className="ai-composer-box">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Message Ebenezer AI (${modeLabel})…`}
              disabled={busy && !input}
              className="ai-input"
            />
            {busy ? (
              <button type="button" className="ai-send stop" onClick={stop} title="Stop">
                <StopCircle className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="ai-send"
                disabled={!input.trim()}
                title="Send"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <p className="ai-fineprint">
            Modes: News · Store · Billing · Studio · API <code>/api/ai/chat</code>
          </p>
        </form>
      </section>
    </div>
  );
}

export default function AiChatPage() {
  return (
    <Suspense
      fallback={
        <div className="ai-root grid min-h-screen place-items-center text-slate-400">
          Loading Ebenezer AI…
        </div>
      }
    >
      <AiChatInner />
    </Suspense>
  );
}
