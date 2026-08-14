"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-[var(--st-line)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <p className="studio-kicker">Voices</p>
        <h2 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">IN THEIR WORDS.</h2>
        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <motion.blockquote
                  key={t.id}
                  className="min-w-0 flex-[0_0_100%] pr-8 sm:flex-[0_0_80%]"
                >
                  <p className="font-serif text-2xl leading-snug text-white sm:text-4xl">
                    “{t.content}”
                  </p>
                  <footer className="mt-8 text-sm text-[var(--st-muted)]">
                    {t.name}
                    {t.role || t.company ? ` · ${[t.role, t.company].filter(Boolean).join(", ")}` : ""}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Previous" className="border border-[var(--st-line)] p-3 disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={scrollNext} disabled={!canScrollNext} aria-label="Next" className="border border-[var(--st-line)] p-3 disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-[var(--st-line)] pt-10 md:grid-cols-4">
          {[
            { value: "98%", label: "Client satisfaction" },
            { value: "150+", label: "Projects delivered" },
            { value: "50+", label: "Active clients" },
            { value: "5+", label: "Years experience" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="studio-display text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--st-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
