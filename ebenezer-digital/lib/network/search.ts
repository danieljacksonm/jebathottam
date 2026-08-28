import { getLiveTools } from "./registry";
import type { NetworkToolMeta } from "./types";

/** Natural-language intents → preferred tool slugs (boosted hard). */
const INTENT_RULES: { re: RegExp; slugs: string[] }[] = [
  { re: /make.*(photo|image|pic|jpg|jpeg|png).*small|compress.*(image|photo|pic|jpg|png)|reduce.*(image|photo|file).*size/i, slugs: ["image-compressor"] },
  { re: /convert.*(photo|image|pic).*webp|to\s*webp|webp\s*convert/i, slugs: ["image-converter"] },
  { re: /resize.*(image|photo|pic)|change.*(image|photo).*size|scale.*(image|photo)/i, slugs: ["image-resizer"] },
  { re: /gst|goods\s*and\s*services\s*tax/i, slugs: ["gst-calculator"] },
  { re: /format\s*json|pretty\s*json|beautify\s*json|json\s*formatter/i, slugs: ["json-formatter"] },
  { re: /validat.*json|check\s*json|json\s*error/i, slugs: ["json-validator"] },
  { re: /qr\s*code|generate\s*qr/i, slugs: ["qr-code-generator"] },
  { re: /meta\s*(tag|description)|seo\s*meta|open\s*graph/i, slugs: ["meta-tag-generator", "open-graph-generator"] },
  { re: /robots\.?txt/i, slugs: ["robots-txt-generator"] },
  { re: /sitemap/i, slugs: ["sitemap-generator"] },
  { re: /convert\s*unit|unit\s*convert/i, slugs: ["unit-converter"] },
  { re: /clean\s*text|remove\s*extra\s*space|text\s*cleaner/i, slugs: ["text-cleaner"] },
  { re: /word\s*count|count\s*words|character\s*count/i, slugs: ["word-counter"] },
  { re: /jwt|decode\s*token/i, slugs: ["jwt-decoder"] },
  { re: /base64|encode\s*base/i, slugs: ["base64-encoder"] },
  { re: /uuid|guid\s*generat/i, slugs: ["uuid-generator"] },
  { re: /regex|regular\s*expression/i, slugs: ["regex-tester"] },
  { re: /emi|loan\s*emi/i, slugs: ["emi-calculator", "loan-calculator"] },
  { re: /percent|percentage/i, slugs: ["percentage-calculator"] },
  { re: /prompt|chatgpt|ollama|llm/i, slugs: ["ai-prompt-generator", "prompt-formatter"] },
  { re: /remove\s*pdf|split\s*pdf|pdf\s*page/i, slugs: [] }, // no PDF tools yet — fall through to empty suggestions
];

function scoreTool(tool: NetworkToolMeta, tokens: string[], query: string): number {
  let score = 0;
  const name = tool.name.toLowerCase();
  const desc = tool.description.toLowerCase();
  const cat = tool.category.toLowerCase();
  const keys = [...tool.keywords, ...(tool.synonyms || [])].map((k) => k.toLowerCase());
  const hay = `${name} ${desc} ${keys.join(" ")} ${cat}`;

  for (const rule of INTENT_RULES) {
    if (rule.re.test(query) && rule.slugs.includes(tool.slug)) {
      score += 40;
    }
  }

  if (query.length > 3 && hay.includes(query)) score += 10;

  for (const token of tokens) {
    if (!token) continue;
    if (name === token) score += 12;
    if (name.includes(token)) score += 8;
    if (keys.some((k) => k === token || k.includes(token) || token.includes(k))) score += 6;
    if (desc.includes(token)) score += 3;
    if (cat.includes(token)) score += 2;
    if (tool.slug.includes(token)) score += 5;
  }
  return score;
}

export function searchNetworkTools(query: string, limit = 24): NetworkToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return getLiveTools().slice(0, limit);
  const tokens = q.split(/[^a-z0-9+]+/i).filter(Boolean);
  return getLiveTools()
    .map((t) => ({ t, score: scoreTool(t, tokens, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
    .slice(0, limit)
    .map((x) => x.t);
}
