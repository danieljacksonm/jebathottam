"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";
import { useStudioSiteCopy } from "@/lib/i18n/use-shell-messages";

function StudioChoices({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="studio-choices" role="listbox">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="option"
          aria-selected={value === opt.value}
          className={`studio-choice ${value === opt.value ? "is-on" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Contact() {
  const copy = useStudioSiteCopy();
  const c = copy.contact;
  const common = copy.common;
  const steps = useMemo(
    () => [
      { key: "service", label: c.stepService },
      { key: "budget", label: c.stepBudget },
      { key: "message", label: c.stepMessage },
      { key: "details", label: c.stepDetails },
    ],
    [c]
  );

  const serviceOptions = useMemo(
    () => [
      { value: "web", label: c.optWeb },
      { value: "data", label: c.optData },
      { value: "travel", label: c.optTravel },
      { value: "other", label: c.optOther },
    ],
    [c]
  );

  const budgetOptions = [
    { value: "500-1000", label: "$500 – $1,000" },
    { value: "1000-5000", label: "$1,000 – $5,000" },
    { value: "5000-10000", label: "$5,000 – $10,000" },
    { value: "10000+", label: "$10,000+" },
  ];

  const contactInfo = [
    { label: c.email, value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
    { label: c.phone, value: SITE_PHONE_DISPLAY, href: SITE_PHONE_TEL },
    { label: c.whatsapp, value: SITE_PHONE_DISPLAY, href: SITE_WHATSAPP_URL },
    { label: c.location, value: c.locationValue },
    { label: c.hours, value: c.hoursValue },
  ];

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
    <section id="contact" className="relative overflow-hidden border-t border-[var(--st-line)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-10">
        <div className="min-w-0">
          <p className="studio-kicker">{c.kicker}</p>
          <h2 className="studio-display mt-4 text-[2.1rem] leading-[0.95] sm:text-5xl lg:text-7xl">
            {c.titleLine1}
            <br />
            {c.titleLine2}
            <br />
            {c.titleLine3}
          </h2>
          <ul className="mt-10 space-y-4 text-sm text-[var(--st-muted)]">
            {contactInfo.map((item) => (
              <li key={item.label}>
                {"href" in item && item.href ? (
                  <a href={item.href} className="hover:text-white">
                    {item.label} — {item.value}
                  </a>
                ) : (
                  <span>
                    {item.label} — {item.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border border-[var(--st-line)] bg-black/40 p-5 sm:p-8">
          {submitStatus === "success" ? (
            <div>
              <p className="studio-kicker">{c.receivedKicker}</p>
              <h3 className="studio-display mt-4 text-4xl">{c.receivedTitle}</h3>
              <p className="mt-4 text-[var(--st-muted)]">{c.receivedBody}</p>
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
                    <StudioChoices
                      value={formData.service}
                      onChange={(service) => setFormData({ ...formData, service })}
                      options={serviceOptions}
                    />
                  )}
                  {step === 1 && (
                    <StudioChoices
                      value={formData.budget}
                      onChange={(budget) => setFormData({ ...formData, budget })}
                      options={budgetOptions}
                    />
                  )}
                  {step === 2 && (
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={c.messagePlaceholder}
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
                        placeholder={c.namePlaceholder}
                        className="border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={c.emailPlaceholder}
                        className="border-b border-[var(--st-line)] bg-transparent py-3 text-white outline-none"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-wrap gap-3">
                {step > 0 && (
                  <button type="button" onClick={prev} className="studio-btn studio-btn-ghost">
                    {common.previous}
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={(step === 0 && !formData.service) || (step === 1 && !formData.budget)}
                    className="studio-btn disabled:opacity-40"
                    data-cursor="START"
                  >
                    {common.continue}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    onClick={() => void handleSubmit()}
                    className="studio-btn disabled:opacity-40"
                    data-cursor="START"
                  >
                    {isSubmitting ? common.sending : common.sendProject}
                  </button>
                )}
              </div>
              {submitStatus === "error" && (
                <p className="mt-4 text-sm text-red-400">
                  {c.errorBody}{" "}
                  <a href={`mailto:${SITE_EMAIL}`} className="underline hover:text-red-300">
                    {SITE_EMAIL}
                  </a>
                  .
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
