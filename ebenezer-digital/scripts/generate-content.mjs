#!/usr/bin/env npx tsx
/**
 * Batch content generator — reads data/content/topics.json and writes .article.json drafts.
 * Usage:
 *   npm run generate:content [-- --surface=journal] [--limit=20]
 *   npm run generate:content -- --provider=anthropic [--limit=10]
 *
 * Drafts only — review before publishing. Requires ANTHROPIC_API_KEY when --provider=anthropic.
 */
import {
  loadTopics,
  generateFromTopic,
  generateFromTopicWithAnthropic,
  saveArticle,
} from "../lib/content-engine";

const surface = process.argv.find((a) => a.startsWith("--surface="))?.split("=")[1];
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || 20);
const provider = process.argv.find((a) => a.startsWith("--provider="))?.split("=")[1] || "template";

const topics = loadTopics().filter((t) => !surface || t.surface === surface).slice(0, limit);
let saved = 0;
let skipped = 0;
let failed = 0;

for (const topic of topics) {
  try {
    const article =
      provider === "anthropic"
        ? await generateFromTopicWithAnthropic(topic)
        : generateFromTopic(topic);
    const result = saveArticle(article);
    if (result.issues.length) {
      console.log(`[gate] ${topic.slug}: ${result.issues.join("; ")}`);
      skipped++;
    } else {
      saved++;
    }
    console.log(`[draft] ${topic.surface}/${topic.slug} (${article.wordCount} words)`);
  } catch (e) {
    failed++;
    console.error(`[fail] ${topic.slug}:`, e instanceof Error ? e.message : e);
  }
}

console.log(`\nDone. Drafts saved: ${saved}, quality notes: ${skipped}, failed: ${failed}`);
