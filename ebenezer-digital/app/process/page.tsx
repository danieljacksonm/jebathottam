import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import ClipReveal from "../components/ClipReveal";

const steps = [
  { step: 1, title: "You contact us", body: "Reach out by email or WhatsApp with a short description of what you need. No commitment yet—just tell us about your project." },
  { step: 2, title: "Requirement discussion", body: "We ask a few questions to understand your goals, format, and preferences. This helps us give you an accurate quote and timeline." },
  { step: 3, title: "Clear quote & timeline", body: "You receive a clear quote and delivery timeline. We only start work once you are satisfied with the terms." },
  { step: 4, title: "Work execution", body: "We do the work and keep you updated. If anything changes, we communicate immediately so there are no surprises." },
  { step: 5, title: "Delivery & support", body: "We deliver as agreed. If you need small revisions or have questions, we are here to support you." },
];

export default function ProcessPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-left">
            <ClipReveal direction="left" delay={100}>
              <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                How we work with you
              </h1>
            </ClipReveal>
            <p className="section-sub-p process-intro-p text-[var(--text-muted)] max-w-xl mb-8 text-serif text-lg">
              A simple, transparent process from first message to final delivery.
            </p>
            <div className="line-expand-center mb-12" aria-hidden />
          </AnimateOne>
          <AnimateSection variant="slide-up" className="process-line-wrap max-w-2xl mx-auto relative">
            <div className="process-line" aria-hidden />
            {steps.map((item) => (
              <div key={item.step} className="aos-item flex gap-6 relative pl-14 pb-12 last:pb-0">
                <div className="step-ring-wrap absolute left-0 flex-shrink-0 w-12 h-12">
                  <span className="step-ring rounded-full absolute inset-0" aria-hidden />
                  <div className="step-num step-num-hover absolute left-0 top-0 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center font-display font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h2 className="process-step-title font-display text-lg font-semibold text-[var(--text)] mb-2">{item.title}</h2>
                  <p className="process-step-body text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
