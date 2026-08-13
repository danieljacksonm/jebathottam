"use client";

import { AiCore } from "./AiCore";
import type { CoreState } from "./types";

export function VoiceOverlay({
  open,
  state,
  label,
  onClose,
}: {
  open: boolean;
  state: CoreState;
  label: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="ai-voice" role="dialog" aria-label="Voice mode">
      <button className="ai-backdrop" onClick={onClose} aria-label="Close voice" />
      <div className="ai-voice-inner">
        <AiCore state={state} size="lg" />
        <p className="ai-kicker">{label}</p>
        <div className="ai-wave" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <button type="button" className="ai-text-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
