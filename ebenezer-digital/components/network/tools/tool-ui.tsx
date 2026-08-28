"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";

export function nx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function safeStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number" && !Number.isFinite(v)) return "";
  return String(v);
}

export function fmtNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={nx("nx-panel", className)}>{children}</div>;
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label className="nx-label" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="nx-toolbar">{children}</div>;
}

export function Result({ children }: { children: ReactNode }) {
  const text = typeof children === "string" || typeof children === "number" ? safeStr(children) : children;
  if (text === "" || text == null) return null;
  return <div className="nx-result">{text}</div>;
}

export function ErrorMsg({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="nx-error">{children}</p>;
}

export function CopyButton({
  text,
  slug,
  label = "Copy",
}: {
  text: string;
  slug: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      trackNetworkEvent("copy", { tool: slug });
      setFailed(false);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setFailed(true);
      setCopied(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setFailed(false), 2200);
    }
  }, [text, slug]);

  return (
    <button type="button" className="nx-btn nx-btn-ghost" onClick={onCopy} disabled={!text}>
      {failed ? "Copy failed" : copied ? "Copied!" : label}
    </button>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className="nx-btn nx-btn-primary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="nx-btn nx-btn-ghost" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function useImageFile(slug: string) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const clear = useCallback(() => {
    setFile(null);
    setPreview("");
    setError("");
    setImg(null);
  }, []);

  const onFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      if (!f) return;
      const okMime = ["image/jpeg", "image/png", "image/webp"].includes(f.type);
      if (!okMime) {
        setError("Please upload a JPG, PNG or WebP image.");
        clear();
        return;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        setError("This file is larger than the allowed size (8 MB).");
        clear();
        return;
      }
      setError("");
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      const image = new Image();
      image.onload = () => setImg(image);
      image.onerror = () => {
        setError("Could not load image.");
        clear();
      };
      image.src = url;
      trackNetworkEvent("tool_use", { tool: slug, action: "file_select" });
    },
    [clear, slug]
  );

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return { file, preview, error, img, onFile, clear, maxBytes: MAX_IMAGE_BYTES };
}

export function ImagePicker({
  onFile,
  error,
  preview,
}: {
  onFile: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  preview?: string;
}) {
  return (
    <div>
      <Label>Upload image (JPG, PNG or WebP · max 8 MB)</Label>
      <input className="nx-input" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={onFile} />
      <ErrorMsg>{error}</ErrorMsg>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Selected"
          style={{ maxWidth: "100%", maxHeight: 220, marginTop: "0.75rem", borderRadius: 12 }}
        />
      ) : null}
    </div>
  );
}

export function TwoCol({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr",
      }}
      className="nx-tool-grid"
    >
      <style>{`.nx-tool-grid{grid-template-columns:1fr}@media(min-width:800px){.nx-tool-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
