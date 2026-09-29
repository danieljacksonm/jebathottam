"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedPackages } from "@/data/packages";
import type { Locale } from "@/i18n/routing";

const serviceOptions = [
  { id: "flights", label: { en: "Flights", ta: "விமானம்", hi: "फ़्लाइट" } },
  { id: "hotels", label: { en: "Hotels", ta: "ஹோட்டல்", hi: "होटल" } },
  { id: "visa", label: { en: "Visa", ta: "விசா", hi: "वीज़ा" } },
  { id: "trains", label: { en: "Train tickets", ta: "ரயில் டிக்கெட்", hi: "ट्रेन टिकट" } },
  {
    id: "consulting",
    label: {
      en: "Travel consulting",
      ta: "பயண ஆலோசனை",
      hi: "यात्रा परामर्श",
    },
  },
  { id: "tours", label: { en: "Custom tours", ta: "தனிப்பயன் சுற்றுலா", hi: "कस्टम टूर" } },
  {
    id: "corporate",
    label: {
      en: "Corporate travel",
      ta: "கார்ப்பரேட் பயணம்",
      hi: "कॉर्पोरेट यात्रा",
    },
  },
];

type PackageOption = { id: string; label: string };

export function EnquireForm({
  packages: packagesProp,
}: {
  packages?: PackageOption[];
}) {
  const t = useTranslations("enquirePage");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const preset = searchParams.get("package") ?? "";
  const presetTier = searchParams.get("tier") ?? "";
  const presetDates = searchParams.get("dates") ?? "";
  const presetTravelers = searchParams.get("travelers") ?? "";
  const presetDestination = searchParams.get("destination") ?? "";

  const presetService = searchParams.get("service") ?? "";
  const presetSource = searchParams.get("source") ?? "enquire";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [reference, setReference] = useState("");
  const [formError, setFormError] = useState("");

  const packageOptions = useMemo(
    () => [
      ...(packagesProp ??
        getLocalizedPackages(locale).map((pkg) => ({
          id: pkg.id,
          label: pkg.title,
        }))),
      ...serviceOptions.map((s) => ({
        id: s.id,
        label: s.label[locale],
      })),
    ],
    [locale, packagesProp],
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
      whatsapp: String(data.get("whatsapp") || "").trim(),
      country: String(data.get("country") || "").trim(),
      website: String(data.get("website") || "").trim(),
      travelers: String(data.get("adults") || "").trim(),
      dates: String(data.get("travelStartDate") || "").trim(),
      packageId: String(data.get("packageId") || "").trim(),
      destination: String(data.get("destination") || "").trim(),
      departureLocation: String(data.get("departureLocation") || "").trim(),
      travelType: String(data.get("travelType") || "").trim(),
      travelStartDate: String(data.get("travelStartDate") || "").trim(),
      travelEndDate: String(data.get("travelEndDate") || "").trim(),
      flexibleDates: data.get("flexibleDates") === "on",
      adults: Number(data.get("adults") || 1),
      children: Number(data.get("children") || 0),
      infants: Number(data.get("infants") || 0),
      budget: String(data.get("budget") || "").trim(),
      currency: String(data.get("currency") || "INR"),
      services: data.getAll("services").map(String),
      hotelPreference: String(data.get("hotelPreference") || "").trim(),
      transportPreference: String(data.get("transportPreference") || "").trim(),
      message: String(data.get("message") || "").trim(),
      locale,
      source: presetSource,
      sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
      utmSource: searchParams.get("utm_source") || "",
      utmMedium: searchParams.get("utm_medium") || "",
      utmCampaign: searchParams.get("utm_campaign") || "",
      utmContent: searchParams.get("utm_content") || "",
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
      const json = (await res.json().catch(() => ({}))) as {
        referenceNumber?: string;
      };
      if (!res.ok) throw new Error("failed");
      setReference(json.referenceNumber || "");
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
        {reference ? (
          <p className="mt-4 text-soft-gray">{t("reference", { ref: reference })}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot for basic bot spam. Legit users won't fill this. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ display: "none" }}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("name")} *
          </span>
          <input
            name="name"
            className="input-field"
            required
            autoComplete="name"
            maxLength={80}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("email")} *
          </span>
          <input
            name="email"
            type="email"
            className="input-field"
            required
            autoComplete="email"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("phone")} *
          </span>
          <input
            name="phone"
            className="input-field"
            required
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("country")}
          </span>
          <input name="country" className="input-field" autoComplete="country-name" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            WhatsApp
          </span>
          <input name="whatsapp" className="input-field" autoComplete="tel" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("destination")}
          </span>
          <input
            name="destination"
            className="input-field"
            defaultValue={presetDestination || undefined}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("departure")}
          </span>
          <input name="departureLocation" className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("adults")}
          </span>
          <input
            name="adults"
            type="number"
            min={1}
            className="input-field"
            defaultValue={presetTravelers || "1"}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("children")}
          </span>
          <input name="children" type="number" min={0} className="input-field" defaultValue={0} />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("infants")}
          </span>
          <input name="infants" type="number" min={0} className="input-field" defaultValue={0} />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("startDate")}
          </span>
          <input
            name="travelStartDate"
            type="date"
            className="input-field"
            defaultValue={presetDates || undefined}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("endDate")}
          </span>
          <input name="travelEndDate" type="date" className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("travelType")}
          </span>
          <select name="travelType" className="input-field" defaultValue="">
            <option value="">—</option>
            {["honeymoon", "family", "group", "adventure", "pilgrimage", "corporate", "custom"].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("budget")}
          </span>
          <input name="budget" className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("hotel")}
          </span>
          <input name="hotelPreference" className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("transport")}
          </span>
          <input name="transportPreference" className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
            {t("package")}
          </span>
          <select name="packageId" className="input-field" defaultValue={preset || presetService}>
            <option value="">{t("packagePlaceholder")}</option>
            {packageOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-mist">
        <input type="checkbox" name="flexibleDates" />
        {t("flexible")}
      </label>
      <fieldset className="space-y-2">
        <legend className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
          {t("services")}
        </legend>
        <div className="flex flex-wrap gap-3">
          {serviceOptions.map((service) => (
            <label key={service.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="services"
                value={service.id}
                defaultChecked={presetService === service.id}
              />
              {service.label[locale]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
          {t("message")}
        </span>
        <textarea
          name="message"
          rows={5}
          className="input-field resize-y"
          placeholder={t("messagePlaceholder")}
          maxLength={2000}
          defaultValue={
            [
              presetDestination ? `Destination interest: ${presetDestination}` : "",
              presetTier ? `Preferred tier: ${presetTier}` : "",
            ]
              .filter(Boolean)
              .join("\n") || undefined
          }
        />
      </label>

      {formError && (
        <p className="text-sm text-gold-bright" role="alert">
          {formError}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-300" role="alert">
          {t("error")}
        </p>
      )}

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
