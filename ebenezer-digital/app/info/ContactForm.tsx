"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/info/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <form className="info-form" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button className="info-btn info-btn-solid" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
      {status === "ok" && <p className="info-form-msg ok">Message sent. Thank you — we&apos;ll reply soon.</p>}
      {status === "err" && (
        <p className="info-form-msg err">We couldn&apos;t send that. Please try again.</p>
      )}
    </form>
  );
}
