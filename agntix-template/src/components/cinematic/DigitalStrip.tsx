"use client";

import { FormEvent, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useReveal } from "./motion";

export function DigitalStrip() {
  const ref = useReveal([]);
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

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
            Also available
          </p>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Digital tourism services
          </h2>
          <p className="mt-4 text-soft-gray">
            Packages are Kodaikanal-only. Flights, hotels, and visas support your journey.
          </p>
          <Link href="/services" className="btn-ghost mt-6 inline-flex">
            View services
          </Link>
        </div>
        <div className="w-full max-w-md">
          <p className="mb-3 text-sm text-mist">Stay close to the mist.</p>
          {done ? (
            <p className="text-gold-bright">You are on the list.</p>
          ) : (
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                required
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <button type="submit" className="btn-gold shrink-0 !px-4">
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
