import Link from "next/link";
import { FOOTER_HELP, FOOTER_SHOP, SITE_NAME, SITE_TAGLINE, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--bg-raised)]">
      <div className="container-x py-14 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-display text-2xl tracking-[0.08em]">RAJU STICKERS</p>
          <p className="mt-2 text-[var(--text-xs)] tracking-[0.22em] uppercase text-[var(--accent)]">
            {SITE_TAGLINE}
          </p>
          <p className="mt-5 text-sm text-[var(--ink-2)] max-w-xs leading-relaxed">
            Premium car wraps and vinyl finishes. Bold finishes. Clean installs. Drive different.
          </p>
          <p className="mt-6 text-sm text-[var(--ink-3)] space-y-1">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="block hover:text-[var(--ink)]">
              {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="block hover:text-[var(--ink)]">
              {SUPPORT_PHONE}
            </a>
          </p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-display text-sm tracking-[0.14em] mb-4">Shop</h2>
          <ul className="space-y-2.5 text-sm text-[var(--ink-2)]">
            {FOOTER_SHOP.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--ink)] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display text-sm tracking-[0.14em] mb-4">Help</h2>
          <ul className="space-y-2.5 text-sm text-[var(--ink-2)]">
            {FOOTER_HELP.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--ink)] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="hover:text-[var(--ink)] transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--ink)] transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display text-sm tracking-[0.14em] mb-4">Newsletter</h2>
          <p className="text-sm text-[var(--ink-2)] mb-4">
            New finishes and care tips. No spam.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="container-x py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[var(--text-xs)] text-[var(--ink-3)] tracking-[0.08em] uppercase">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="flex gap-4">
            <Link href="/billing" className="hover:text-[var(--ink)]">
              Billing
            </Link>
            <Link href="/admin/products" className="hover:text-[var(--ink)]">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
