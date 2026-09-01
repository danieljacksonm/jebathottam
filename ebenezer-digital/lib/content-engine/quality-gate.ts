import type { GeneratedArticle } from "./types";

const BANNED = [
  /welcome to the future/i,
  /in today's fast-paced world/i,
  /revolutionize/i,
  /game.?changer/i,
  /unlock the power/i,
];

export function qualityGate(article: GeneratedArticle): { pass: boolean; issues: string[] } {
  const issues: string[] = [];
  const words = article.body.split(/\s+/).filter(Boolean).length;

  if (words < 400) issues.push("Too short (<400 words)");
  if (article.tier === "pillar" && words < 1800) issues.push("Pillar below 1800 words");
  if (article.tier === "standard" && words < 700) issues.push("Standard below 700 words");

  for (const pat of BANNED) {
    if (pat.test(article.body) || pat.test(article.title)) {
      issues.push(`Banned phrase: ${pat.source}`);
    }
  }

  if (!article.title || article.title.length < 20) issues.push("Title too short");
  if (!article.excerpt || article.excerpt.length < 80) issues.push("Excerpt too short");

  const uniqueRatio = new Set(article.body.toLowerCase().split(/\s+/)).size / Math.max(words, 1);
  if (uniqueRatio < 0.35) issues.push("Low vocabulary diversity (possible duplicate content)");

  return { pass: issues.length === 0, issues };
}

export function shouldIndex(article: GeneratedArticle): boolean {
  return qualityGate(article).pass && article.qualityScore >= 70;
}
