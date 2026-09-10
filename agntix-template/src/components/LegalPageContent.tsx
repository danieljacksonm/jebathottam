type Section = {
  title: string;
  body?: string;
  intro?: string;
  bullets?: string[];
};

type Props = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  closing?: string;
};

export function LegalPageContent({
  title,
  updated,
  intro,
  sections,
  closing,
}: Props) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <div className="rounded-3xl border border-[var(--line)] bg-navy-mid/40 px-6 py-10 md:px-10 md:py-12">
        <h1 className="font-display text-4xl text-white md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-mist">{updated}</p>
        <p className="mt-6 leading-relaxed text-soft-gray">{intro}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-2xl text-gold-bright">
                {section.title}
              </h2>
              {section.intro ? (
                <p className="mt-3 text-sm leading-relaxed text-soft-gray md:text-base">
                  {section.intro}
                </p>
              ) : null}
              {section.body ? (
                <p className="mt-3 text-sm leading-relaxed text-soft-gray md:text-base">
                  {section.body}
                </p>
              ) : null}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-soft-gray md:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        {closing ? (
          <div className="mt-12 border-t border-[var(--line)] pt-8">
            {closing.split("\n").map((line) => (
              <p key={line} className="text-sm text-mist/80">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
