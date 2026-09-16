export function BrandStatement() {
  return (
    <section className="border-b border-[var(--line)] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div className="container-x py-20 sm:py-28 lg:py-32 relative">
        <p className="section-kicker mb-8">The Attitude</p>
        <h2 className="statement max-w-5xl">
          <span className="statement-line">Your Car.</span>
          <span className="statement-line">Your Style.</span>
          <span className="statement-line text-[var(--accent)]">Your Rules.</span>
        </h2>
        <p className="mt-10 max-w-md text-[var(--ink-2)] text-[var(--text-md)] leading-relaxed">
          Chrome. Carbon. Metallic. Matte. Finishes built to be seen — not forgotten.
        </p>
      </div>
    </section>
  );
}
