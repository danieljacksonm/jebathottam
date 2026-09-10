export function GeoAnswer({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-3xl border-b border-[var(--line)] px-5 py-8 text-base leading-relaxed text-soft-gray md:px-8">
      {children}
    </p>
  );
}
