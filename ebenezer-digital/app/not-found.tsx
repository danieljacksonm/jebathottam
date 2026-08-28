import Link from "next/link";
import { SITE_NAV } from "@/lib/site-nav";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#070708] px-4 py-20 text-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          The link may be old, or the page may have moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={SITE_NAV.home}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
          >
            Home
          </Link>
          <a
            href={SITE_NAV.news}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
          >
            News
          </a>
          <a
            href={SITE_NAV.journal}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
          >
            Journal
          </a>
          <a
            href={SITE_NAV.network}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
          >
            Free Tools
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
