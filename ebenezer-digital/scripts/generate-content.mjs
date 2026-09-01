#!/usr/bin/env npx tsx
/**
 * Batch content generator — reads data/content/topics.json and writes .article.json files.
 * Usage: npm run generate:content [-- --surface=studio-insights] [--limit=50]
 */
import { loadTopics, generateFromTopic, saveArticle } from "../lib/content-engine";

const surface = process.argv.find((a) => a.startsWith("--surface="))?.split("=")[1];
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || 200);

const topics = loadTopics().filter((t) => !surface || t.surface === surface).slice(0, limit);
let saved = 0;
let skipped = 0;

for (const topic of topics) {
  const article = generateFromTopic(topic);
  const result = saveArticle(article);
  if (result.issues.length) {
    console.log(`[gate] ${topic.slug}: ${result.issues.join("; ")}`);
    skipped++;
  } else {
    saved++;
  }
  console.log(`[ok] ${topic.surface}/${topic.slug}`);
}

console.log(`\nDone. Saved: ${saved}, with quality notes: ${skipped}`);
