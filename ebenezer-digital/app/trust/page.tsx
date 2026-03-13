import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import { IMG } from "@/lib/images";

export default function TrustPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] section-glow-edge">
        <div className="section-reveal container-wide">
          <AnimateOne variant="zoom-in">
            <div className="section-divider mb-8" aria-hidden />
            <h1 className="line-draw section-head heading-shine section-h2-reveal gradient-text-shine text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4 inline-block">
              Why clients trust us
            </h1>
            <p className="section-intro-p trust-intro-p text-[var(--text-muted)] max-w-xl mb-12 text-left">
              We work with businesses and individuals across the globe. Clarity, consistency, and respect for your time and budget.
            </p>
          </AnimateOne>
          <AnimateSection variant="slide-up-strong" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="aos-item trust-img-wrap img-reveal-wrap img-blur-in relative aspect-[3/2] sm:aspect-auto sm:min-h-[200px] rounded-2xl overflow-hidden border border-[var(--border)] order-first sm:col-span-2 lg:col-span-1">
              <Image
                src={IMG.trust}
                alt="Team collaboration - reliable partnership"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="aos-item card-enter-left card-dark card-trust card-float card-shine-bottom rounded-2xl p-8 border-glow">
              <h2 className="trust-card-title font-display text-lg font-semibold text-[var(--text)] mb-3">Reliability</h2>
              <p className="trust-card-body text-[var(--text-muted)] text-[15px] leading-relaxed">
                We deliver on our promises. Deadlines are agreed in advance and we stick to them. Your project gets the same care whether you are in the US, Europe, the Middle East, or Asia.
              </p>
            </div>
            <div className="aos-item card-enter-left card-dark card-trust card-float card-shine-bottom rounded-2xl p-8">
              <h2 className="trust-card-title font-display text-lg font-semibold text-[var(--text)] mb-3">Clear communication</h2>
              <p className="trust-card-body text-[var(--text-muted)] text-[15px] leading-relaxed">
                Simple English, prompt replies. You always know the status of your work. No jargon, no surprises—straightforward updates so you stay in control.
              </p>
            </div>
            <div className="aos-item card-enter-right card-dark card-trust card-float rounded-2xl p-8">
              <h2 className="trust-card-title font-display text-lg font-semibold text-[var(--text)] mb-3">Professional ethics</h2>
              <p className="trust-card-body text-[var(--text-muted)] text-[15px] leading-relaxed">
                Your data and requirements are handled with confidentiality. We work in a professional manner suitable for startups, established businesses, and individuals worldwide.
              </p>
            </div>
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
