"use client";

import { useId, useState } from "react";

type FaqItem = { question: string; answer: string };

export function FAQ({ items, title = "Frequently Asked Questions" }: { items: FaqItem[]; title?: string }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby={`${baseId}-title`} className="space-y-6">
      <h2 id={`${baseId}-title`} className="section-title text-xl md:text-2xl">
        {title}
      </h2>
      <div className="border-t border-[var(--line)]">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;
          return (
            <div key={item.question} className="border-b border-[var(--line)]">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="w-full text-left py-4 flex items-center justify-between gap-4 hover:text-[var(--accent)] transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="font-medium text-sm sm:text-base pr-4">{item.question}</span>
                  <span aria-hidden="true" className="text-[var(--accent)] text-lg leading-none shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-4 text-[var(--ink-2)] text-sm leading-relaxed max-w-2xl"
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
