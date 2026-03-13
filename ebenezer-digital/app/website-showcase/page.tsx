import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import { IMG } from "@/lib/images";

const sites = [
  {
    title: "Consulting & services site",
    desc: "Multi-page website with clear navigation and dedicated pages for each section.",
    pages: [
      { label: "Home", img: IMG.pages.home },
      { label: "Services", img: IMG.pages.services },
      { label: "About", img: IMG.pages.about },
      { label: "Contact", img: IMG.pages.contact },
    ],
  },
  {
    title: "Business & portfolio site",
    desc: "Full website with hero, services grid, team section, and contact form.",
    pages: [
      { label: "Home", img: IMG.pages.home2 },
      { label: "Services", img: IMG.pages.services2 },
      { label: "About", img: IMG.pages.about2 },
      { label: "Contact", img: IMG.pages.contact2 },
    ],
  },
];

export default function WebsiteShowcasePage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-left">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">Website showcase</p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Full-site projects — multiple pages
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] max-w-2xl mb-16">
              We build complete websites with distinct pages: home, services, about, contact, and more—not just single-page sites.
            </p>
          </AnimateOne>

          {sites.map((site) => (
            <AnimateSection key={site.title} variant="slide-up-strong" className="mb-20 last:mb-0">
              <div className="aos-item mb-8">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text)] mb-2">{site.title}</h2>
                <p className="text-[var(--text-muted)] max-w-xl">{site.desc}</p>
              </div>
              <div className="aos-item page-screenshots-grid flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                {site.pages.map((page) => (
                  <div key={page.label} className="browser-frame card-dark rounded-lg overflow-hidden border border-[var(--border)] shadow-xl flex-shrink-0">
                    <div className="browser-frame-bar flex items-center gap-1.5 px-3 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]/40" aria-hidden />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]/40" aria-hidden />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]/40" aria-hidden />
                      <span className="text-[var(--text-muted)] text-xs font-medium ml-2 truncate flex-1 min-w-0">{page.label}</span>
                    </div>
                    <div className="relative aspect-video w-full min-w-[200px] sm:min-w-[240px] max-w-[280px] overflow-hidden img-hover-overlay">
                      <Image
                        src={page.img}
                        alt={`${page.label} page screenshot`}
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnimateSection>
          ))}
        </div>
      </section>
    </ScrollParallax>
  );
}
