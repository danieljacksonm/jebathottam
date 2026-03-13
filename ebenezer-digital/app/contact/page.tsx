import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import ClipReveal from "../components/ClipReveal";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)]">
        <div className="section-reveal container-wide max-w-4xl">
          <AnimateOne variant="from-left">
            <ClipReveal direction="left" delay={80}>
              <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
                Contact us
              </h1>
            </ClipReveal>
            <p className="section-intro-p text-[var(--text-muted)] max-w-xl mb-14">
              Send a message with your requirements and we will get back to you as soon as possible.
            </p>
          </AnimateOne>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
            <AnimateSection variant="fade-up" className="list-slide-in lg:col-span-2 space-y-6">
              <div className="aos-item">
                <h2 className="contact-block-label font-display font-semibold text-[var(--text)] mb-2">Email</h2>
                <a href="mailto:contact@ebenezerdigitalservices.com" className="contact-link-lift link-hover-underline text-[var(--accent)] hover:text-[var(--accent-hover)]">
                  contact@ebenezerdigitalservices.com
                </a>
              </div>
              <div className="aos-item">
                <h2 className="contact-block-label font-display font-semibold text-[var(--text)] mb-2">WhatsApp</h2>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="contact-link-lift link-hover-underline text-[var(--accent)] hover:text-[var(--accent-hover)]">
                  +1 (234) 567-890
                </a>
                <p className="text-[var(--text-muted)] text-sm mt-1">Replace with your real number</p>
              </div>
            </AnimateSection>
            <AnimateOne variant="from-right" className="lg:col-span-3">
              <div className="card-dark contact-card-reveal card-shine-bottom rounded-2xl p-8">
                <h2 className="contact-form-heading font-display font-semibold text-[var(--text)] mb-6">Send a message</h2>
                <ContactForm />
              </div>
            </AnimateOne>
          </div>
        </div>
      </section>
    </ScrollParallax>
  );
}
