import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-[var(--text-xs)] tracking-[0.04em] text-[var(--ink-3)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[var(--ink)] transition-colors uppercase tracking-[0.1em]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[var(--ink-2)] uppercase tracking-[0.1em]" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
