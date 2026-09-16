"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";

export function ContactClient() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (name.length < 2 || !email.includes("@") || message.length < 10) {
      setStatus("error");
      return;
    }
    const subject = encodeURIComponent(`Raju Stickers contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <div className="container-x py-8 sm:py-12 max-w-2xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="section-title mb-2">Contact</h1>
      <p className="section-sub mb-8">
        Questions about finishes, sizing, or orders? Reach the team directly.
      </p>

      <div className="card-surface p-5 mb-6 text-sm text-[var(--text-muted)] space-y-1">
        <p>
          Email:{" "}
          <a className="text-white hover:text-[var(--accent)]" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p>
          Phone:{" "}
          <a className="text-white hover:text-[var(--accent)]" href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>
            {SUPPORT_PHONE}
          </a>
        </p>
      </div>

      <form onSubmit={onSubmit} className="card-surface p-5 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm text-[var(--text-muted)]">
            Name
          </label>
          <input id="name" name="name" className="input mt-1" required />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-[var(--text-muted)]">
            Email
          </label>
          <input id="email" name="email" type="email" className="input mt-1" required />
        </div>
        <div>
          <label htmlFor="message" className="text-sm text-[var(--text-muted)]">
            Message
          </label>
          <textarea id="message" name="message" className="textarea mt-1" required minLength={10} />
        </div>
        {status === "error" && (
          <p className="text-sm text-[var(--danger)]">Please fill in all fields correctly.</p>
        )}
        {status === "sent" && (
          <p className="text-sm text-[var(--success)]">Opening your email app…</p>
        )}
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
}
