import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] tracking-tight">
          Sri Krishna Mobiles
        </h1>
        <p className="text-lg text-[var(--muted)]">
          Mobile spares & accessories. Screens, batteries, covers, cables and more. Secure checkout with PayPal.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] text-white px-6 py-3 font-medium hover:bg-[var(--accent-dark)] transition-colors"
          >
            Shop now
          </Link>
          <Link
            href="/shop?category=accessories"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-6 py-3 font-medium text-[var(--foreground)] hover:bg-[var(--border)]/50 transition-colors"
          >
            Accessories
          </Link>
        </div>
      </div>
    </div>
  );
}
