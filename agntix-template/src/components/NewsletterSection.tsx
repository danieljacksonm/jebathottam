"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <section className="px-5 pb-8 md:px-8">
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl border border-[var(--line)] bg-navy-mid px-6 py-10 md:flex-row md:items-center md:px-10">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-cream md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm text-mist/85">{t("subtitle")}</p>
          </div>
          {done ? (
            <p className="text-gold-bright">{t("success")}</p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                required
                placeholder={t("placeholder")}
                className="input-field"
              />
              <button type="submit" className="btn-gold shrink-0 !px-4">
                {t("cta")}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
