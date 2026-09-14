"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function CorporateEnquiryForm() {
  const t = useTranslations("corporate");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const company = String(data.get("company") || "").trim();
    const travelType = String(data.get("travelType") || "").trim();
    const travelers = String(data.get("travelers") || "").trim();
    const destination = String(data.get("destination") || "").trim();
    const departure = String(data.get("departure") || "").trim();
    const dates = String(data.get("dates") || "").trim();
    const budget = String(data.get("budget") || "").trim();
    const requirements = String(data.get("requirements") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const website = String(data.get("website") || "").trim();

    if (!name || !email || !phone || !company) {
      setFormError("Please fill name, company, work email, and phone.");
      return;
    }

    const message = [
      `Company: ${company}`,
      `Travel type: ${travelType || "—"}`,
      `Destination: ${destination || "—"}`,
      `Departure: ${departure || "—"}`,
      `Requirements: ${requirements || "—"}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("sending");
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          website,
          travelers,
          dates,
          budget,
          startCity: departure,
          message,
          locale,
          source: "corporate",
          packageId: "",
          hotelPreference: travelType.slice(0, 40),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-[var(--line)] bg-navy/40 px-4 py-3 text-sm text-white outline-none focus:border-gold/60";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-mist">
          {t("name")} *
          <input name="name" required className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("company")} *
          <input name="company" required className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("workEmail")} *
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("phone")} *
          <input name="phone" type="tel" required className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("travelType")}
          <select name="travelType" className={fieldClass} defaultValue="">
            <option value="">Select…</option>
            <option value="business">{t("types.business")}</option>
            <option value="retreat">{t("types.retreat")}</option>
            <option value="outing">{t("types.outing")}</option>
            <option value="conference">{t("types.conference")}</option>
            <option value="mice">{t("types.mice")}</option>
            <option value="transfer">{t("types.transfer")}</option>
            <option value="other">{t("types.other")}</option>
          </select>
        </label>
        <label className="block text-sm text-mist">
          {t("travellers")}
          <input name="travelers" className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("destination")}
          <input name="destination" className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("departure")}
          <input name="departure" className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("dates")}
          <input name="dates" className={fieldClass} />
        </label>
        <label className="block text-sm text-mist">
          {t("budget")}
          <input name="budget" className={fieldClass} />
        </label>
      </div>

      <label className="block text-sm text-mist">
        {t("requirements")}
        <textarea name="requirements" rows={4} className={fieldClass} />
      </label>
      <label className="block text-sm text-mist">
        {t("notes")}
        <textarea name="notes" rows={3} className={fieldClass} />
      </label>

      {formError ? <p className="text-sm text-red-300">{formError}</p> : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-300">{t("success")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300">{t("error")}</p>
      ) : null}

      <button
        type="submit"
        className="btn-gold"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : t("submit")}
      </button>
    </form>
  );
}
