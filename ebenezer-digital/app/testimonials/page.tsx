import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";

export default function TestimonialsPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-left">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              What our clients say
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] max-w-xl mb-16">
              Hear from businesses and individuals who have worked with us.
            </p>
          </AnimateOne>
          <AnimateSection variant="stagger-slow" className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Professional, on time, and great communication. They handled our data migration and it was seamless.", name: "Sarah M.", role: "Operations Director", company: "Retail Co." },
              { quote: "We needed a booking system fast. Ebenezer delivered exactly what we asked for, within budget and ahead of schedule.", name: "James K.", role: "Owner", company: "Travel Agency" },
              { quote: "Ongoing support has been reliable. We keep coming back for more projects—they feel like an extension of our team.", name: "Lisa T.", role: "Founder", company: "Consulting Firm" },
            ].map((t) => (
              <div key={t.name} className="aos-item card-dark rounded-2xl p-8 card-shine-bottom border border-[var(--border)]">
                <p className="text-[var(--text)] text-lg leading-relaxed mb-6 font-serif">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-display font-semibold text-[var(--text)]">{t.name}</p>
                <p className="text-[var(--text-muted)] text-sm">{t.role}, {t.company}</p>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
