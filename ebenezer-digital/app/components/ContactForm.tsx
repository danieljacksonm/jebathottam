"use client";

import { useState } from "react";
import { SITE_EMAIL } from "@/lib/site-contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      service: "general",
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {status === "success" && (
        <p className="text-green-400 text-sm">Message sent successfully. We will reply soon.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">
          Failed to send. Please try again or{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="underline hover:text-red-300">
            email {SITE_EMAIL}
          </a>{" "}
          directly.
        </p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Your name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          placeholder="John Smith"
          disabled={status === "submitting"}
          className="contact-input w-full border-b border-[var(--st-line,#1f1f20)] bg-transparent px-0 py-3 text-white placeholder:text-white/30 outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          disabled={status === "submitting"}
          placeholder="john@example.com"
          className="contact-input w-full border-b border-[var(--st-line,#1f1f20)] bg-transparent px-0 py-3 text-white placeholder:text-white/30 outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={status === "submitting"}
          placeholder="Describe your project or request..."
          className="contact-input w-full resize-none border-b border-[var(--st-line,#1f1f20)] bg-transparent px-0 py-3 text-white placeholder:text-white/30 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="studio-btn disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
