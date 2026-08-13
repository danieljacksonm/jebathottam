"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Artifact } from "./types";

export function ArtifactPanel({
  artifact,
  onClose,
}: {
  artifact: Artifact | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"preview" | "code" | "details">("code");
  const [full, setFull] = useState(false);
  if (!artifact) return null;

  const html = artifact.language === "html" ? artifact.code : "";

  return (
    <aside className={`ai-artifact ${full ? "is-full" : ""}`} aria-label="Artifact">
      <header>
        <div>
          <p className="ai-kicker">Artifact</p>
          <h3>{artifact.title}</h3>
        </div>
        <div className="ai-artifact-actions">
          <button type="button" onClick={() => setFull((v) => !v)}>
            {full ? "Dock" : "Expand"}
          </button>
          <button type="button" onClick={onClose} aria-label="Close artifact">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="ai-artifact-tabs">
        {(["preview", "code", "details"] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "is-active" : ""}
            onClick={() => setTab(id)}
          >
            {id}
          </button>
        ))}
      </div>
      <div className="ai-artifact-body">
        {tab === "preview" && html && (
          <iframe title="Preview" className="ai-artifact-frame" srcDoc={html} />
        )}
        {tab === "preview" && !html && (
          <pre className="ai-artifact-pre">{artifact.code}</pre>
        )}
        {tab === "code" && <pre className="ai-artifact-pre">{artifact.code}</pre>}
        {tab === "details" && (
          <div className="ai-artifact-meta">
            <p>Language · {artifact.language}</p>
            <p>Characters · {artifact.code.length}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
