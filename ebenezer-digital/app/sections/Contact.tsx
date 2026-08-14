"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const contactInfo = [
  {
    label: "Email",
    value: "contact@ebenezerdigitalservices.com",
    href: "mailto:contact@ebenezerdigitalservices.com",
  },
  {
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  { label: "Location", value: "Remote / Worldwide", href: "#" },
  { label: "Working Hours", value: "24/7 Support Available", href: "#" },
];

const steps = [
  { key: "service", label: "What are you building?" },
  { key: "budget", label: "What’s your budget?" },
  { key: "message", label: "Tell us about it." },
  { key: "details", label: "How do we reach you?" },
] as const;

export default function Contact() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setSubmitStatus("success");
      setFormData({ name: "", email: "", service: "", budget: "", message: "" });
      setStep(0);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <section id="contact" className="relative overflow-hidden border-t border-[var(--st-line)] py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div>
          <p className="studio-kicker">Begin</p>
          <h2 className="studio-display mt-4 text-5xl sm:text-7xl">
            LET’S BUILD
            <br />
            SOMETHING
            <br />
            EXCEPTIONAL.
          </h2>
          <ul className="mt-10 space-y-4 text-sm text-[var(--st-muted)]">
            {contactInfo.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-white">
                  {item.label} — {item.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-[var(--st-line)] bg-black/30 p-6 sm:p-8">
          {submitStatus === "success" ? (
            <div>
              <p className="studio-kicker">Received</p>
              <h3 className="studio-display mt-4 text-4xl">PROJECT RECEIVED.</h3>
              <p className="mt-4 text-[var(--st-muted)]">We’ll reply soon.</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Step {step + 1} / {steps.length}
              </p>
              <h3 className="mt-3 font-serif text-3xl">{steps[step].label}</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[step].key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 space-y-4"
                >
                  {step === 0 && (
                    <select
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                    >
                      <option value="">Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="data">Data Entry & Admin</option>
                      <option value="travel">Travel & Booking</option>
                      <option value="other">Other Services</option>
                    </select>
                  )}
                  {step === 1 && (
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                    >
                      <option value="">Select budget</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                  )}
                  {step === 2 && (
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="w-full border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                    />
                  )}
                  {step === 3 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-wrap gap-3">
                {step > 0 && (
                  <button type="button" onClick={prev} className="studio-btn studio-btn-ghost">
                    Previous
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button type="button" onClick={next} className="studio-btn" data-cursor="START">
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    onClick={() => void handleSubmit()}
                    className="studio-btn disabled:opacity-40"
                    data-cursor="START"
                  >
                    {isSubmitting ? "Sending…" : "Send project →"}
                  </button>
                )}
              </div>
              {submitStatus === "error" && (
                <p className="mt-4 text-sm text-red-400">Something went wrong. Please try again.</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
