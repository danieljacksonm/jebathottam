"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Testimonials</p>
      <h1 className="studio-display mt-4 text-5xl sm:text-7xl">
        WHAT OUR
        <br />
        CLIENTS SAY.
      </h1>
      <p className="mt-6 max-w-xl text-[var(--st-muted)]">
        Hear from businesses and individuals who have worked with us.
      </p>
      <div className="mt-16 space-y-16">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="border-t border-[var(--st-line)] pt-10">
            <p className="max-w-4xl font-serif text-2xl leading-snug text-white sm:text-4xl">
              “{t.content}”
            </p>
            <footer className="mt-6 text-sm text-[var(--st-muted)]">
              {t.name}
              {t.role || t.company ? ` · ${[t.role, t.company].filter(Boolean).join(", ")}` : ""}
            </footer>
          </blockquote>
        ))}
        {loaded && testimonials.length === 0 && (
          <p className="text-[var(--st-muted)]">Client notes will appear here as they come in.</p>
        )}
      </div>
    </main>
  );
}
