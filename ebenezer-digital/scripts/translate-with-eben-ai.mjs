/**
 * Fill missing translations with Eben AI (Ollama on this machine).
 * Skips locales that are already saved. Safe to stop and run again.
 *
 *   node scripts/translate-with-eben-ai.mjs --all
 */
import fs from "fs";
import path from "path";

const base = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const model = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";
const chunkSize = Math.max(1, Number(process.env.EBEN_CHUNK || "2"));

const LOCALES = [
  "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
  "it", "nl", "pl", "vi", "th", "sv", "no", "da", "fi", "cs", "ro",
  "hu", "uk", "he", "fa", "ms", "sw",
  "el", "bg", "sr", "hr", "sk", "lt", "lv", "et", "ne", "sl", "af",
  "ca", "fil", "sq", "am", "km", "lo", "my", "ka", "kk", "uz", "az",
  "be", "eu", "gl", "is", "cy", "ga", "mk", "bs", "hy", "mn",
];

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const writeJson = (file, data) => {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data));
};

function mergeDir(dir, into) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return into;
  for (const name of fs.readdirSync(full)) {
    if (!name.endsWith(".json")) continue;
    const part = JSON.parse(fs.readFileSync(path.join(full, name), "utf8"));
    for (const [locale, value] of Object.entries(part)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        into[locale] = { ...(into[locale] || {}), ...value };
      }
    }
  }
  return into;
}

function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const arrayStart = text.indexOf("[");
  const arrayEnd = text.lastIndexOf("]");
  if (start >= 0 && (arrayStart < 0 || start < arrayStart) && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }
  if (arrayStart >= 0 && arrayEnd > arrayStart) return JSON.parse(text.slice(arrayStart, arrayEnd + 1));
  throw new Error("no json");
}

async function ask(locale, payload) {
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature: 0.2 },
      messages: [
        {
          role: "system",
          content:
            "You are Eben AI. Translate the JSON values into the requested language. Return only JSON with the same shape and keys. Keep {placeholders}, Ebenezer, SaaS, AI, Wi-Fi, URLs, and DNS/CPU/RAM/HTML/CSS/SEO unchanged. No warnings.",
        },
        { role: "user", content: `Language code: ${locale}\n\n${JSON.stringify(payload)}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return parseJson(data?.message?.content || "");
}

async function askRetry(locale, payload) {
  try {
    return await ask(locale, payload);
  } catch (error) {
    console.error("retry", locale, error.message);
    return ask(locale, payload);
  }
}

function chunks(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

async function main() {
  if (process.argv[2] !== "--all") {
    console.error("Usage: node scripts/translate-with-eben-ai.mjs --all");
    process.exit(1);
  }

  const phrases = mergeDir("data/i18n/lesson-phrases", readJson("data/i18n/lesson-phrases.json"));
  const topics = mergeDir("data/i18n/journal-topics", readJson("data/i18n/journal-topics.json"));
  const news = mergeDir("data/i18n/news-articles", readJson("data/i18n/news-articles.json"));
  const phraseEn = readJson("data/i18n/lesson-phrases.en.json");
  const topicEn = readJson("data/i18n/journal-topics.en.json");
  const newsEn = readJson("data/i18n/news-articles.en.json");
  writeJson("data/i18n/lesson-phrases.json", phrases);
  writeJson("data/i18n/journal-topics.json", topics);
  writeJson("data/i18n/news-articles.json", news);

  const health = await fetch(`${base}/api/tags`).catch(() => null);
  if (!health?.ok) {
    console.error(`Eben AI is not running at ${base}. Start Ollama on this machine, then run this command again.`);
    console.error(`Already merged saved translations. Phrases ${Object.keys(phrases).length}, topic locales ${Object.keys(topics).length}, news locales ${Object.keys(news).length}.`);
    process.exit(1);
  }

  for (const locale of LOCALES) {
    if (!phrases[locale]?.startH) {
      console.log("phrases", locale);
      phrases[locale] = await askRetry(locale, phraseEn);
      writeJson("data/i18n/lesson-phrases.json", phrases);
    }

    topics[locale] = topics[locale] || {};
    const missingTopics = topicEn.filter((topic) => !topics[locale][topic.key]?.titleBase);
    for (const group of chunks(missingTopics, chunkSize)) {
      console.log("topics", locale, group.map((topic) => topic.key).join(","));
      const translated = await askRetry(locale, group);
      const list = Array.isArray(translated) ? translated : Object.values(translated);
      for (const topic of list) {
        if (topic?.key && topic.titleBase) topics[locale][topic.key] = topic;
      }
      writeJson("data/i18n/journal-topics.json", topics);
    }

    news[locale] = news[locale] || {};
    const missingNews = newsEn.filter((story) => !news[locale][story.slug]?.title);
    for (const group of chunks(missingNews, 1)) {
      console.log("news", locale, group[0].slug);
      const translated = await askRetry(locale, group[0]);
      const story = translated.slug ? translated : translated[group[0].slug];
      if (story?.title && story?.dek && Array.isArray(story.body)) {
        news[locale][group[0].slug] = { ...story, slug: group[0].slug };
        writeJson("data/i18n/news-articles.json", news);
      }
    }
  }

  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
