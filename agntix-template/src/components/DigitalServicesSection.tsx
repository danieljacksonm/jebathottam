"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";
import { Reveal } from "./Reveal";

export function DigitalServicesSection() {
  const t = useTranslations("digital");
  const nav = useTranslations("nav");

  const labels: Record<string, string> = {
    flights: nav("flights"),
    hotels: nav("hotels"),
    visa: nav("visa"),
    tours: nav("tours"),
    insurance: t("insurance"),
  };

  const list = services.filter((s) => s.slug !== "insurance").slice(0, 4);

  return (
    <section className="section-pad border-y border-[var(--line)] bg-navy-mid/35">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-mist/90">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <Link href={service.href} className="card-surface relative aspect-[5/4] block">
                <Image
                  src={service.image}
                  alt={labels[service.slug]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-cream">
                    {labels[service.slug]}
                  </h3>
                  <p className="mt-1 text-xs text-cream/70">{t("support")}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/services" className="btn-ghost">
            {t("cta")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
