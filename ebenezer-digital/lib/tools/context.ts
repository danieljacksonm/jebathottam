import { TOOLS, type Tool } from "@/app/tools/data";

/** Build grounded context for Eben AI tools mode — never invent beyond this list. */
export function buildToolsAiContext(limit = 40): string {
  const lines = TOOLS.slice(0, limit).map((t) => {
    const price = [
      t.pricing.free ? t.pricing.freeLabel || "Free plan" : "No free plan",
      t.pricing.paid ? `Paid: ${t.pricing.paid}` : null,
      t.pricing.paidLabel || null,
    ]
      .filter(Boolean)
      .join(" · ");
    return [
      `ID: ${t.id}`,
      `Name: ${t.name}`,
      `Category: ${t.category}`,
      `Tagline: ${t.tagline}`,
      `Best for: ${t.bestFor}`,
      `Pricing: ${price}`,
      `Pros: ${t.pros.slice(0, 3).join("; ")}`,
      `Cons: ${t.cons.slice(0, 2).join("; ")}`,
      `Page: /tools/${t.id}`,
      `Official: ${t.url}`,
    ].join(" | ");
  });
  return `Ebenezer Tools catalog (use only these tools; link /tools/{id}):\n${lines.join("\n")}`;
}

export function searchTools(query: string, limit = 8): Tool[] {
  const q = query.toLowerCase();
  const scored = TOOLS.map((t) => {
    let score = 0;
    const hay = `${t.name} ${t.tagline} ${t.description} ${t.category} ${t.bestFor} ${t.pros.join(" ")}`.toLowerCase();
    for (const token of q.split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 2;
      if (t.category.toLowerCase().includes(token)) score += 3;
      if (t.name.toLowerCase().includes(token)) score += 4;
    }
    if (/video|youtube|short/.test(q) && /video/i.test(t.category + t.name)) score += 5;
    if (/crm|sales/.test(q) && /crm|sales/i.test(t.category + t.name)) score += 5;
    if (/cod|program|developer|ide/.test(q) && /coding|ide|developer/i.test(t.category + t.bestFor + t.name))
      score += 5;
    if (/email|newsletter/.test(q) && /email/i.test(t.category + t.name)) score += 5;
    if (/seo/.test(q) && /seo/i.test(t.category + t.name)) score += 5;
    if (/design|figma|logo|canva/.test(q) && /design|ui|graphic|brand|canva|figma|looka/i.test(t.category + t.name))
      score += 5;
    return { t, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.t);
}
