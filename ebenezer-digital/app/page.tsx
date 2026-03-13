import Image from "next/image";
import Link from "next/link";
import { AnimateSection, AnimateOne } from "./components/AnimateOnScroll";
import ScrollParallax from "./components/ScrollParallax";
import TextReveal from "./components/TextReveal";
import MagneticButton from "./components/MagneticButton";
import CharReveal from "./components/CharReveal";
import { IMG } from "@/lib/images";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <ScrollParallax className="hero-banner relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 hero-banner-bg">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={IMG.hero}
              alt="Professional workspace - Ebenezer Digital Services"
              fill
              sizes="100vw"
              className="object-cover img-parallax-inner"
              priority
            />
          </div>
          <div className="absolute inset-0 hero-banner-overlay" aria-hidden />
        </div>
        <div className="hero-ambient" aria-hidden>
          <span className="hero-ambient-line hero-ambient-line-1" />
          <span className="hero-ambient-line hero-ambient-line-2" />
          <span className="hero-ambient-line hero-ambient-line-3" />
          <span className="hero-ambient-shimmer" />
          <span className="float-dot absolute top-[20%] right-[12%] w-2 h-2" aria-hidden />
          <span className="float-dot absolute bottom-[30%] left-[8%] w-2 h-2" style={{ animationDelay: "-1.5s" }} aria-hidden />
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-5rem)] pt-hero pb-24 section-padding">
          <div className="hero-content-reveal container-wide max-w-4xl relative z-20">
            <p className="hero-banner-item hero-banner-item-1 hero-parallax-layer hero-parallax-layer-1 font-display text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)] mb-5 hero-eyebrow hero-eyebrow-expand">
              Digital work, done right
            </p>
            <h1 className="hero-banner-item hero-banner-item-2 hero-parallax-layer hero-parallax-layer-2 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-[var(--text)] mb-3 hero-headline">
              <span className="hero-headline-wrap inline-block">
                <TextReveal text="We handle the work." as="span" delay={200} wordDelay={50} />
                <br />
                <TextReveal text="You run the business." as="span" delay={600} wordDelay={45} className="text-gradient" />
              </span>
            </h1>
            <p className="hero-banner-item hero-banner-item-3 hero-parallax-layer hero-parallax-layer-3 font-display text-lg sm:text-xl text-[var(--accent)]/90 mb-6 hero-tagline">
              <CharReveal text={"That's the deal."} as="span" mode="up" charDelay={42} triggerOnView={false} />
            </p>
            <p className="hero-banner-item hero-banner-item-4 hero-parallax-layer hero-parallax-layer-4 text-base sm:text-lg text-[var(--text-muted)] max-w-xl mb-8 hero-sub">
              On time. On budget. Every time. Data entry, travel, web dev & virtual support—for clients everywhere.
            </p>
            <div className="hero-banner-item hero-banner-item-5 hero-parallax-layer hero-parallax-layer-5 flex flex-col sm:flex-row sm:items-center gap-4 hero-cta">
              <MagneticButton
                href="/contact"
                className="btn-primary btn-shine btn-ripple w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] px-8 py-4 text-base font-bold hover:bg-[var(--accent-hover)] transition-colors btn-hover shadow-lg shadow-[var(--accent)]/30"
              >
                <span className="link-arrow-hover btn-arrow-wiggle">Get my free quote <span>→</span></span>
              </MagneticButton>
              <span className="hero-pill pill-pulse hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-sm font-medium text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden /> Reply in 24h
              </span>
              <Link
                href="/work"
                className="btn-outline-hover w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-[var(--text-muted)]/40 text-[var(--text)] px-8 py-4 text-base font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] btn-hover"
              >
                See our work
              </Link>
            </div>
          </div>
          <div className="hero-ticker-wrap hero-ticker-pause absolute left-0 right-0 bottom-20 sm:bottom-24" aria-hidden>
            <div className="hero-ticker">
              <span>Data entry</span>
              <span className="text-[var(--accent)]">·</span>
              <span>Travel booking</span>
              <span className="text-[var(--accent)]">·</span>
              <span>Web development</span>
              <span className="text-[var(--accent)]">·</span>
              <span>Virtual assistance</span>
              <span className="text-[var(--accent)]">·</span>
              <span>Trusted worldwide</span>
              <span className="text-[var(--accent)]">·</span>
            </div>
            <div className="hero-ticker ticker-row-reverse mt-2 opacity-60">
              <span>On time</span>
              <span className="text-[var(--accent)]">·</span>
              <span>On budget</span>
              <span className="text-[var(--accent)]">·</span>
              <span>Global clients</span>
              <span className="text-[var(--accent)]">·</span>
            </div>
          </div>
          <Link
            href="/trust"
            className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            aria-label="Explore site"
          >
            <span className="hero-scroll-cue-bounce text-xs uppercase tracking-widest">Explore</span>
            <span className="hero-scroll-line" />
          </Link>
        </div>
      </ScrollParallax>

      {/* Explore – links to all sections (separate pages) */}
      <ScrollParallax>
        <section className="section-padding border-t border-[var(--border)] bg-[var(--bg-soft)]">
          <div className="section-reveal container-wide">
            <AnimateOne variant="zoom-in">
              <h2 className="section-h2-reveal font-display text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 text-center">
                Explore our site
              </h2>
              <p className="section-sub-p text-[var(--text-muted)] text-center max-w-xl mx-auto mb-12">
                Each section has its own page. Jump to what interests you.
              </p>
            </AnimateOne>
            <AnimateSection variant="slide-up-strong" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { href: "/trust", label: "Why clients trust us" },
                { href: "/stats", label: "By the numbers" },
                { href: "/services", label: "Services" },
                { href: "/products", label: "Products" },
                { href: "/process", label: "How we work" },
                { href: "/work", label: "Our work" },
                { href: "/website-showcase", label: "Website showcase" },
                { href: "/completed-projects", label: "Completed projects" },
                { href: "/why", label: "Why choose us" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/careers", label: "Careers" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="aos-item card-dark rounded-xl p-5 card-shine-bottom border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors group"
                >
                  <span className="font-display font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </AnimateSection>
          </div>
        </section>
      </ScrollParallax>
    </>
  );
}
