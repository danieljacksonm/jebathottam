"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import HorizontalScroll, { HorizontalScrollItem } from "../components/HorizontalScroll";
import { IMG } from "@/lib/images";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  category: "digital" | "travel" | "web" | "other";
};

const categoryMeta: Record<string, { label: string; img: string; alt: string }> = {
  digital: { label: "Digital & admin", img: IMG.services.digital, alt: "Data and admin" },
  travel: { label: "Travel & booking", img: IMG.services.travel, alt: "Travel" },
  web: { label: "Web & technical", img: IMG.services.web, alt: "Web development" },
  other: { label: "Other services", img: IMG.services.other, alt: "Online support" },
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]));
  }, []);

  const blocks = useMemo(() => {
    return (["digital", "travel", "web", "other"] as const)
      .map((key) => {
        const items = services.filter((s) => s.category === key);
        if (!items.length) return null;
        const meta = categoryMeta[key];
        return {
          category: meta.label,
          img: meta.img,
          alt: meta.alt,
          items: items.map((s) => ({ title: s.title, desc: s.description })),
        };
      })
      .filter(Boolean) as Array<{
      category: string;
      img: string;
      alt: string;
      items: { title: string; desc: string }[];
    }>;
  }, [services]);

  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <h1 className="font-display section-head heading-shine section-h2-reveal text-3xl sm:text-4xl font-bold text-center lg:text-left mb-4">
              What we do
            </h1>
            <p className="section-sub-p section-copy-reveal text-[var(--text-muted)] text-center lg:text-left max-w-2xl mb-20">
              From admin tasks to web development and travel support—a range of digital services tailored to your needs.
            </p>
          </AnimateOne>

          <AnimateSection variant="zoom-in" className="mb-16">
            <p className="section-intro-p hscroll-label-reveal text-[var(--text-muted)] text-sm mb-4">
              Swipe or drag to explore
            </p>
            <HorizontalScroll>
              {Object.values(categoryMeta).map((item) => (
                <HorizontalScrollItem key={item.label}>
                  <div className="horizontal-scroll-card card-dark card-service card-service-hover rounded-xl overflow-hidden h-full">
                    <div className="relative aspect-[4/3] img-hover-overlay">
                      <Image src={item.img} alt={item.alt} fill sizes="380px" className="object-cover" />
                    </div>
                    <p className="hscroll-card-label p-4 font-display font-semibold text-[var(--text)] text-sm uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                </HorizontalScrollItem>
              ))}
            </HorizontalScroll>
          </AnimateSection>

          <div className="space-y-20">
            {blocks.map((block) => (
              <div key={block.category}>
                <AnimateSection variant="fade-up" className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                  <AnimateOne variant="fade-up">
                    <p className="service-cat-label text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest">
                      {block.category}
                    </p>
                  </AnimateOne>
                  <div className="aos-item section-img-wrap relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                    <Image src={block.img} alt={block.alt} fill sizes="192px" className="object-cover" />
                  </div>
                </AnimateSection>
                <AnimateSection
                  variant={block.items.length === 4 ? "stagger-slow" : "fade-up"}
                  className={`grid sm:grid-cols-2 gap-5 ${block.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
                >
                  {block.items.map((item) => (
                    <div
                      key={item.title}
                      className="aos-item card-dark rounded-xl border border-[var(--border)] p-5 bg-[var(--bg)]"
                    >
                      <h3 className="font-display font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </AnimateSection>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollParallax>
  );
}
