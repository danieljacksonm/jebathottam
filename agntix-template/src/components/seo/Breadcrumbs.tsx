import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

type Crumb = { name: string; href?: string };

export function Breadcrumbs({
  locale,
  items,
}: {
  locale: string;
  items: Crumb[];
}) {
  const schemaItems = items.map((item, i) => ({
    name: item.name,
    path: item.href ?? (i === 0 ? "/" : "#"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-6 md:px-8">
      <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-mist">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-gold/70">/</span>}
              {last || !item.href ? (
                <span className="text-white/80">{item.name}</span>
              ) : (
                <Link href={item.href} className="transition hover:text-gold">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={breadcrumbJsonLd(
          locale,
          schemaItems.filter((item) => item.path !== "#"),
        )}
      />
    </nav>
  );
}
