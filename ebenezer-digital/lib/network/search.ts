import { getLiveTools } from "./registry";
import type { NetworkToolMeta } from "./types";

function scoreTool(tool: NetworkToolMeta, tokens: string[]): number {
  let score = 0;
  const name = tool.name.toLowerCase();
  const desc = tool.description.toLowerCase();
  const cat = tool.category.toLowerCase();
  const keys = [...tool.keywords, ...(tool.synonyms || [])].map((k) => k.toLowerCase());
  for (const token of tokens) {
    if (!token) continue;
    if (name === token) score += 12;
    if (name.includes(token)) score += 8;
    if (keys.some((k) => k === token || k.includes(token))) score += 6;
    if (desc.includes(token)) score += 3;
    if (cat.includes(token)) score += 2;
  }
  return score;
}

export function searchNetworkTools(query: string, limit = 24): NetworkToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return getLiveTools().slice(0, limit);
  const tokens = q.split(/[^a-z0-9+]+/i).filter(Boolean);
  return getLiveTools()
    .map((t) => ({ t, score: scoreTool(t, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
    .slice(0, limit)
    .map((x) => x.t);
}
