"use client";

import { Compass, HeartHandshake, Shield, Sparkles } from "lucide-react";
import { useReveal } from "./motion";

const items = [
  {
    icon: Sparkles,
    title: "Quiet luxury",
    body: "Every detail arranged before you ask — stays, transfers, pacing.",
  },
  {
    icon: Compass,
    title: "Kodai specialists",
    body: "One destination, deeply known. Roads, seasons, hidden quiet.",
  },
  {
    icon: Shield,
    title: "Trusted care",
    body: "Clear guidance, private hosts, and calm communication.",
  },
  {
    icon: HeartHandshake,
    title: "Human hospitality",
    body: "Not a template tour — a journey shaped around you.",
  },
];

export function WhyCanaan() {
  const ref = useReveal([]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad bg-navy"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            Why Canaan
          </p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            Premium feels effortless.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                data-reveal
                className="lux-card group p-7 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(214,166,74,0.15)]"
              >
                <Icon
                  className="h-6 w-6 text-gold transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.4}
                />
                <h3 className="mt-6 font-display text-2xl text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
