"use client";

import { useEffect, useMemo, useState } from "react";
import type { Thread } from "./types";

export function AiSpotlight({
  open,
  onClose,
  threads,
  onSelect,
  onNew,
}: {
  open: boolean;
  onClose: () => void;
  threads: Thread[];
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return threads.slice(0, 8);
    return threads
      .filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.messages.some((m) => m.content.toLowerCase().includes(query))
      )
      .slice(0, 10);
  }, [q, threads]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setIdx(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const hit = results[idx];
        if (hit) onSelect(hit.id);
        else onNew();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, idx, onClose, onSelect, onNew]);

  if (!open) return null;

  return (
    <div className="ai-spot" role="dialog" aria-label="Search conversations">
      <button className="ai-backdrop" onClick={onClose} aria-label="Close search" />
      <div className="ai-spot-card">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search your conversations"
        />
        <div className="ai-spot-group">
          <p>Recent</p>
          {results.length === 0 && (
            <button type="button" onClick={onNew}>
              Start with a question
            </button>
          )}
          {results.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={i === idx ? "is-active" : ""}
              onClick={() => onSelect(t.id)}
            >
              {t.title || "Untitled"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
