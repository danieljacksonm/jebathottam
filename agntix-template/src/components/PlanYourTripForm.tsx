"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedPackages } from "@/data/packages";
import type { Locale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/whatsapp";
import { Link } from "@/i18n/navigation";

const HOTEL_OPTS = ["budget", "comfort", "premium", "luxury"] as const;
const NEED_OPTS = [
  "honeymoon",
  "seniors",
  "children",
  "photography",
  "adventure",
  "vegetarian",
  "accessibility",
] as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export function PlanYourTripForm() {
  const t = useTranslations("planTrip");
  const locale = useLocale() as Locale;
  const packages = useMemo(() => getLocalizedPackages(locale), [locale]);

  const [step, setStep] = useState<Step>(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState("");

  const [dates, setDates] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [childAges, setChildAges] = useState("");
  const [startCity, setStartCity] = useState("");
  const [packageId, setPackageId] = useState("");
  const [hotel, setHotel] = useState<(typeof HOTEL_OPTS)[number] | "">("");
  const [budget, setBudget] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const totalSteps = 9;

  function toggleNeed(id: string) {
    setNeeds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function validateStep(): boolean {
    setFormError("");
    if (step === 0 && !dates.trim()) {
      setFormError(t("errDates"));
      return false;
    }
    if (step === 1) {
      const n = Number(adults);
      if (!Number.isFinite(n) || n < 1 || n > 20) {
        setFormError(t("errAdults"));
        return false;
      }
    }
    if (step === 2) {
      const n = Number(children);
      if (!Number.isFinite(n) || n < 0 || n > 15) {
        setFormError(t("errChildren"));
        return false;
      }
      if (n > 0 && !childAges.trim()) {
        setFormError(t("errChildAges"));
        return false;
      }
    }
    if (step === 3 && !startCity.trim()) {
      setFormError(t("errCity"));
      return false;
    }
    if (step === 4 && !packageId) {
      setFormError(t("errPackage"));
      return false;
    }
    if (step === 5 && !hotel) {
      setFormError(t("errHotel"));
      return false;
    }
    if (step === 6 && !budget.trim()) {
      setFormError(t("errBudget"));
      return false;
    }
    if (step === 7) {
      const digits = whatsapp.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        setFormError(t("errWhatsapp"));
        return false;
      }
      if (!name.trim() || !email.trim()) {
        setFormError(t("errContact"));
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 8) as Step);
  }

  function back() {
    setFormError("");
    setStep((s) => Math.max(s - 1, 0) as Step);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateStep()) return;
    setStatus("sending");
    setFormError("");

    const travelers = [
      `${adults} adults`,
      Number(children) > 0
        ? `${children} children (ages: ${childAges})`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    const message = [
      "Plan My Trip enquiry",
      `Start city: ${startCity}`,
      `Hotel preference: ${hotel}`,
      `Budget: ${budget}`,
      needs.length ? `Special needs: ${needs.join(", ")}` : null,
      notes.trim() || null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: whatsapp.trim(),
          website: "",
          travelers,
          dates: dates.trim(),
          packageId: packageId === "custom" ? "" : packageId,
          message,
          locale,
          source: "plan-your-trip",
          hotelPreference: hotel,
          budget: budget.trim(),
          startCity: startCity.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "failed");
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-navy-mid/40 p-8 text-center md:p-12">
        <p className="font-display text-3xl text-gold-bright">{t("success")}</p>
        <p className="mt-4 text-sm text-soft-gray">{t("successBody")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl({ type: "planTrip" })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            {t("whatsappAfter")}
          </a>
          <Link href="/packages" className="btn-ghost">
            {t("browsePackages")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        defaultValue=""
      />

      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-mist/70">
          {t("progress", { current: step + 1, total: totalSteps })}
        </p>
        <div
          className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        >
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepDates")}</legend>
          <input
            className="input-field"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder={t("datesPlaceholder")}
            autoComplete="off"
            required
          />
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepAdults")}</legend>
          <input
            type="number"
            min={1}
            max={20}
            className="input-field"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            required
          />
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-cream">{t("stepChildren")}</legend>
          <label className="block space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
              {t("childrenCount")}
            </span>
            <input
              type="number"
              min={0}
              max={15}
              className="input-field"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
            />
          </label>
          {Number(children) > 0 && (
            <label className="block space-y-2">
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
                {t("childAges")}
              </span>
              <input
                className="input-field"
                value={childAges}
                onChange={(e) => setChildAges(e.target.value)}
                placeholder={t("childAgesPlaceholder")}
              />
            </label>
          )}
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepCity")}</legend>
          <input
            className="input-field"
            value={startCity}
            onChange={(e) => setStartCity(e.target.value)}
            placeholder={t("cityPlaceholder")}
            autoComplete="address-level2"
            required
          />
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepPackage")}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {packages.map((pkg) => (
              <label
                key={pkg.id}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${
                  packageId === pkg.id
                    ? "border-gold bg-gold/10 text-cream"
                    : "border-[var(--line)] text-white/75 hover:border-gold/40"
                }`}
              >
                <input
                  type="radio"
                  name="packageId"
                  className="sr-only"
                  checked={packageId === pkg.id}
                  onChange={() => setPackageId(pkg.id)}
                />
                <span className="font-medium">{pkg.title}</span>
                <span className="mt-1 block text-xs text-mist/70">
                  {pkg.days}D / {pkg.nights}N
                </span>
              </label>
            ))}
            <label
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition sm:col-span-2 ${
                packageId === "custom"
                  ? "border-gold bg-gold/10 text-cream"
                  : "border-[var(--line)] text-white/75 hover:border-gold/40"
              }`}
            >
              <input
                type="radio"
                name="packageId"
                className="sr-only"
                checked={packageId === "custom"}
                onChange={() => setPackageId("custom")}
              />
              {t("customPackage")}
            </label>
          </div>
        </fieldset>
      )}

      {step === 5 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepHotel")}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {HOTEL_OPTS.map((opt) => (
              <label
                key={opt}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm capitalize transition ${
                  hotel === opt
                    ? "border-gold bg-gold/10 text-cream"
                    : "border-[var(--line)] text-white/75 hover:border-gold/40"
                }`}
              >
                <input
                  type="radio"
                  name="hotel"
                  className="sr-only"
                  checked={hotel === opt}
                  onChange={() => setHotel(opt)}
                />
                {t(`hotel_${opt}`)}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 6 && (
        <fieldset className="space-y-3">
          <legend className="font-display text-2xl text-cream">{t("stepBudget")}</legend>
          <input
            className="input-field"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t("budgetPlaceholder")}
            required
          />
        </fieldset>
      )}

      {step === 7 && (
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-cream">{t("stepWhatsapp")}</legend>
          <label className="block space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
              {t("name")} *
            </span>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={80}
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
              {t("email")} *
            </span>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
              {t("whatsappNumber")} *
            </span>
            <input
              className="input-field"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 …"
              required
            />
          </label>
        </fieldset>
      )}

      {step === 8 && (
        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-cream">{t("stepNeeds")}</legend>
          <div className="flex flex-wrap gap-2">
            {NEED_OPTS.map((opt) => {
              const on = needs.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleNeed(opt)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                    on
                      ? "border-gold bg-gold/15 text-gold-bright"
                      : "border-[var(--line)] text-white/70 hover:border-gold/40"
                  }`}
                  aria-pressed={on}
                >
                  {t(`need_${opt}`)}
                </button>
              );
            })}
          </div>
          <label className="block space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-mist/70">
              {t("notes")}
            </span>
            <textarea
              className="input-field resize-y"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1500}
              placeholder={t("notesPlaceholder")}
            />
          </label>
        </fieldset>
      )}

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

      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <button type="button" className="btn-ghost" onClick={back}>
            {t("back")}
          </button>
        )}
        {step < 8 ? (
          <button type="button" className="btn-gold" onClick={next}>
            {t("next")}
          </button>
        ) : (
          <button
            type="submit"
            className="btn-gold disabled:opacity-60"
            disabled={status === "sending"}
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        )}
      </div>
    </form>
  );
}
