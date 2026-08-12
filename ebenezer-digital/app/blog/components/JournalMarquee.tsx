export function JournalMarquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="journal-marquee" aria-hidden>
      <div className="journal-marquee-track">
        {loop.map((item, i) => (
          <p key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap px-2">
            {item}
            <span>/</span>
          </p>
        ))}
      </div>
    </div>
  );
}
