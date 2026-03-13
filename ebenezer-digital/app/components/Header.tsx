import Link from "next/link";
import MagneticButton from "./MagneticButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl nav-animate flex items-center">
      <nav className="container-wide w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="logo-reveal logo-hover font-display text-lg font-semibold tracking-tight text-[var(--text)]"
        >
          Ebenezer Digital Services
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/services"
            className="nav-link-stagger nav-link-scale nav-link-underline text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium hidden sm:inline"
          >
            Services
          </Link>
          <Link
            href="/stats"
            className="nav-link-stagger nav-link-scale nav-link-underline text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium hidden md:inline"
          >
            By the numbers
          </Link>
          <Link
            href="/process"
            className="nav-link-stagger nav-link-scale nav-link-underline text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium hidden sm:inline"
          >
            How It Works
          </Link>
          <Link
            href="/products"
            className="nav-link-stagger nav-link-scale nav-link-underline text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium hidden lg:inline"
          >
            Products
          </Link>
          <Link
            href="/testimonials"
            className="nav-link-stagger nav-link-scale nav-link-underline text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium hidden lg:inline"
          >
            Testimonials
          </Link>
          <MagneticButton
            href="/contact"
            className="magnetic-btn btn-ripple inline-flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors btn-hover"
          >
            Get free quote
          </MagneticButton>
        </div>
      </nav>
    </header>
  );
}
