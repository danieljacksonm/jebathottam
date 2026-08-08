"use client";

import {
  Award,
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { trustKeys } from "@/data/services";
import { Reveal } from "./Reveal";

const icons = {
  handpicked: Sparkles,
  price: BadgeCheck,
  support: Headphones,
  secure: ShieldCheck,
  trusted: Award,
};

export function TrustRow() {
  const t = useTranslations("trust");

  return (
    <section className="section-pad border-b border-[var(--line)] pt-16 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {trustKeys.map((key, i) => {
          const Icon = icons[key];
          return (
            <Reveal key={key} delay={i * 0.05} className="text-center">
              <Icon className="mx-auto h-6 w-6 text-gold" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-cream/85">{t(key)}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
