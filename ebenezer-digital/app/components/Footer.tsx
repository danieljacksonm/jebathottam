import Link from "next/link";
import FooterReveal from "./FooterReveal";
import ViewerCounter from "./ViewerCounter";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-14 px-4">
      <FooterReveal>
        <div className="container-wide flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="footer-item">
            <p className="font-display font-semibold text-[var(--text)]">Ebenezer Digital Services</p>
            <p className="footer-tagline-reveal text-[var(--text-muted)] text-sm mt-1 max-w-xs">
              Reliable digital work for businesses everywhere.
            </p>
          </div>
          <nav className="footer-item flex flex-col sm:flex-row gap-6 sm:gap-8 text-sm">
            <span className="footer-nav-label text-[var(--text-muted)] font-medium uppercase tracking-wider text-xs">
              Navigate
            </span>
            <div className="flex flex-wrap gap-6 sm:gap-8 text-[var(--text-muted)]">
              <Link href="/services" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Services
              </Link>
              <Link href="/products" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Products
              </Link>
              <Link href="/stats" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                By the numbers
              </Link>
              <Link href="/process" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                How it works
              </Link>
              <Link href="/work" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Our work
              </Link>
              <Link href="/website-showcase" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Website showcase
              </Link>
              <Link href="/completed-projects" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Completed projects
              </Link>
              <Link href="/testimonials" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Testimonials
              </Link>
              <Link href="/careers" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Careers
              </Link>
              <Link href="/contact" className="footer-link-hover link-hover-underline hover:text-[var(--accent)]">
                Contact
              </Link>
            </div>
          </nav>
        </div>
        <div className="footer-item container-wide mt-10 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="footer-copyright-reveal text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} Ebenezer Digital Services. All rights reserved.
          </p>
          <span className="viewer-counter-reveal inline-flex">
            <ViewerCounter />
          </span>
        </div>
      </FooterReveal>
    </footer>
  );
}
