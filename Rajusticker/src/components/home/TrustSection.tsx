const POINTS = [
  { label: "Premium Material", detail: "~150µ PVC · air-release" },
  { label: "Easy Application", detail: "Flexible · bubble-resistant" },
  { label: "Weather Ready", detail: "UV · scratch · water resistant" },
  { label: "Secure Checkout", detail: "Server-validated pricing" },
] as const;

export function TrustSection() {
  return (
    <section className="border-b border-[var(--line)]">
      <div className="container-x py-8 sm:py-10">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {POINTS.map((item, i) => (
            <li
              key={item.label}
              className={`text-center lg:text-left ${i > 0 ? "lg:border-l lg:border-[var(--line)] lg:pl-6" : ""}`}
            >
              <p className="font-display text-xs tracking-[0.16em] text-[var(--ink)]">
                {item.label}
              </p>
              <p className="mt-1.5 text-[11px] text-[var(--ink-3)] tracking-wide">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
