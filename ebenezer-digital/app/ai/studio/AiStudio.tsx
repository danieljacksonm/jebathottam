"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Share2 } from "lucide-react";
import { resolveAiMode, MODEL_BRAND, type AiMode } from "@/lib/ai";
import { AiCore } from "./AiCore";
import { AiComposer } from "./AiComposer";
import { AiCursor } from "./AiCursor";
import { AiMarkdown } from "./AiMarkdown";
import { AiSidebar } from "./AiSidebar";
import { AiSpotlight } from "./AiSpotlight";
import { ArtifactPanel } from "./ArtifactPanel";
import { VoiceOverlay } from "./VoiceOverlay";
import { streamChat } from "./stream";
import {
  extractArtifacts,
  loadProjects,
  loadSettings,
  loadThreads,
  saveProjects,
  saveSettings,
  saveThreads,
  uid,
} from "./storage";
import type {
  Artifact,
  Attachment,
  CoreState,
  Health,
  Msg,
  Project,
  Settings,
  ThinkLabel,
  Thread,
} from "./types";

const STARTERS = [
  { k: "Plan a trip", q: "Plan a calm 5-day trip to Kodaikanal with a simple budget." },
  { k: "Analyze a document", q: "How should I review a business proposal before I sign it?" },
  { k: "Build a website", q: "Outline a premium one-page website for a small studio in India." },
  { k: "Explain an idea", q: "Explain quantum physics as if I am curious, not technical." },
  { k: "Write something", q: "Write a short, elegant note to a new client." },
  { k: "Research a topic", q: "What should I know about starting a small digital service business?" },
];

const FOLLOWS = ["Summarize this", "Go deeper", "Show examples", "Create a plan", "Compare options"];

const THINK_CYCLE: ThinkLabel[] = [
  "THINKING",
  "ANALYZING",
  "CONNECTING IDEAS",
  "COMPOSING RESPONSE",
  "FINALIZING",
];

