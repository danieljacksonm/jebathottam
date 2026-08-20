import { readFileSync } from "fs";
import { join } from "path";
import { STORE_PRODUCTS } from "@/app/products/data";
import { SITE_NAV } from "./site-nav";

function productCatalog(): string {
  return STORE_PRODUCTS.slice(0, 14)
    .map((p) => {
      const price = p.isFree ? "Free" : `₹${p.price}`;
      const files = (p.pdfs || []).map((x) => x.label).slice(0, 4).join("; ") || "digital kit";
      return `- ${p.name} (${p.slug}) — ${price}. ${p.tagline}. Includes: ${files}. URL: ${SITE_NAV.store}/${p.slug}`;
    })
    .join("\n");
}

export function loadEbenKnowledge(): string {
  let base = "";
  try {
    base = readFileSync(join(process.cwd(), "data", "eben-knowledge.md"), "utf8");
  } catch {
    base = "Eben AI helps Ebenezer Digital users on news, journal, store, and chat.";
  }

  const catalog = productCatalog();
  return `${base.slice(0, 3500)}

## Store catalog (use only these — do not invent products)
${catalog}

## Site URLs
- Main studio: ${SITE_NAV.home}
- Journal / learning: ${SITE_NAV.journal}
- World news: ${SITE_NAV.news}
- Digital store: ${SITE_NAV.store}
- SaaS billing: ${SITE_NAV.saas}
- Eben AI chat: ${SITE_NAV.ai}
`.slice(0, 9000);
}
