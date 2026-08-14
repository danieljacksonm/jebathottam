"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function WeatherChip() {
  const t = useTranslations("journey");
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="glass-panel pointer-events-auto absolute left-5 top-28 z-20 hidden overflow-hidden rounded-2xl px-4 py-3 text-left md:block"
      aria-expanded={open}
    >
      <p className="font-display text-2xl text-white">{t("weatherTemp")}</p>
      <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.2em] text-gold-bright">
        {t("weatherLabel")}
      </p>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="mt-3 max-w-[11rem] text-xs leading-relaxed text-soft-gray">
            {t("weatherNote")}
          </p>
          <span className="mt-3 block h-6 w-16 rounded-full bg-white/20 blur-md" />
        </div>
      </div>
    </button>
  );
}
