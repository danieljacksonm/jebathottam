import phrases from "@/data/i18n/lesson-phrases.json";
import topicPacks from "@/data/i18n/journal-topics.json";
import { getEduPostBySlug, type EduAngle, type EduPost } from "@/lib/edu-blog";

type TopicTr = {
  titleBase: string;
  category: string;
  metaphor: string;
  what: string;
  steps: string[];
  funFacts: string[];
  why: string;
};

type Phrases = {
  learn: string;
  angles: Record<EduAngle, string>;
  startH: string;
  startP: string;
  oneLine: string;
  whyH: string;
  whyP: string;
  takeH: string;
  howH: string;
  closerH: string;
  closerP: string;
  tryH: string;
  tryP: string;
  dailyH: string;
  dailyP: string;
  dayH: string;
  dayP: string;
  partsH: string;
  partsP: string;
  missing: string;
  historyH: string;
  historyP: string;
  safeH: string;
  safeP: string;
  mythH: string;
  mythP: string;
  exploreH: string;
  exploreP: string;
  factsH: string;
  factsP: string;
  faqH: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  q4: string;
  a4: string;
  todayH: string;
  t1: string;
  t2: string;
  t3: string;
  aiH: string;
  aiP: string;
  storeH: string;
  storeP: string;
};

const PHRASES = phrases as Record<string, Phrases>;
const TOPICS = topicPacks as Record<string, Record<string, TopicTr>>;

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function angleBody(angle: EduAngle, p: Phrases, vars: Record<string, string>): string {
  if (angle === "how-it-works") {
    return `## ${fill(p.howH, vars)}\n\n${vars.steps}\n\n## ${fill(p.closerH, vars)}\n\n${fill(p.closerP, vars)}\n\n## ${fill(p.tryH, vars)}\n\n${fill(p.tryP, vars)}`;
  }
  if (angle === "everyday-life") {
    return `## ${fill(p.dailyH, vars)}\n\n${fill(p.dailyP, vars)}\n\n## ${fill(p.dayH, vars)}\n\n${fill(p.dayP, vars)}`;
  }
  if (angle === "tiny-parts") {
    return `## ${fill(p.partsH, vars)}\n\n${vars.steps}\n\n${fill(p.partsP, vars)}`;
  }
  if (angle === "simple-history") {
    return `## ${fill(p.historyH, vars)}\n\n${fill(p.historyP, vars)}`;
  }
  if (angle === "stay-safe") {
    return `## ${fill(p.safeH, vars)}\n\n${fill(p.safeP, vars)}`;
  }
  if (angle === "myths-vs-truth") {
    return `## ${fill(p.mythH, vars)}\n\n${fill(p.mythP, vars)}`;
  }
  return `## ${fill(p.exploreH, vars)}\n\n${fill(p.exploreP, vars)}`;
}

export function hasJournalLocale(locale: string): boolean {
  return locale !== "en" && Boolean(PHRASES[locale]?.startH) && Boolean(TOPICS[locale]);
}

/** Full lesson text for a generated journal article. English stays on the original post. */
export function localizedJournalArticle(
  slug: string,
  locale: string
): { title: string; excerpt: string; body: string; category: string } | null {
  if (!hasJournalLocale(locale)) return null;
  const post = getEduPostBySlug(slug);
  if (!post?.topicKey || !post.angle) return null;
  const topic = TOPICS[locale]?.[post.topicKey];
  const phrase = PHRASES[locale];
  if (!topic?.titleBase || !topic.what || !phrase) return null;

  const steps = (topic.steps || []).map((step, i) => `${i + 1}. ${step}`).join("\n");
  const facts = (topic.funFacts || []).map((fact) => `• ${fact}`).join("\n");
  const takeaways = (topic.steps || []).slice(0, 3).map((step) => `✓ ${step}`).join("\n");
  const vars: Record<string, string> = {
    titleBase: topic.titleBase,
    metaphor: topic.metaphor,
    what: topic.what,
    why: topic.why,
    step0: topic.steps?.[0] || topic.what,
    steps,
    title: "",
  };
  const title = fill(phrase.angles[post.angle] || phrase.angles["how-it-works"], vars);
  vars.title = title;
  const missing = fill(phrase.missing, vars);
  const body = [
    `## ${fill(phrase.startH, vars)}`,
    "",
    fill(phrase.startP, vars),
    "",
    topic.what,
    "",
    `> **${fill(phrase.oneLine, vars)}** ${topic.why}`,
    "",
    `## ${fill(phrase.whyH, vars)}`,
    "",
    fill(phrase.whyP, vars),
    "",
    `### ${fill(phrase.takeH, vars)}`,
    "",
    takeaways,
    "",
    angleBody(post.angle, phrase, { ...vars, missing }),
    "",
    `## ${fill(phrase.factsH, vars)}`,
    "",
    facts,
    "",
    fill(phrase.factsP, vars),
    "",
    `## ${fill(phrase.faqH, vars)}`,
    "",
    `### ${fill(phrase.q1, vars)}`,
    fill(phrase.a1, vars),
    "",
    `### ${fill(phrase.q2, vars)}`,
    fill(phrase.a2, vars),
    "",
    `### ${fill(phrase.q3, vars)}`,
    fill(phrase.a3, vars),
    "",
    `### ${fill(phrase.q4, vars)}`,
    fill(phrase.a4, vars),
    "",
    `## ${fill(phrase.todayH, vars)}`,
    "",
    `1. ${fill(phrase.t1, vars)}`,
    `2. ${fill(phrase.t2, vars)}`,
    `3. ${fill(phrase.t3, vars)}`,
    "",
    `## ${fill(phrase.aiH, vars)}`,
    "",
    fill(phrase.aiP, vars),
    "",
    `## ${fill(phrase.storeH, vars)}`,
    "",
    fill(phrase.storeP, vars),
  ].join("\n");

  return {
    title,
    excerpt: topic.what,
    body,
    category: `${phrase.learn} · ${topic.category}`,
  };
}

export function localizeJournalCard(post: EduPost, locale: string): EduPost {
  const localized = localizedJournalArticle(post.slug, locale);
  if (!localized) return post;
  return {
    ...post,
    title: localized.title,
    excerpt: localized.excerpt,
    content: localized.body,
    category: localized.category,
    seoTitle: `${localized.title} | Ebenezer Journal`,
    seoDescription: localized.excerpt.slice(0, 155),
  };
}
