"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { packages, packageCopy, type PackageId } from "@/data/packages";
import type { Locale } from "@/i18n/routing";

const serviceOptions = [
  { id: "flights", label: { en: "Flights", ta: "விமானம்", hi: "फ़्लाइट" } },
  { id: "hotels", label: { en: "Hotels", ta: "ஹோட்டல்", hi: "होटल" } },
  { id: "visa", label: { en: "Visa", ta: "விசா", hi: "वीज़ा" } },
  { id: "tours", label: { en: "Tours", ta: "சுற்றுலா", hi: "टूर्स" } },
];

export function EnquireForm() {
  const t = useTranslations("enquirePage");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const preset = searchParams.get("package") ?? "";
  const presetDates = searchParams.get("dates") ?? "";
  const presetTravelers = searchParams.get("travelers") ?? "";
  const presetDestination = searchParams.get("destination") ?? "";

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState("");

  const packageOptions = useMemo(
    () => [
      ...packages.map((pkg) => ({
        id: pkg.id,
        label: packageCopy[pkg.id as PackageId].title[locale],
      })),
      ...serviceOptions.map((s) => ({
        id: s.id,
        label: s.label[locale],
      })),
    ],
    [locale],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      travelers: String(data.get("travelers") || "").trim(),
      dates: String(data.get("dates") || "").trim(),
      packageId: String(data.get("packageId") || "").trim(),
      message: String(data.get("message") || "").trim(),
      locale,
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setFormError(t("required"));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-navy-mid/50 p-8 text-center md:p-12">
        <p className="font-display text-3xl text-gold-bright">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("name")} *
          </span>
          <input name="name" className="input-field" required />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("email")} *
          </span>
          <input name="email" type="email" className="input-field" required />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("phone")} *
          </span>
          <input name="phone" className="input-field" required />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("travelers")}
          </span>
          <input
            name="travelers"
            type="number"
            min={1}
            className="input-field"
            defaultValue={presetTravelers || undefined}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("dates")}
          </span>
          <input
            name="dates"
            className="input-field"
            placeholder="DD/MM – DD/MM"
            defaultValue={presetDates || undefined}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("package")}
          </span>
          <select name="packageId" className="input-field" defaultValue={preset}>
            <option value="">{t("packagePlaceholder")}</option>
            {packageOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
          {t("message")}
        </span>
        <textarea
          name="message"
          rows={5}
          className="input-field resize-y"
          placeholder={t("messagePlaceholder")}
          defaultValue={
            presetDestination ? `Destination interest: ${presetDestination}` : undefined
          }
        />
      </label>

      {formError && <p className="text-sm text-gold-bright">{formError}</p>}
      {status === "error" && <p className="text-sm text-red-300">{t("error")}</p>}

      <button
        type="submit"
        className="btn-gold disabled:opacity-60"
        disabled={status === "sending"}
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
