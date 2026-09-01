type Section = {
  title: string;
  body: string;
};

type Props = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
};

export function LegalPageContent({ title, updated, intro, sections }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <div className="glass-panel rounded-3xl px-6 py-10 md:px-10 md:py-12">
        <h1 className="font-display text-4xl text-white md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-mist">{updated}</p>
        <p className="mt-6 text-soft-gray leading-relaxed">{intro}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-2xl text-gold-bright">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-soft-gray md:text-base">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
