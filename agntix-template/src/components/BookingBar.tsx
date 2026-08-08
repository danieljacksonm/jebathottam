"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const tabs = ["packages", "flights", "hotels", "visa"] as const;

export function BookingBar() {
  const t = useTranslations("booking");
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("packages");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const destination = String(data.get("destination") || "").trim();
    const dates = String(data.get("dates") || "").trim();
    const guests = String(data.get("guests") || "").trim();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (dates) params.set("dates", dates);
    if (guests) params.set("travelers", guests);
    params.set("package", tab === "packages" ? "kodai-complete" : tab);

    if (tab === "packages") {
      router.push(`/enquire?${params.toString()}`);
      return;
    }
    router.push(`/${tab}?${params.toString()}`);
  }

  return (
    <div className="glass-panel relative z-20 mx-auto -mt-10 w-full max-w-6xl rounded-2xl px-4 py-4 shadow-2xl md:-mt-14 md:px-6 md:py-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3.5 py-1.5 text-[0.68rem] uppercase tracking-[0.12em] transition-colors ${
              tab === key
                ? "bg-gold text-navy"
                : "border border-[var(--line)] text-cream/70 hover:text-cream"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 md:grid-cols-[1.3fr_1fr_0.7fr_auto] md:items-end"
      >
        <label className="block space-y-1.5">
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            {tab === "flights" ? t("from") : t("destination")}
          </span>
          <input
            name="destination"
            className="input-field"
            placeholder={t("destinationPlaceholder")}
            defaultValue={tab === "packages" ? "Kodaikanal" : ""}
            readOnly={tab === "packages"}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            {t("dates")}
          </span>
          <input name="dates" className="input-field" placeholder="DD/MM – DD/MM" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            {t("guests")}
          </span>
          <input name="guests" type="number" min={1} defaultValue={2} className="input-field" />
        </label>
        <button type="submit" className="btn-gold h-[46px] w-full md:w-auto">
          {t("search")}
        </button>
      </form>
    </div>
  );
}
