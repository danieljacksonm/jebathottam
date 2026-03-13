import { AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";

export default function CareersPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="section-reveal container-wide max-w-4xl text-center">
          <AnimateOne variant="blur-up">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">Careers</p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Join our team
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-10">
              We are always looking for talented people who care about quality and clear communication. If you excel at data work, web development, or travel support, we would like to hear from you.
            </p>
            <a
              href="mailto:careers@ebenezerdigitalservices.com"
              className="btn-outline-hover btn-ripple inline-flex items-center justify-center rounded-full border-2 border-[var(--accent)]/50 text-[var(--accent)] px-8 py-4 text-base font-semibold hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              View open roles
            </a>
          </AnimateOne>
        </div>
      </section>
    </ScrollParallax>
  );
}
