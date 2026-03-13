import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import ClipReveal from "../components/ClipReveal";
import CharReveal from "../components/CharReveal";

export default function WhyPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="blur-up">
            <ClipReveal direction="bottom" delay={80}>
              <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-center mb-4">
                <CharReveal text="Why choose us" as="span" mode="blur" charDelay={50} triggerOnView />
              </h1>
            </ClipReveal>
            <p className="section-sub-p section-sub-p-center text-serif text-[var(--text-muted)] text-center max-w-2xl mx-auto mb-6 text-lg">
              We focus on what matters: getting the job done well, on time, and at a fair price.
            </p>
            <div className="dot-row-reveal mb-12" aria-hidden>
              <span /><span /><span /><span /><span /><span /><span />
            </div>
          </AnimateOne>
          <AnimateSection variant="stagger-slow" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Communication you can count on", body: "We reply quickly and in plain English. You will always know where your project stands." },
              { title: "Quality without the jargon", body: "We deliver work that meets your standards. No technical overload—just results that fit your business." },
              { title: "Affordable pricing", body: "Transparent quotes so you can plan. We aim to offer value that works for startups and established clients alike." },
              { title: "Long-term support", body: "Need follow-up work or small changes? We are here for ongoing support so you can rely on us again and again." },
            ].map((item, i) => (
              <div key={item.title} className={`aos-item text-center why-card-float-${i + 1}`}>
                <h2 className="why-card-title font-display text-lg font-semibold text-[var(--text)] mb-3">{item.title}</h2>
                <p className="why-card-body text-[var(--text-muted)] text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
