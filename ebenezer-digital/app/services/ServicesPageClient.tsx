"use client";

import Link from "next/link";
import type { ServiceLanding } from "@/lib/services-catalog";
import type { LocaleMessages } from "@/lib/i18n/load-messages";
import { useLocalePath, useShellMessages } from "@/lib/i18n/use-shell-messages";

type Props = {
  services: ServiceLanding[];
  sections: LocaleMessages["sections"];
  studio: LocaleMessages["studio"];
};

export default function ServicesPageClient({ services, sections, studio }: Props) {
  const t = useShellMessages();
  const lp = useLocalePath();

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">{sections.services}</p>
      <h1 className="studio-display mt-4 text-6xl sm:text-8xl">{studio.whatWeDo}</h1>
      <p className="mt-6 max-w-2xl text-[var(--st-muted)]">{studio.servicesIntro}</p>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <li
            key={service.slug}
            className="border border-[var(--st-line)] p-6 transition hover:border-emerald-400/40"
          >
            <Link href={lp(`/services/${service.slug}`)} className="block" data-cursor="EXPLORE">
              <h2 className="text-xl text-white">{service.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--st-muted)]">{service.value}</p>
              <span className="mt-4 inline-block text-xs uppercase tracking-[0.14em] text-emerald-400">
                {t.readMore} →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link href={lp("/contact")} className="mt-16 inline-flex studio-btn" data-cursor="START">
        {studio.startProject}
      </Link>
    </main>
  );
}
