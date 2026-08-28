"use client";

import { useState } from "react";

type Variant = "studio" | "journal" | "news" | "info";

type Props = {
  variant?: Variant;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  buttonLabel?: string;
  source?: string;
};

export function NewsletterSignup({
  variant = "studio",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  placeholder = "Enter your email",
  buttonLabel = "Subscribe",
  source,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/info/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: source || variant }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  const defaultInput =
    variant === "journal"
      ? "min-h-[52px] flex-1 border border-[var(--j-line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--j-brand)]"
      : variant === "news"
        ? "min-h-[52px] flex-1 border-b border-[var(--n-ink)] bg-transparent px-0 text-sm outline-none"
        : variant === "info"
          ? ""
          : "w-full border-b border-[var(--st-line,#1f1f20)] bg-transparent py-3 pl-7 text-white outline-none";

  const defaultButton =
    variant === "journal"
      ? "min-h-[52px] bg-[var(--j-brand)] px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#04110c]"
      : variant === "news"
        ? "min-h-[52px] bg-[var(--n-ink)] px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--n-paper)]"
        : variant === "info"
          ? "info-btn info-btn-solid"
          : "studio-btn";

  const formClass =
    variant === "journal" || variant === "news"
      ? "flex flex-col gap-3 sm:flex-row"
      : variant === "info"
        ? "info-form"
        : "flex max-w-xl flex-col gap-3 sm:flex-row";

  return (
    <div className={className}>
      <form className={formClass} onSubmit={onSubmit} noValidate>
        {variant === "info" ? (
          <label>
            Your email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
            />
          </label>
        ) : (
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName || defaultInput}
          />
        )}
        <button
          type="submit"
          className={buttonClassName || defaultButton}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing…" : status === "ok" ? "Subscribed!" : buttonLabel}
        </button>
      </form>
      {status === "ok" && variant !== "studio" && variant !== "journal" && variant !== "news" && (
        <p className="info-form-msg ok">You&apos;re subscribed. Thank you!</p>
      )}
      {status === "err" && (
        <p
          className={
            variant === "info"
              ? "info-form-msg err"
              : "mt-2 text-sm text-red-400"
          }
        >
          We couldn&apos;t complete that. Please try again.
        </p>
      )}
    </div>
  );
}