export function AiStudio() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const mode = resolveAiMode(params.get("mode"));
  const prefill = params.get("prefill") || "";

  const [threads, setThreads] = useState<Thread[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    accent: "bronze",
    language: "en",
    style: "calm",
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const [core, setCore] = useState<CoreState>("idle");
  const [think, setThink] = useState<ThinkLabel>("THINKING");
  const [health, setHealth] = useState<Health>({
    status: "checking",
    model: "",
    models: [],
  });
  const [sideOpen, setSideOpen] = useState(false);
  const [spotOpen, setSpotOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState("LISTENING");
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [dropOn, setDropOn] = useState(false);
  const [offline, setOffline] = useState(false);
  const [mobile, setMobile] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const prefillUsed = useRef(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );
  const messages = useMemo(() => active?.messages ?? [], [active]);
  const inChat = messages.length > 0;

  const persist = useCallback((next: Thread[]) => {
    setThreads(next);
    saveThreads(next);
  }, []);

  useEffect(() => {
    setThreads(loadThreads());
    setProjects(loadProjects());
    setSettings(loadSettings());
    setMobile(window.matchMedia("(max-width: 900px)").matches);
    const mq = window.matchMedia("(max-width: 900px)");
    const onMq = () => setMobile(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (prefill && !prefillUsed.current) {
      setInput(prefill);
      prefillUsed.current = true;
    }
  }, [prefill]);

  useEffect(() => {
    document.documentElement.dataset.aiTheme = settings.theme;
    document.documentElement.dataset.aiAccent = settings.accent;
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        abortRef.current?.abort();
        setBusy(false);
        setActiveId(null);
        setInput("");
        setAttachments([]);
        setArtifact(null);
        setCore("idle");
        setSpotOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onOff = () => setOffline(!navigator.onLine);
    onOff();
    window.addEventListener("online", onOff);
    window.addEventListener("offline", onOff);
    return () => {
      window.removeEventListener("online", onOff);
      window.removeEventListener("offline", onOff);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/health", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        setHealth({
          status: res.ok && data.status === "ready" ? "ready" : "down",
          model: data.model || "",
          models: data.models || [],
          error: data.error,
        });
      } catch {
        if (!cancelled) setHealth({ status: "down", model: "", models: [], error: "Cannot reach AI" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, busy, reduce]);

  useEffect(() => {
    if (!busy) return;
    let i = 0;
    setThink(THINK_CYCLE[0]);
    const id = window.setInterval(() => {
      i = (i + 1) % THINK_CYCLE.length;
      setThink(THINK_CYCLE[i]);
    }, 1400);
    return () => window.clearInterval(id);
  }, [busy]);

  function newChat() {
    abortRef.current?.abort();
    setBusy(false);
    setActiveId(null);
    setInput("");
    setAttachments([]);
    setArtifact(null);
    setCore("idle");
    setSideOpen(false);
    setSpotOpen(false);
  }

  function selectThread(id: string) {
    setActiveId(id);
    setSideOpen(false);
    setSpotOpen(false);
  }

  async function ingestFiles(list: FileList | File[]) {
    const next: Attachment[] = [];
    for (const file of Array.from(list).slice(0, 4)) {
      const item: Attachment = {
        id: uid(),
        name: file.name,
        type: file.type || "file",
        size: file.size,
      };
      if (file.type.startsWith("image/")) {
        item.previewUrl = URL.createObjectURL(file);
        item.text = `Attached image: ${file.name}. This model cannot view pixels; reply from the filename and user question only.`;
      } else if (
        file.type.startsWith("text/") ||
        /\.(md|json|csv|txt)$/i.test(file.name)
      ) {
        item.text = (await file.text()).slice(0, 8000);
      } else {
        item.text = `Attached file: ${file.name} (${file.type || "unknown"}). Summarize what this kind of file usually contains and ask for the text if needed.`;
      }
      next.push(item);
    }
    setAttachments((prev) => [...prev, ...next].slice(0, 6));
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if ((!content && attachments.length === 0) || busy) return;

    let thread = active;
    let list = threads;
    if (!thread) {
      thread = {
        id: uid(),
        title: (content || attachments[0]?.name || "New chat").slice(0, 56),
        updatedAt: Date.now(),
        messages: [],
      };
      list = [thread, ...threads];
      setActiveId(thread.id);
    }

    const contextBits = attachments
      .map((a) => (a.text ? `FILE ${a.name}:\n${a.text}` : `FILE ${a.name}`))
      .join("\n\n");

    const userMsg: Msg = {
      id: uid(),
      role: "user",
      content: content || `Please review: ${attachments.map((a) => a.name).join(", ")}`,
      createdAt: Date.now(),
      attachments,
    };
    const assistantId = uid();
    const assistantMsg: Msg = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };

    const updated: Thread = {
      ...thread,
      title: thread.messages.length === 0 ? userMsg.content.slice(0, 56) : thread.title,
      updatedAt: Date.now(),
      messages: [...thread.messages, userMsg, assistantMsg],
    };
    const nextThreads = [updated, ...list.filter((t) => t.id !== updated.id)];
    persist(nextThreads);
    setInput("");
    setAttachments([]);
    setBusy(true);
    setCore("thinking");
    setFocused(false);

    const history = updated.messages
      .filter((m) => m.id !== assistantId)
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const full = await streamChat({
        messages: history,
        mode,
        context: contextBits,
        signal: controller.signal,
        onToken: (tokenFull) => {
          setCore("responding");
          persist(
            nextThreads.map((t) =>
              t.id === updated.id
                ? {
                    ...t,
                    messages: t.messages.map((m) =>
                      m.id === assistantId ? { ...m, content: tokenFull } : m
                    ),
                  }
                : t
            )
          );
        },
      });
      if (!full.trim()) {
        throw new Error(
          health.status === "down"
            ? health.error || "Model is offline. Install a small Ollama model on the VPS."
            : "Empty reply from the model."
        );
      }
      setCore("success");
      window.setTimeout(() => setCore("idle"), 900);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setCore("idle");
      } else {
        setCore("error");
        const message = err instanceof Error ? err.message : "Something interrupted the connection.";
        persist(
          nextThreads.map((t) =>
            t.id === updated.id
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content || `Something interrupted the connection.\n\n${message}` }
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
    }
  }

  function stop() {
    abortRef.current?.abort();
    setBusy(false);
    setCore("idle");
  }

  function startVoice() {
    const w = window as Window & {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        start: () => void;
        stop: () => void;
        onresult: ((e: { results: Array<{ 0: { transcript: string } }> }) => void) | null;
        onend: (() => void) | null;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        start: () => void;
        stop: () => void;
        onresult: ((e: { results: Array<{ 0: { transcript: string } }> }) => void) | null;
        onend: (() => void) | null;
      };
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setVoiceOpen(true);
      setVoiceLabel("VOICE UNAVAILABLE");
      setCore("error");
      return;
    }
    const rec = new SR();
    rec.lang = settings.language === "en" ? "en-IN" : settings.language;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput(text);
      setVoiceLabel("LISTENING");
    };
    rec.onend = () => {
      setVoiceOpen(false);
      setCore("idle");
    };
    recRef.current = rec;
    setVoiceOpen(true);
    setVoiceLabel("LISTENING");
    setCore("listening");
    rec.start();
  }

  function closeVoice() {
    recRef.current?.stop();
    setVoiceOpen(false);
    setCore("idle");
  }

  function addProject() {
    const name = window.prompt("Project name?");
    if (!name?.trim()) return;
    const next = [
      { id: uid(), name: name.trim(), note: "", createdAt: Date.now() },
      ...projects,
    ];
    setProjects(next);
    saveProjects(next);
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);

  return (
    <div
      className={`ai-os ${inChat ? "is-chat" : "is-land"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDropOn(true);
      }}
      onDragLeave={() => setDropOn(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDropOn(false);
        if (e.dataTransfer.files?.length) void ingestFiles(e.dataTransfer.files);
      }}
    >
      <AiCursor />
      <div className="ai-atmosphere" aria-hidden />
      <div className="ai-grain" aria-hidden />

      <AiSidebar
        open={mobile ? sideOpen : true}
        mobile={mobile}
        onClose={() => setSideOpen(false)}
        onNew={newChat}
        onSearch={() => setSpotOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        threads={threads}
        projects={projects}
        activeId={activeId}
        onSelect={selectThread}
        onDelete={(id) => {
          const next = threads.filter((t) => t.id !== id);
          persist(next);
          if (activeId === id) newChat();
        }}
        onNewProject={addProject}
      />

      <section className="ai-stage">
        <header className="ai-head">
          {mobile && (
            <button type="button" className="ai-icon" onClick={() => setSideOpen(true)} aria-label="Menu">
              <Menu className="h-4 w-4" />
            </button>
          )}
          <div className="ai-head-meta">
            <Image src="/brand/eben-ai-mark.svg" alt="" width={22} height={22} className="rounded-md" />
            <span className={`ai-live ${health.status}`} />
            <button type="button" className="ai-model" onClick={() => setModelOpen((v) => !v)}>
              {MODEL_BRAND}
            </button>
            {health.status === "ready" ? <small>Online</small> : <small>Limited</small>}
          </div>
          <button type="button" className="ai-icon" aria-label="Share" data-cursor="OPEN">
            <Share2 className="h-4 w-4" />
          </button>
        </header>

        {modelOpen && (
          <div className="ai-model-pop">
            <p>Available on this server</p>
            {(health.models.length ? health.models : [health.model || "qwen2.5:1.5b"]).map((m) => (
              <button key={m} type="button" onClick={() => setModelOpen(false)}>
                Nzer 1.0
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!inChat ? (
            <motion.div
              key="land"
              className="ai-land"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: reduce ? undefined : "blur(8px)" }}
              transition={{ duration: reduce ? 0.15 : 0.45 }}
            >
              <AiCore state={focused || input ? "typing" : core} size="lg" />
              <div className="flex items-center gap-2">
                <Image src="/brand/eben-ai-mark.svg" alt="" width={28} height={28} className="rounded-md" />
                <p className="ai-kicker">Eben AI</p>
              </div>
              <h1>
                ASK
                <br />
                ANYTHING.
              </h1>
              <p className="ai-sub">
                An intelligent space for thinking, creating and discovering.
              </p>
              <AiComposer
                landing
                value={input}
                onChange={(v) => {
                  setInput(v);
                  setCore(v ? "typing" : "idle");
                }}
                onSubmit={() => void send()}
                onStop={stop}
                onVoice={startVoice}
                onFiles={(f) => void ingestFiles(f)}
                onRemoveFile={(id) => setAttachments((a) => a.filter((x) => x.id !== id))}
                attachments={attachments}
                busy={busy}
                focused={focused}
                onFocus={() => {
                  setFocused(true);
                  setCore("typing");
                }}
                onBlur={() => setFocused(false)}
                placeholder="What would you like to explore?"
              />
              <div className="ai-chips">
                {STARTERS.map((s) => (
                  <button key={s.k} type="button" onClick={() => void send(s.q)}>
                    {s.k}
                  </button>
                ))}
              </div>
              <div className="ai-story">
                <article>
                  <p>Ask</p>
                  <h3>A quiet place to think out loud.</h3>
                </article>
                <article>
                  <p>Create</p>
                  <h3>Writing, plans, and structure — without noise.</h3>
                </article>
                <article>
                  <p>Analyze</p>
                  <h3>Drop a file. Keep the thread.</h3>
                </article>
                <article>
                  <p>Discover</p>
                  <h3>News, store, and billing — one calm mind.</h3>
                </article>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className="ai-chat"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.12 : 0.4 }}
            >
              <div className="ai-thread" role="log" aria-live="polite">
                {messages.map((m) => (
                  <article key={m.id} className={`ai-line ${m.role}`}>
                    {m.role === "assistant" ? (
                      <div className="ai-line-core">
                        <AiCore
                          size="sm"
                          state={
                            busy && m.content === ""
                              ? "thinking"
                              : busy && messages[messages.length - 1]?.id === m.id
                                ? "responding"
                                : "idle"
                          }
                        />
                      </div>
                    ) : (
                      <p className="ai-line-meta">You</p>
                    )}
                    <div className="ai-line-body">
                      {m.role === "assistant" && !m.content && busy ? (
                        <p className="ai-think">{think}…</p>
                      ) : m.role === "assistant" ? (
                        <>
                          <AiMarkdown
                            content={m.content}
                            onOpenArtifact={(code, language) =>
                              setArtifact({
                                id: uid(),
                                messageId: m.id,
                                title: `${language} · artifact`,
                                language,
                                code,
                              })
                            }
                          />
                          {extractArtifacts(m.content, m.id).length > 0 && (
                            <button
                              type="button"
                              className="ai-open-art"
                              data-cursor="OPEN"
                              onClick={() => {
                                const first = extractArtifacts(m.content, m.id)[0];
                                setArtifact(first);
                              }}
                            >
                              Open artifact →
                            </button>
                          )}
                        </>
                      ) : (
                        <p>{m.content}</p>
                      )}
                    </div>
                  </article>
                ))}
                {lastAssistant && !busy && (
                  <div className="ai-follow">
                    {FOLLOWS.map((f) => (
                      <button key={f} type="button" onClick={() => void send(f)}>
                        {f}
                      </button>
                    ))}
                  </div>
                )}
                {core === "error" && !busy && (
                  <div className="ai-recover">
                    <p>Something interrupted the connection.</p>
                    <button type="button" onClick={() => void send(messages.filter((m) => m.role === "user").slice(-1)[0]?.content)}>
                      Try again
                    </button>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <AiComposer
                value={input}
                onChange={(v) => {
                  setInput(v);
                  setCore(v ? "typing" : "idle");
                }}
                onSubmit={() => void send()}
                onStop={stop}
                onVoice={startVoice}
                onFiles={(f) => void ingestFiles(f)}
                onRemoveFile={(id) => setAttachments((a) => a.filter((x) => x.id !== id))}
                attachments={attachments}
                busy={busy}
                focused={focused}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Continue the thought…"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ArtifactPanel artifact={artifact} onClose={() => setArtifact(null)} />
      <AiSpotlight
        open={spotOpen}
        onClose={() => setSpotOpen(false)}
        threads={threads}
        onSelect={selectThread}
        onNew={newChat}
      />
      <VoiceOverlay open={voiceOpen} state={core} label={voiceLabel} onClose={closeVoice} />

      {settingsOpen && (
        <div className="ai-spot" role="dialog" aria-label="Settings">
          <button className="ai-backdrop" onClick={() => setSettingsOpen(false)} aria-label="Close settings" />
          <div className="ai-spot-card ai-settings">
            <p className="ai-kicker">Preferences</p>
            <h2>Appearance</h2>
            <div className="ai-set-row">
              <button type="button" onClick={() => setSettings((s) => ({ ...s, theme: "dark" }))}>
                Dark
              </button>
              <button type="button" onClick={() => setSettings((s) => ({ ...s, theme: "light" }))}>
                Light
              </button>
            </div>
            <div className="ai-set-row">
              {(["bronze", "sage", "pearl"] as const).map((a) => (
                <button key={a} type="button" onClick={() => setSettings((s) => ({ ...s, accent: a }))}>
                  {a}
                </button>
              ))}
            </div>
            <p className="ai-fine">Conversations stay on this device. Delete a chat anytime from the sidebar.</p>
          </div>
        </div>
      )}

      {dropOn && (
        <div className="ai-drop" aria-hidden>
          DROP TO ANALYZE
        </div>
      )}
      {offline && <div className="ai-offline">You’re offline. The conversation is kept.</div>}
    </div>
  );
}

