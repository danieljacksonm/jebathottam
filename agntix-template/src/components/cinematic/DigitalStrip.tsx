"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReveal } from "./motion";
import { BUSINESS } from "@/lib/contact";

export function DigitalStrip() {
  const ref = useReveal([]);
  const t = useTranslations("homeCinematic");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="px-5 pb-10 md:px-8"
    >
      <div
        data-reveal
        className="glass-panel mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12"
      >
        <div className="max-w-xl">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("digitalEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            {t("digitalTitle")}
          </h2>
          <p className="mt-4 text-soft-gray">{t("digitalBody")}</p>
          <Link href="/services" className="btn-ghost mt-6 inline-flex">
            {t("digitalCta")}
          </Link>
        </div>
        <div className="w-full max-w-md">
          <p className="mb-4 text-sm text-mist">{t("digitalSoft")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold justify-center"
            >
              {t("digitalWhatsapp")}
            </a>
            <Link href="/enquire" className="btn-ghost justify-center">
              {t("digitalEnquire")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
