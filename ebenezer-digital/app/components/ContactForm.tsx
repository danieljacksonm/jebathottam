"use client";

export default function ContactForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Your name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="John Smith"
          className="contact-input w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition"
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
          placeholder="john@example.com"
          className="contact-input w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition"
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
          placeholder="Describe your project or request..."
          className="contact-input w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition resize-none"
        />
      </div>
      <button
        type="submit"
        className="btn-submit-hover w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] px-6 py-3 font-semibold hover:bg-[var(--accent-hover)] transition-colors btn-hover"
      >
        Send message
      </button>
    </form>
  );
}
