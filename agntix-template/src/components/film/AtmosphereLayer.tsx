/** Continuous atmosphere: fog, drifting leaves, soft light. */
export function AtmosphereLayer({ tone = "mist" }: { tone?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
          className="absolute -left-[10%] top-[10%] h-40 w-[55%] rounded-full blur-3xl opacity-30 cloud-drift"
        style={{
          background:
            tone === "night"
              ? "rgba(120,140,180,0.15)"
              : "rgba(255,255,255,0.18)",
        }}
      />
      <div
        className="absolute top-[35%] hidden h-48 w-[60%] rounded-full blur-3xl opacity-20 cloud-drift md:block"
        style={{
          animationDelay: "22s",
          animationDuration: "75s",
          background:
            tone === "gold"
              ? "rgba(244,210,122,0.16)"
              : "rgba(220,230,240,0.2)",
        }}
      />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute hidden h-1.5 w-1.5 rounded-full bg-white/30 md:block"
          style={{
            left: `${12 + i * 22}%`,
            top: `${20 + (i % 3) * 18}%`,
            animation: `leaf-drift ${14 + i * 2}s linear infinite`,
            animationDelay: `${i * 1.4}s`,
          }}
        />
      ))}
      {(tone === "falls" || tone === "lake") && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent opacity-40" />
      )}
      {tone === "night" && (
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 70}%`,
                opacity: 0.35 + ((i * 17) % 50) / 100,
                animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
