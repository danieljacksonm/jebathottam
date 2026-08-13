"use client";

import {
  FormEvent,
  KeyboardEvent,
  useRef,
} from "react";
import { ArrowUp, Mic, Paperclip, Square } from "lucide-react";
import type { Attachment } from "./types";

export function AiComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  onVoice,
  onFiles,
  onRemoveFile,
  attachments,
  busy,
  focused,
  onFocus,
  onBlur,
  placeholder,
  landing,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onVoice: () => void;
  onFiles: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
  attachments: Attachment[];
  busy: boolean;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  landing?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() && attachments.length === 0) return;
    onSubmit();
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className={`ai-composer ${landing ? "is-landing" : ""} ${focused ? "is-focus" : ""}`}
      onSubmit={submit}
    >
      {attachments.length > 0 && (
        <div className="ai-attach-row">
          {attachments.map((f) => (
            <div key={f.id} className="ai-attach-card">
              {f.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.previewUrl} alt="" />
              ) : (
                <span className="ai-attach-ext">{f.name.split(".").pop()}</span>
              )}
              <div>
                <p>{f.name}</p>
                <small>{Math.max(1, Math.round(f.size / 1024))} KB</small>
              </div>
              <button type="button" onClick={() => onRemoveFile(f.id)} aria-label="Remove file">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={areaRef}
        rows={landing ? 2 : 1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const el = e.target;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
        }}
        onKeyDown={onKey}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label="Message Ebenezer AI"
        className="ai-composer-input"
      />

      <div className="ai-composer-bar">
        <div className="ai-composer-left">
          <input
            ref={fileRef}
            type="file"
            multiple
            className="sr-only"
            accept=".txt,.md,.json,.csv,.pdf,image/*"
            onChange={(e) => {
              if (e.target.files) onFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="ai-icon"
            aria-label="Attach file"
            data-cursor="OPEN"
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="ai-icon"
            aria-label="Voice"
            data-cursor="LISTEN"
            onClick={onVoice}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {busy ? (
          <button type="button" className="ai-send is-stop" onClick={onStop} aria-label="Stop" data-cursor="STOP">
            <Square className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="submit"
            className="ai-send"
            disabled={!value.trim() && attachments.length === 0}
            aria-label="Send"
            data-cursor="SEND"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
