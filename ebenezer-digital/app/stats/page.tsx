import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Results & Stats | Ebenezer Digital Services",
  description: "Delivery focus, client communication, and the kind of work Ebenezer Digital is built for.",
  path: "/stats",
});

export default function StatsPage() {
  return (
    <>
      <ScrollParallax>
        <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
          <div className="section-reveal container-wide">
            <AnimateOne variant="zoom-in">
              <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">By the numbers</p>
              <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-16 text-center">
                Scale you can trust
              </h1>
            </AnimateOne>
            <AnimateSection variant="slide-up-strong" className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {[
                { value: "2,500+", label: "Projects delivered" },
                { value: "40+", label: "Countries served" },
                { value: "12", label: "Years in business" },
                { value: "99%", label: "Client satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="aos-item text-center">
                  <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent)] mb-2 tabular-nums">{stat.value}</p>
                  <p className="text-[var(--text-muted)] text-sm sm:text-base font-medium">{stat.label}</p>
                </div>
              ))}
            </AnimateSection>
          </div>
        </section>
      </ScrollParallax>
      <ScrollParallax>
        <section className="section-padding border-b border-[var(--border)] overflow-hidden">
          <div className="section-reveal container-wide">
            <AnimateOne variant="fade-up">
              <p className="section-intro-p text-[var(--text-muted)] text-center text-sm uppercase tracking-widest mb-8">Trusted by teams worldwide</p>
            </AnimateOne>
            <AnimateSection variant="fade-up" className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
              {["Startups", "SMBs", "Enterprises", "Agencies", "Nonprofits", "Consultancies"].map((name) => (
                <span key={name} className="aos-item text-[var(--text-muted)]/70 font-display font-semibold text-lg sm:text-xl tracking-tight">
                  {name}
                </span>
              ))}
            </AnimateSection>
          </div>
        </section>
      </ScrollParallax>
    </>
  );
}
