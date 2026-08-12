"use client";

export function StoreMarquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="store-marquee" aria-hidden>
      <div className="store-marquee-track">
        {loop.map((item, i) => (
          <p key={`${item}-${i}`}>
            {item} <span>/</span>
          </p>
        ))}
      </div>
    </div>
  );
}
